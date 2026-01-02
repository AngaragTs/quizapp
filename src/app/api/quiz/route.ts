import { GoogleGenerativeAI } from "@google/generative-ai";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export const POST = async (request: Request) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not set in environment variables",
        }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { title, content } = await request.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Based on the following article titled "${title}", generate exactly 5 multiple choice quiz questions to test understanding of the content.

Article Content:
${content}

IMPORTANT: Return ONLY a valid JSON array with no markdown formatting, no code blocks, no backticks. Just the raw JSON array.

Each question object must have:
- "question": the question text
- "options": array of exactly 4 answer choices (A, B, C, D format like "A. Answer text")
- "answer": the correct answer (must match exactly one of the options)

Example format:
[{"question":"What is...?","options":["A. First option","B. Second option","C. Third option","D. Fourth option"],"answer":"A. First option"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    // Parse the JSON
    const questions: QuizQuestion[] = JSON.parse(cleanedText);

    return new Response(JSON.stringify({ questions }), { status: 200 });
  } catch (error: unknown) {
    console.error("Error generating quiz:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
};
