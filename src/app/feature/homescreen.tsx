"use client";

import { Textarea } from "@/components/ui/textarea";
import { GoSidebarCollapse } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";

export const HomeScreen = () => {
  const [sidebar, setSidebar] = useState(false);
  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full h-15 flex border-b-2 items-center justify-between p-5">
        <p className="text-2xl font-semibold text-black ">Quiz app</p>
        <CgProfile className="w-8 h-8 text-black" />
      </div>

      <div className="w-full h-full flex">
        {(sidebar && (
          <div
            className="h-full w-80 border-r-2 border-[#e4e4e7] flex justify-between pt-5 p-5"
            onClick={() => setSidebar(false)}
          >
            <p className="text-xl font-semibold">History</p>
            <GoSidebarCollapse className="text-black w-8 h-8" />
          </div>
        )) || (
          <div className="h-full w-[4%] border-r-2 border-[#e4e4e7]  flex justify-center pt-5">
            <GoSidebarCollapse
              onClick={() => setSidebar(true)}
              className="text-black w-8 h-8"
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
                />
              </div>
              <div className="w-200 h-25 ">
                <div className="h-5 w-30 flex gap-2">
                  <IoDocumentTextOutline className="text-black w-4 h-4" />
                  <p className="text-[#71717A] font-semibold text-sm">
                    Article Title
                  </p>
                </div>
                <Textarea
                  placeholder="Paste your article content here..."
                  className="w-full h-10 border border-[#E4E4E7] rounded-xl text-black px-1"
                />
              </div>
              <div className="w-200 h-20 flex items-end justify-end">
                <button className="w-40 h-10 border rounded-xl cursor-pointer bg-black">
                  <p className="text-white">Generate summary</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
