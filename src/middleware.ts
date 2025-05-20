// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 不鉴权的路径，这里只放 login 页面
  const publicPaths = ["/login", "/api/login", "/api/register"];

  // 只要路径不是 public，就鉴权
  if (!publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    const token = request.cookies.get("token")?.value;

    // 没 token，页面重定向，接口返回 401
    if (!token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ message: "未登录" }, { status: 401 });
      } else {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 有 token 验证是否有效
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ message: "token 无效" }, { status: 401 });
      } else {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // public 页面放行
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login).*)",
  ],
};
