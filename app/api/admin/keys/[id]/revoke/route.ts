import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("api_keys")
    .update({ revoked: true })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
  
