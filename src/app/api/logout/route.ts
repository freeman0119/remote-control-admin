// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "已登出" });
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // 立即过期
  });
  return res;
}
