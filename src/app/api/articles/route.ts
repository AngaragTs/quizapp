import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

export const GET = async () => {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userWithArticles = await prisma.user.findUnique({
      where: { id: user.id },
      include: { articles: { orderBy: { createdAt: "desc" } } },
    });

    return new Response(JSON.stringify(userWithArticles?.articles || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch articles" }),
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();

    if (!body.title || !body.content || !body.summary) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields (title, content, summary)",
        }),
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        summary: body.summary,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify(article), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create article" }),
      { status: 500 }
    );
  }
};
