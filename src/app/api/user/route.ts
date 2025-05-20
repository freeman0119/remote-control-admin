import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {

  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  const user = token ? verifyToken(token) : null;
  return NextResponse.json({ user });
}