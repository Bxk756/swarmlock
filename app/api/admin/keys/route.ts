import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Admin API key management
 * POST = create new API key
 * GET  = list existing keys
 */

export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // 1. Generate raw API key
    const rawKey = `swarm_${crypto.randomBytes(32).toString("hex")}`;

    // 2. Hash the key (SHA-256)
    const hashedKey = crypto
      .createHash("sha256")
      .update(rawKey)
      .digest("hex");

    // 3. Insert into database (MATCH DB COLUMN NAME)
    const { error } = await supabase
      .from("api_keys")
      .insert({
        hashed_key: hashedKey,
        revoked: false,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 4. Return raw key ONCE
    return NextResponse.json({
      apiKey: rawKey,
      warning: "Store this key securely. It will not be shown again.",
    });
  } catch (err) {
    console.error("Create API key error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, revoked, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("List API keys error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
