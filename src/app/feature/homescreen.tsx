"use client";

import { Textarea } from "@/components/ui/textarea";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiStarFourBold } from "react-icons/pi";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { Summarize } from "./summarizescreen";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
type SummarizeProps = {
  summary: string;
  title: string;
  content: string;
};
export const HomeScreen = () => {
  const { user } = useUser();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummarizeProps | null>(null);

  const [error, setError] = useState({
    title: "",
    content: "",
    api: "",
  });

  const handleNext = async () => {
    // Validation
    if (!title.trim() || !content.trim()) {
      setError({
        title: !title ? "Article title is required" : "",
        content: !content ? "Article content is required" : "",
        api: "",
      });
      return;
    }

    if (!user) {
      setError((prev) => ({
        ...prev,
        api: "You must be signed in to generate a summary.",
      }));
      return;
    }

    try {
      setLoading(true);
      setError({ title: "", content: "", api: "" });

      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, userId: user.id }),
      });

      const data = await res.json();
      console.log(data.result, "gfhsdgh");
      setSummary(data.result);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create article");
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        api:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          {step === 1 && (
            <div className="w-full flex justify-center pt-10">
              <div className="w-[856px] border rounded-xl p-6 flex flex-col gap-6">
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your article..."
                    className="w-full h-10 border rounded-xl px-2"
                  />
                  {error.title && (
                    <p className="text-red-500 text-xs mt-1">{error.title}</p>
                  )}
                </div>

                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <IoDocumentTextOutline className="w-4 h-4" />
                    <p className="text-sm font-semibold text-[#71717A]">
                      Article Content
                    </p>
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your article content here..."
                    className="w-full h-32 border rounded-xl px-2"
                  />
                  {error.content && (
                    <p className="text-red-500 text-xs mt-1">{error.content}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="w-40 h-10 rounded-xl bg-black text-white disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Generating..." : "Generate summary"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && <Summarize setStep={setStep} summary={summary} />}
        </div>
      </div>
    </div>
  );
};
