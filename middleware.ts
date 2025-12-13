import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*", "/"]
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Block scanners immediately
  if (
    path.includes(".env") ||
    path.includes("wp-admin") ||
    path.includes("phpmyadmin")
  ) {
    return new NextResponse(
      JSON.stringify({ error: "Blocked by Swarm Lock" }),
      { status: 403 }
    );
  }

  // Redirect app subdomain
  if (
    req.nextUrl.hostname === "app.swarmlock.cloud" &&
    path === "/"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  return NextResponse.next();
}
