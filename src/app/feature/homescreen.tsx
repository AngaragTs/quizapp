"use client";

import { Textarea } from "@/components/ui/textarea";
import { GoSidebarCollapse } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { GoSidebarExpand } from "react-icons/go";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Summarize } from "./summarizescreen";
import { Header } from "./header";
import { Sidebar } from "./sidebar";


export const HomeScreen = () => {
 
  const [step, setStep] = useState(1);
  const [title, settitle] =  useState("")
  const [content, setcontent] =  useState("")
  const [error, setError] = useState("")

  const Handlenext = () => {
    // if (!title.trim()) {
    //   alert("Title is required");
    //   return;
    // }
  
    // if (!content.trim()) {
    //   alert("Content is required");
    //   return;
    // }
  
    setStep(2);
  };
  
  
  

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          {step === 1 && (
            <div className="w-full h-full flex justify-center pt-10">
              <div className="w-[856px] h-[440px] border rounded-xl flex justify-center">
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex gap-2 items-center">
                    <PiStarFourBold className="w-6 h-6" />
                    <p className="font-semibold text-2xl">
                      Article Quiz Generator
                    </p>
                  </div>

                  <p className="text-[#71717A]">
                    Paste your article below to generate a summary and quiz
                    questions. Your articles will be saved in the sidebar.
                  </p>

                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <IoDocumentTextOutline className="w-4 h-4" />
                      <p className="text-sm font-semibold text-[#71717A]">
                        Article Title
                      </p>
                    </div>
                    <input
                    onChange={(e) => settitle(e.target.value)}
                      placeholder="Enter a title for your article..."
                      className="w-full h-10 border rounded-xl px-2"
                    />
                  </div>

                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <IoDocumentTextOutline className="w-4 h-4" />
                      <p className="text-sm font-semibold text-[#71717A]">
                        Article Content
                      </p>
                    </div>
                    <Textarea
                    onChange={(e)=> setcontent(e.target.value)}
                      placeholder="Paste your article content here..."
                      className="w-full h-32 border rounded-xl px-2"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={Handlenext}
                      className="w-40 h-10 rounded-xl bg-black text-white cursor-pointer"
                    >
                      Generate summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && <Summarize  />}
        </div>
      </div>
    </div>
  );
};
