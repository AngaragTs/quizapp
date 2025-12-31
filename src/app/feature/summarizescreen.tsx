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
import { PiStarFourBold } from "react-icons/pi";
import { PiBookOpenLight } from "react-icons/pi";
import { HiChevronLeft, HiXMark } from "react-icons/hi2";
import { FaCheck, FaTimes } from "react-icons/fa";

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
}

interface SummarizeProps {
  onBack: () => void;
  title: string;
  content: string;
  onSave: (summary: string, articleId?: string) => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  preloadedSummary: string | null;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export const Summarize = ({
  onBack,
  title,
  content,
  onSave,
  history,
  onLoadHistory,
  preloadedSummary,
}: SummarizeProps) => {
  const [sidebar, setSidebar] = useState(false);
  const [seecontent, setseecontent] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  // Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  useEffect(() => {
    setHasSaved(false);
    setSummary("");
    setLoading(true);

    if (preloadedSummary) {
      setSummary(preloadedSummary);
      setLoading(false);
      setHasSaved(true);
      return;
    }

    const summarizeContent = async () => {
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });
        const data = await response.json();

        if (data.summary) {
          setSummary(data.summary);

          try {
            const saveResponse = await fetch("/api/articles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title,
                content,
                summary: data.summary,
              }),
            });

            if (saveResponse.ok) {
              const savedArticle = await saveResponse.json();
              onSave(data.summary, savedArticle.id);
              setHasSaved(true);
            } else {
              console.error("Failed to save article to database");
              onSave(data.summary);
              setHasSaved(true);
            }
          } catch (saveError) {
            console.error("Error saving to database:", saveError);
            onSave(data.summary);
            setHasSaved(true);
          }
        } else if (data.error) {
          setSummary(`Error: ${data.error}`);
        } else {
          setSummary("No summary generated.");
        }
      } catch (error) {
        console.error("Error summarizing:", error);
        setSummary("Failed to summarize content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (content && !preloadedSummary) {
      summarizeContent();
    }
  }, [content, preloadedSummary]);

  const handleTakeQuiz = async () => {
    setQuizLoading(true);
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);

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
        console.error("Quiz error:", data.error);
        setShowQuiz(false);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setShowQuiz(false);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectAnswer = (option: string) => {
    if (answeredQuestions[currentQuestion]) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const isCurrentAnswered = answeredQuestions[currentQuestion];
  const currentQ = questions[currentQuestion];

  return (
    <div className="w-full h-screen bg-white">
      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-[600px] max-h-[90vh] flex flex-col rounded-2xl relative p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <p className="text-black font-bold text-lg">Quiz: {title}</p>
              <button
                onClick={handleCloseQuiz}
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl border border-gray-300"
              >
                <HiXMark className="w-5 h-5 text-black" />
              </button>
            </div>

            {quizLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Generating quiz questions...</p>
              </div>
            ) : showResult ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <p className="text-4xl font-bold text-green-600">
                    {score}/{questions.length}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-black mb-2">
                  Quiz Complete!
                </p>
                <p className="text-gray-600 mb-6">
                  You got {score} out of {questions.length} questions correct
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleTakeQuiz}
                    className="px-6 py-3 bg-black text-white rounded-xl cursor-pointer hover:bg-gray-800"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={handleCloseQuiz}
                    className="px-6 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              <div>
                {/* Progress */}
                <div className="flex items-center gap-2 mb-6">
                  <p className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / questions.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <p className="text-lg font-semibold text-black mb-6">
                  {currentQ.question}
                </p>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentQ.answer;
                    const showCorrectness = isCurrentAnswered;

                    let bgColor = "bg-white hover:bg-gray-50";
                    let borderColor = "border-gray-300";
                    let icon = null;

                    if (showCorrectness) {
                      if (isCorrect) {
                        bgColor = "bg-green-50";
                        borderColor = "border-green-500";
                        icon = <FaCheck className="text-green-500" />;
                      } else if (isSelected && !isCorrect) {
                        bgColor = "bg-red-50";
                        borderColor = "border-red-500";
                        icon = <FaTimes className="text-red-500" />;
                      }
                    } else if (isSelected) {
                      bgColor = "bg-gray-100";
                      borderColor = "border-black";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={isCurrentAnswered}
                        className={`w-full p-4 text-left border ${borderColor} rounded-xl ${bgColor} transition-all flex items-center justify-between ${
                          !isCurrentAnswered
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        <span className="text-black">{option}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  {!isCurrentAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className={`px-6 py-3 rounded-xl ${
                        selectedAnswer
                          ? "bg-black text-white cursor-pointer hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-black text-white rounded-xl cursor-pointer hover:bg-gray-800"
                    >
                      {currentQuestion < questions.length - 1
                        ? "Next Question"
                        : "See Results"}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* See Content Modal */}
      {seecontent && (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center items-center z-40">
          <div className="bg-white w-115 h-auto flex flex-col rounded-2xl relative p-6">
            <div className="flex justify-between items-center">
              <p className="text-black font-bold text-lg">{title}</p>
              <button
                onClick={() => setseecontent(false)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-xl border border-gray-300"
              >
                <HiXMark className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-black">{content}</p>
            </div>
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
                    className="p-3  rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                  >
                    <p className="text-black font-medium truncate">
                      {item.title}
                    </p>
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

        <div className="w-full h-full flex flex-col px-72 items-center pt-10 ">
          <div className="w-214 mb-10">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center cursor-pointer"
            >
              <HiChevronLeft />
            </button>
          </div>

          <div className="w-214 h-fit border  rounded-xl flex justify-center">
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

              <div className="w-200 min-h-50 py-4">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#737373]">Summarizing with AI...</p>
                  </div>
                ) : (
                  <p className="text-black whitespace-pre-wrap">{summary}</p>
                )}
              </div>

              <div className="w-200 h-20 flex items-end justify-between mb-5">
                <button
                  onClick={() => setseecontent(true)}
                  className="w-40 h-10 border rounded-xl cursor-pointer bg-white"
                >
                  <p>See content</p>
                </button>
                <button
                  onClick={handleTakeQuiz}
                  disabled={loading}
                  className={`w-40 h-10 border rounded-xl ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black cursor-pointer hover:bg-gray-800"
                  }`}
                >
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
