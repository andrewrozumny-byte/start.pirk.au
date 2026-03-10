import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      client: true,
      matchSurgeons: {
        include: { surgeon: true },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  return NextResponse.json(match);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    // Update match status
    if (body.status) {
      await prisma.match.update({
        where: { id },
        data: { status: body.status },
      });
    }

    // Update individual match surgeons
    if (body.matchSurgeons && Array.isArray(body.matchSurgeons)) {
      for (const ms of body.matchSurgeons) {
        await prisma.matchSurgeon.update({
          where: { id: ms.id },
          data: {
            rank: ms.rank,
            matchReason: ms.matchReason,
            adminNotes: ms.adminNotes,
            isManualOverride: true,
          },
        });
      }
    }

    const updated = await prisma.match.findUnique({
      where: { id },
      include: {
        client: true,
        matchSurgeons: {
          include: { surgeon: true },
          orderBy: { rank: "asc" },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update match error:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}
