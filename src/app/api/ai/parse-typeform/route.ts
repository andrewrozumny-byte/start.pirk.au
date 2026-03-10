import { NextResponse } from "next/server";
import { parseTypeformWithAI } from "@/lib/typeform-parser";

export async function POST(request: Request) {
  try {
    const { rawText } = await request.json();

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "rawText is required" },
        { status: 400 }
      );
    }

    const parsed = await parseTypeformWithAI(rawText);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Parse typeform error:", error);
    return NextResponse.json(
      { error: "Failed to parse typeform data" },
      { status: 500 }
    );
  }
}
