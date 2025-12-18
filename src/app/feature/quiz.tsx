"use client";

import { IoMdClose } from "react-icons/io";
import { PiStarFourBold } from "react-icons/pi";

export const Quiz = () => {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center">
      <div className="w-180 max-h-max">
        <div className="w-full h-25 flex justify-between p-2">
          <div className=" gap-2 w-120">
            <div className="flex items-center gap-2">
              <PiStarFourBold className="text-black w-6 h-6" />
              <p className="font-semibold text-2xl text-black">Quick test</p>
            </div>
            <div className="text-[#71717A]">
              Take a quick test about your knowledge from your content{" "}
            </div>
          </div>
          <button className="w-12 h-10 flex justify-center items-center bg-white border rounded cursor-pointer">
            <IoMdClose />
          </button>
        </div>
        <div className="w-180 h-60 border bg-white rounded-xl flex flex-col items-center justify-evenly">
          <div className="w-170 h-10 flex justify-between">
            <p className="font-medium text-xl">
              What was Genghis Khan’s birth name?
            </p>
            <p>1 / 5</p>
          </div>
          <div className="w-170 flex flex-wrap justify-center gap-4">
            <button className="h-10 w-82 border rounded-xl flex items-center justify-center cursor-pointer"></button>
            <button className="h-10 w-82 border rounded-xl flex items-center justify-center cursor-pointer"></button>
            <button className="h-10 w-82 border rounded-xl flex items-center justify-center cursor-pointer"></button>
            <button className="h-10 w-82 border rounded-xl flex items-center justify-center cursor-pointer"></button>
          </div>
        </div>
      </div>
    </div>
  );
};
