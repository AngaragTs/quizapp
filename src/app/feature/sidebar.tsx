"use client";

import { useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

export const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="h-full">
      {sidebar ? (
        <div className="h-full w-80 border-r-2 border-[#e4e4e7]">
          <div className="flex justify-between pt-5 p-5">
            <p className="text-xl font-semibold">History</p>
            <GoSidebarExpand
              className="text-black w-8 h-8 cursor-pointer"
              onClick={() => setSidebar(false)}
            />
          </div>
          <div className="w-full h-full bg-amber-500"> </div>
        </div>
      ) : (
        <div className="h-full w-16 border-r-2 border-[#e4e4e7] flex justify-center pt-5">
          <GoSidebarCollapse
            className="text-black w-8 h-8 cursor-pointer"
            onClick={() => setSidebar(true)}
          />
        </div>
      )}
    </div>
  );
};
