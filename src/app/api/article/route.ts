import prisma from "@/lib/prisma";

export const GET = async (request: Request) => {
  try {
    const article = await prisma.article.findMany();
    return new Response(JSON.stringify({ article }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch articles", { status: 500 });
  }
};
