import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy handler to secure admin routes
 * Applies to /api/admin/*
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect admin API routes
  if (!pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const adminKey = request.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    console.error("ADMIN_API_KEY is not set");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (!adminKey || adminKey !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

/**
 * Apply proxy only to admin routes
 */
export const config = {
  matcher: ["/api/admin/:path*"],
};
