"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { PiBookOpenLight } from "react-icons/pi";
import { HiChevronLeft } from "react-icons/hi2";

export const Summarize = () => {
  const [sidebar, setSidebar] = useState(false);
  const [seecontent, setseecontent] = useState(false);
  return (
    <div className="w-full h-screen bg-white">
      {seecontent && (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center items-center ">
          <div className="bg-white w-115 h-68 flex justify-around flex-col items-center rounded-2xl">
            sdgdgsdgdgsgsgsfdgfsdg
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
          <div
            className="h-full w-80 border-r-2 border-[#e4e4e7] flex justify-between pt-5 p-5"
            onClick={() => setSidebar(false)}
          >
            <p className="text-xl font-semibold">History</p>
            <GoSidebarExpand className="text-black w-8 h-8 cursor-pointer" />
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
            {" "}
            <button className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center cursor-pointer">
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

              <div className="w-200 h-50 "></div>

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
