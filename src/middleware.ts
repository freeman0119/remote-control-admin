// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')

  if (isProtected && !user) {
    const baseUrl = req.nextUrl.origin
    const loginPath = '/login'
    const redirectedFrom = encodeURIComponent(req.nextUrl.pathname)
    const loginUrl = `${baseUrl}${loginPath}?redirectedFrom=${redirectedFrom}`

    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*'], // 根据你实际路径调整
}
