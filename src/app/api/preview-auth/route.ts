import { NextResponse } from "next/server";

const PREVIEW_PIN = "pirk2025";

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (pin === PREVIEW_PIN) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("preview-pin", PREVIEW_PIN, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
}
