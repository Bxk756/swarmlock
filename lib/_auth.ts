// lib/_auth.ts
import { NextResponse } from "next/server";

export function requireAdmin(req: Request) {
  const adminKey = req.headers.get("x-admin-key");

  if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
