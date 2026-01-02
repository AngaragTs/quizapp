"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { PiStarFourBold } from "react-icons/pi";
import { PiBookOpenLight } from "react-icons/pi";
import { HiChevronLeft, HiXMark } from "react-icons/hi2";

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
};

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
}

interface SummarizeProps {
  onBack: () => void;
  onTakeQuiz: () => void;
  title: string;
  content: string;
  onSave: (summary: string, articleId?: string) => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  preloadedSummary: string | null;
}

export const Summarize = ({
  onBack,
  onTakeQuiz,
  title,
  content,
  onSave,
  history,
  onLoadHistory,
  preloadedSummary,
}: SummarizeProps) => {
  const [sidebar, setSidebar] = useState(false);
  const [seecontent, setseecontent] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setHasSaved(false);
    setSummary("");
    setLoading(true);

    if (preloadedSummary) {
      setSummary(preloadedSummary);
      setLoading(false);
      setHasSaved(true);
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

          try {
            const saveResponse = await fetch("/api/articles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title,
                content,
                summary: data.summary,
              }),
            });

            if (saveResponse.ok) {
              const savedArticle = await saveResponse.json();
              onSave(data.summary, savedArticle.id);
              setHasSaved(true);
            } else {
              console.error("Failed to save article to database");
              onSave(data.summary);
              setHasSaved(true);
            }
          } catch (saveError) {
            console.error("Error saving to database:", saveError);
            onSave(data.summary);
            setHasSaved(true);
          }
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
      {/* See Content Modal */}
      {seecontent && (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center items-center z-40">
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
        <p
          onClick={onBack}
          className="text-2xl font-semibold text-black cursor-pointer hover:text-gray-700"
        >
          Quiz app
        </p>
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
                    className="p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                  >
                    <p className="text-[#71717A] text-xs mb-1">
                      {formatRelativeDate(item.createdAt)}
                    </p>
                    <p className="text-black font-medium truncate">
                      {item.title}
                    </p>
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

          <div className="w-214 h-fit border  rounded-xl flex justify-center">
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

              <div className="w-200 h-20 flex items-end justify-between mb-5">
                <button
                  onClick={() => setseecontent(true)}
                  className="w-40 h-10 border rounded-xl cursor-pointer bg-white"
                >
                  <p>See content</p>
                </button>
                <button
                  onClick={onTakeQuiz}
                  disabled={loading}
                  className={`w-40 h-10 border rounded-xl ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black cursor-pointer hover:bg-gray-800"
                  }`}
                >
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
