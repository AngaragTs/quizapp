// import prisma from "@/lib/prisma";

// export const GET = async (request: Request) => {
//   try {
//     const article = await prisma.article.findMany();
//     return new Response(JSON.stringify({ article }), { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return new Response("Failed to fetch articles", { status: 500 });
//   }
// };
// export const POST = async (request: Request) => {
//   const article = await prisma.article.create({
//     data: await request.json(),
//   });

//   return new Response(JSON.stringify({ article }), { status: 201 });
// };

import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const articles = await prisma.article.findMany();

    return new Response(JSON.stringify(articles), {
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
    const body = await request.json();

    // Basic validation (recommended)
    if (!body.title || !body.content) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return new Response(JSON.stringify(article), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to create article" }),
      { status: 500 }
    );
  }
};
