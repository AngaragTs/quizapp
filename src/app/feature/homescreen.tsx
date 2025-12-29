"use client";

import { Textarea } from "@/components/ui/textarea";
import { GoSidebarCollapse } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { useState, useEffect } from "react";
import { GoSidebarExpand } from "react-icons/go";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Summarize } from "./summarizescreen";

export interface HistoryItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
}

export const HomeScreen = () => {
  const [sidebar, setSidebar] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showSignInMessage, setShowSignInMessage] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [preloadedSummary, setPreloadedSummary] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("quizHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (summary: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title,
      content,
      summary,
      createdAt: new Date().toISOString(),
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setTitle(item.title);
    setContent(item.content);
    setPreloadedSummary(item.summary);
    setStep(2);
  };

  const Handlenext = () => {
    if (!isSignedIn) {
      setShowSignInMessage(true);
      return;
    }
    if (title.trim() === "" || content.trim() === "") {
      return;
    }
    setPreloadedSummary(null); // Clear preloaded summary for new generation
    setStep(step + 1);
  };

  return (
    <>
      {step === 1 && (<div className="w-full h-screen bg-white">
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
                      onClick={() => loadFromHistory(item)}
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

          <div className="w-full h-full flex  px-72 justify-center  pt-10">
            <div className="w-214 h-110 border  rounded-xl flex justify-center">
              <div className="flex-col">
                <div className="w-200 h-15 flex gap-2 items-center">
                  <PiStarFourBold className="text-black w-6 h-6" />

                  <p className="font-semibold text-2xl text-black">
                    Article Quiz Generator
                  </p>
                </div>
                <div className="w-200 h-15">
                  <p className="text-[#71717A] font-normal">
                    Paste your article below to generate a summarize and quiz
                    question. Your articles will saved in the sidebar for future
                    reference.
                  </p>
                </div>
                <div className="w-200 h-20 ">
                  <div className="h-5 w-30 flex gap-2">
                    <IoDocumentTextOutline className="text-black w-4 h-4" />
                    <p className="text-[#71717A] font-semibold text-sm">
                      Article Title
                    </p>
                  </div>
                  <input
                    placeholder="Enter a title for your article..."
                    className="w-full h-10 border border-[#E4E4E7] rounded-xl text-black px-1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="w-200 h-25 ">
                  <div className="h-5 w-35 flex gap-2">
                    <IoDocumentTextOutline className="text-black w-4 h-4" />
                    <p className="text-[#71717A] font-semibold text-sm">
                      Article Content
                    </p>
                  </div>
                  <Textarea
                    placeholder="Paste your article content here..."
                    className="w-full h-10 border border-[#E4E4E7] rounded-xl text-black px-1"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="w-200 h-20 flex flex-col items-end justify-end gap-2">
                  {showSignInMessage && !isSignedIn && (
                    <p className="text-red-500 text-sm">Please sign in or sign up first</p>
                  )}
                  <button 
                    onClick={Handlenext}
                    disabled={title.trim() === "" || content.trim() === ""}
                    className={`w-40 h-10 border rounded-xl ${
                      title.trim() === "" || content.trim() === ""
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black cursor-pointer"
                    }`}
                  >
                    <p className="text-white">Generate summary</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>)}
      {step === 2 && <Summarize onBack={() => setStep(1)} title={title} content={content} onSave={saveToHistory} history={history} onLoadHistory={loadFromHistory} preloadedSummary={preloadedSummary} />}
    </>
  );
};
