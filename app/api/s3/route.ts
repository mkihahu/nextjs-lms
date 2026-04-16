// app/api/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { get } from "@tigrisdata/storage";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<File | string>> {
  const avatar = req.nextUrl.searchParams.get("avatar");

  if (!avatar) {
    return NextResponse.json("avatar parameter is required", { status: 400 });
  }

  try {
    const avatarPath = decodeURIComponent(avatar as string);

    const file = await get(avatarPath, "file", {
      contentDisposition: "inline",
    });

    if (file.data) {
      return new NextResponse(file.data, { status: 200 });
    }

    if (file.error && file.error.message) {
      return NextResponse.json(file.error.message, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Unknown error",
      { status: 500 },
    );
  }

  return NextResponse.json("No data found", { status: 404 });
}
