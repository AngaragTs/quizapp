import prisma from "@/lib/prisma";
import { request } from "http";

export const POST = async (request: Request) => {
  const article = await prisma.article.create({
    data: await request.json(),
  });

  return new Response(JSON.stringify({ article }), { status: 201 });
};

export const GET = async (request: Request) => {
  try {
    const article = await prisma.article.findMany();
    return new Response(JSON.stringify({ article }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch articles", { status: 500 });
  }
};
