import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/_auth";

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const apiKeyId = url.searchParams.get("apiKeyId");

  let q = supabaseServer
    .from("api_usage")
    .select("api_key_id, route_path, count")
    .order("count", { ascending: false });

  if (apiKeyId) q = q.eq("api_key_id", apiKeyId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ usage: data ?? [] });
}
