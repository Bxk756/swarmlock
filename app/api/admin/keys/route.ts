import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { requireAdmin } from "../_auth";
import { generateApiKey } from "@/lib/generateApiKey";

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  let q = supabaseServer
    .from("api_keys")
    .select("id, project_id, active, scopes, created_at")
    .order("created_at", { ascending: false });

  if (projectId) q = q.eq("project_id", projectId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ keys: data ?? [] });
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const projectId = body.projectId;
  const scopes = Array.isArray(body.scopes) ? body.scopes : ["events:write"];

  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  // generateApiKey should return: { rawKey, hashedKey }
  const { rawKey, hash } = await generateApiKey();

  const { data, error } = await supabaseServer
    .from("api_keys")
    .insert({
      project_id: projectId,
      hashed_key: hashedKey,
      active: true,
      scopes,
    })
    .select("id, project_id, active, scopes, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // IMPORTANT: rawKey is only returned once
  return NextResponse.json({ key: data, rawKey });
}
