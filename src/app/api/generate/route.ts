import prisma from "@/lib/prisma";

export const POST = async (request: Request) => {
  const generate = await prisma.generate.create({
    data: await request.json(),
  });
  return new Response(JSON.stringify({ generate }), { status: 201 });
};
