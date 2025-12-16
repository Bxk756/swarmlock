import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/_auth";
import { generateApiKey } from "@/lib/generateApiKey";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  const body = await req.json();

  const key = generateApiKey();

  const { error } = await supabase.from("api_keys").insert({
    name: body.name ?? "Admin key",
    key,
    active: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ key });
}



  
