import { NextResponse } from "next/server";

export function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token");

  if (!token || token !== process.env.SWARMLOCK_ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
