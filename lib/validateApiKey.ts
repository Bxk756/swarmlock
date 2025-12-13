import crypto from "crypto";
import { supabaseServer } from "@/lib/supabase/server";

export async function validateApiKey(
  rawKey: string,
  requiredScope?: string
) {
  if (!rawKey) return null;

  const hash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  const { data: key, error } = await supabaseServer
    .from("api_keys")
    .select("id, project_id, scopes")
    .eq("hashed_key", hash)
    .eq("active", true)
    .single();

  if (error || !key) return null;

  if (requiredScope) {
    const scopes: string[] = key.scopes ?? [];
    if (!scopes.includes(requiredScope)) return null;
  }

  return {
    id: key.id,
    projectId: key.project_id,
    scopes: key.scopes ?? [],
  };
}

 








   
