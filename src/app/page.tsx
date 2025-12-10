import Image from "next/image";
import { CgProfile } from "react-icons/cg";

export default function Home() {
  return (
    <div className="w-full h-300 bg-white">
      <div className="w-full h-15 flex border-b-2 items-center justify-between p-5">
        <p className="text-2xl font-semibold text-black ">Quiz app</p>
        <CgProfile className="w-8 h-8 text-black" />
      </div>
      <div className="w-full h-full flex"></div>
    </div>
  );
}
