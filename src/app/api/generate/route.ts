import { NextResponse } from "next/server";

export const POST = async () => {
  return NextResponse.json(
    { error: "This endpoint is not implemented" },
    { status: 501 }
  );
};
