"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { PiBookOpenLight } from "react-icons/pi";
import { HiChevronLeft, HiXMark } from "react-icons/hi2";

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
}

interface SummarizeProps {
  onBack: () => void;
  title: string;
  content: string;
  onSave: (summary: string) => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  preloadedSummary: string | null;
}

export const Summarize = ({ onBack, title, content, onSave, history, onLoadHistory, preloadedSummary }: SummarizeProps) => {
  const [sidebar, setSidebar] = useState(false);
  const [seecontent, setseecontent] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    // Reset states when content changes
    setHasSaved(false);
    setSummary("");
    setLoading(true);

    // If there's a preloaded summary (from history), use it
    if (preloadedSummary) {
      setSummary(preloadedSummary);
      setLoading(false);
      setHasSaved(true); // Already saved in history
      return;
    }

    const summarizeContent = async () => {
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });
        const data = await response.json();
        if (data.summary) {
          setSummary(data.summary);
          // Save to history when summary is generated
          onSave(data.summary);
          setHasSaved(true);
        } else if (data.error) {
          setSummary(`Error: ${data.error}`);
        } else {
          setSummary("No summary generated.");
        }
      } catch (error) {
        console.error("Error summarizing:", error);
        setSummary("Failed to summarize content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (content && !preloadedSummary) {
      summarizeContent();
    }
  }, [content, preloadedSummary]);

  return (
    <div className="w-full h-screen bg-white">
      {seecontent && (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center items-center ">
          <div className="bg-white w-115 h-auto flex flex-col rounded-2xl relative p-6">
            <div className="flex justify-between items-center">
              <p className="text-black font-bold text-lg">{title}</p>
              <button
                onClick={() => setseecontent(false)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl border border-gray-300"
              >
                <HiXMark className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-black">{content}</p>
            </div>
          </div>
        </div>
      )}
      <div className="w-full h-15 flex border-b-2 items-center justify-between p-5">
        <p className="text-2xl font-semibold text-black ">Quiz app</p>
        <header className="flex justify-end items-center p-4 gap-4 h-16">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>

      <div className="w-full h-full flex">
        {(sidebar && (
          <div className="h-full w-80 border-r-2 border-[#e4e4e7] flex flex-col pt-5 p-5">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold text-black">History</p>
              <GoSidebarExpand 
                onClick={() => setSidebar(false)}
                className="text-black w-8 h-8 cursor-pointer" 
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-[#71717A] text-sm">No history yet</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onLoadHistory(item)}
                    className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                  >
                    <p className="text-black font-medium truncate">{item.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )) || (
          <div className="h-full w-[4%] border-r-2 border-[#e4e4e7]  flex justify-center pt-5">
            <GoSidebarCollapse
              onClick={() => setSidebar(true)}
              className="text-black w-8 h-8 cursor-pointer"
            />
          </div>
        )}

        <div className="w-full h-full flex flex-col px-72 items-center pt-10 ">
          <div className="w-214 mb-10">
            <button 
              onClick={onBack}
              className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center cursor-pointer"
            >
              <HiChevronLeft />
            </button>
          </div>

          <div className="w-214 h-110 border  rounded-xl flex justify-center">
            <div className="flex-col">
              <div className="w-200 h-15 flex gap-2 items-center">
                <PiStarFourBold className="text-black w-6 h-6" />

                <p className="font-semibold text-2xl text-black">
                  Article Quiz Generator
                </p>
              </div>
              <div className="w-200 h-15 flex gap-2 items-center">
                <PiBookOpenLight />

                <p className="text-[#737373] font-semibold">
                  Summarized content
                </p>
              </div>

              <div className="w-200 min-h-50 py-4">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#737373]">Summarizing with AI...</p>
                  </div>
                ) : (
                  <p className="text-black whitespace-pre-wrap">{summary}</p>
                )}
              </div>

              <div className="w-200 h-20 flex items-end justify-between">
                <button
                  onClick={() => setseecontent(true)}
                  className="w-40 h-10 border rounded-xl cursor-pointer bg-white"
                >
                  <p>See content</p>
                </button>
                <button className="w-40 h-10 border rounded-xl cursor-pointer bg-black">
                  <p className="text-white">Take a quiz</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
