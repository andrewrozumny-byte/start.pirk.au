import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/surgeon-profiles/remind - mark reminder as sent for a surgeon
export async function POST(request: NextRequest) {
  try {
    const { surgeonId } = await request.json();

    await prisma.surgeon.update({
      where: { id: surgeonId },
      data: { reminderSentAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/surgeon-profiles/remind error:", error);
    return NextResponse.json(
      { error: "Failed to update reminder" },
      { status: 500 }
    );
  }
}
