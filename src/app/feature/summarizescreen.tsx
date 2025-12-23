// "use client";

// import { useState } from "react";
// import { PiStarFourBold, PiBookOpenLight } from "react-icons/pi";
// import { HiChevronLeft } from "react-icons/hi2";
// import { IoMdClose } from "react-icons/io";

// type SummarizeProps = {
//   setStep: React.Dispatch<React.SetStateAction<number>>;
//   summary: string;
//   title: string;
//   content: string;
// };

// export const Summarize = ({
//   setStep,
//   summary,
//   title,
//   content,
// }: SummarizeProps) => {
//   const [seecontent, setseecontent] = useState(false);

//   return (
//     <div className="w-full h-screen bg-white">
//       {seecontent && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
//           <div className="bg-white w-[700px] rounded-2xl p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-lg">{title}</h2>
//               <button
//                 onClick={() => setseecontent(false)}
//                 className="w-10 h-10 border rounded-xl flex items-center justify-center"
//               >
//                 <IoMdClose />
//               </button>
//             </div>
//             <p className="text-sm text-gray-700 whitespace-pre-wrap">
//               {content}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="w-full h-full flex flex-col items-center pt-10">
//         <div className="w-[850px] mb-6">
//           <button
//             onClick={() => setStep(1)}
//             className="w-12 h-12 border rounded-xl flex items-center justify-center"
//           >
//             <HiChevronLeft />
//           </button>
//         </div>

//         <div className="w-[850px] border rounded-xl p-8">
//           <div className="flex items-center gap-2 mb-4">
//             <PiStarFourBold className="w-6 h-6" />
//             <p className="font-semibold text-2xl">Article Quiz Generator</p>
//           </div>

//           <div className="flex items-center gap-2 mb-2 text-gray-600">
//             <PiBookOpenLight />
//             <p className="font-semibold">Summarized content</p>
//           </div>

//           <div className="border rounded-xl p-4 text-gray-800 mb-6 whitespace-pre-wrap">
//             {summary}
//           </div>

//           <div className="flex justify-between">
//             <button
//               onClick={() => setseecontent(true)}
//               className="w-40 h-10 border rounded-xl"
//             >
//               See content
//             </button>

//             <button className="w-40 h-10 bg-black text-white rounded-xl">
//               Take a quiz
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { PiBookOpenLight, PiStarFourBold } from "react-icons/pi";

type SummarizedProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  summary: SummarizeProps | null;
};
type SummarizeProps = {
  summary?: string;
  title?: string;
  content?: string;
};
export const Summarize = ({ setStep, summary }: SummarizedProps) => {
  const [showContent, setShowContent] = useState(false);

  console.log(summary, "summary");

  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full max-h-max flex">
        <div className="w-full max-h-max flex flex-col px-72 items-center pt-10 ">
          <div className="w-214 mb-10">
            <button
              className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center cursor-pointer"
              onClick={() => setStep(1)}
            >
              <HiChevronLeft />
            </button>
          </div>

          <div className="w-214 max-h-max border  rounded-xl flex justify-center">
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
              {summary && (
                <p className="w-200  font-semibold text-2xl">{summary.title}</p>
              )}
              {summary && (
                <p className="w-200  font-semibold text-2xl">
                  {summary.summary}
                </p>
              )}

              <div className="w-200 h-20 flex items-end justify-between mb-5">
                <button
                  onClick={() => setShowContent(true)}
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
        {showContent && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white w-[600px] max-h-[80vh] p-6 rounded-2xl relative overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  {summary && (
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {summary.content}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowContent(false)}
                  className="w-10 h-10 border flex items-center justify-center rounded-xl cursor-pointer"
                >
                  <IoMdClose />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
