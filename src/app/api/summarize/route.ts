import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (request: Request) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not set in environment variables",
        }),
        {
          status: 500,
        }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { content } = await request.json();

    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Please summarize the following article in a clear and concise way. Keep the summary to 2-3 paragraphs:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error: unknown) {
    console.error("Error summarizing content:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
};
