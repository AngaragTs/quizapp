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
import { HiXMark } from "react-icons/hi2";
import { FaCheck, FaTimes } from "react-icons/fa";
import { PiStarFourBold } from "react-icons/pi";

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

interface QuizScreenProps {
  onBack: () => void;
  onHome: () => void;
  title: string;
  content: string;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export const QuizScreen = ({
  onBack,
  onHome,
  title,
  content,
  history,
  onLoadHistory,
}: QuizScreenProps) => {
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });
        const data = await response.json();

        if (data.questions) {
          setQuestions(data.questions);
          setAnsweredQuestions(new Array(data.questions.length).fill(false));
        } else if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        console.error("Error generating quiz:", err);
        setError("Failed to generate quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [title, content]);

  const handleSelectAnswer = (option: string) => {
    if (answeredQuestions[currentQuestion]) return;

    // Store user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = option;
    setUserAnswers(newUserAnswers);

    // Check answer and update score
    const isCorrect = option === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Mark as answered
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);

    // Immediately advance to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setUserAnswers([]);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="w-full h-15 flex border-b-2 items-center justify-between p-5">
        <p
          onClick={onHome}
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
        {/* Sidebar */}
        {sidebar ? (
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
        ) : (
          <div className="h-full w-[4%] border-r-2 border-[#e4e4e7] flex justify-center pt-5">
            <GoSidebarCollapse
              onClick={() => setSidebar(true)}
              className="text-black w-8 h-8 cursor-pointer"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="w-full h-full flex flex-col px-72 items-center pt-10">
          {/* Quiz Container */}
          <div className="w-214 min-h-fit ">
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 items-center">
                <PiStarFourBold className="text-black w-6 h-6" />
                <p className="font-semibold text-2xl text-black">Quick test</p>
              </div>
              <button
                onClick={onBack}
                className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50"
              >
                <HiXMark className="text-black w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 ">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Generating quiz questions...
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This may take a few seconds
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-black text-white rounded-xl cursor-pointer hover:bg-gray-800"
                >
                  Go Back
                </button>
              </div>
            ) : showResult ? (
              <div className="flex flex-col py-10">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <p className="text-4xl font-bold text-green-600">
                      {score}/{questions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-black">
                      Quiz Complete!
                    </p>
                    <p className="text-gray-600">
                      You got {score} out of {questions.length} questions
                      correct
                    </p>
                  </div>
                </div>

                {/* Results breakdown */}
                <div className="space-y-4 mb-8">
                  {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.answer;
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 ${
                          isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {isCorrect ? (
                              <FaCheck className="text-green-500 text-lg" />
                            ) : (
                              <FaTimes className="text-red-500 text-lg" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-black mb-2">
                              {q.question}
                            </p>
                            <p className="text-sm text-gray-600">
                              Your answer:{" "}
                              <span
                                className={
                                  isCorrect
                                    ? "text-green-600 font-medium"
                                    : "text-red-600 font-medium"
                                }
                              >
                                {userAnswer}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-gray-600">
                                Correct answer:{" "}
                                <span className="text-green-600 font-medium">
                                  {q.answer}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetake}
                    className="px-8 py-4 bg-black text-white rounded-xl cursor-pointer hover:bg-gray-800 text-lg"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={onBack}
                    className="px-8 py-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 text-lg"
                  >
                    Back to Summary
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              <div>
                <p className="text-[#71717A] text-sm mb-8">
                  Take a quick test about your knowledge from your content
                </p>
                {/* Question */}
                <p className="text-xl font-semibold text-black mb-8">
                  {currentQ.question}
                </p>

                {/* Options */}
                <div className="space-y-4 mb-8">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(option)}
                      className="w-full p-5 text-left border-2 border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <span className="text-black text-lg">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
