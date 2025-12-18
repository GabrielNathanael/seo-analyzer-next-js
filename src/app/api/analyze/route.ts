import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "ok",
    message: "analyze endpoint alive",
    timestamp: new Date().toISOString(),
  });
}
