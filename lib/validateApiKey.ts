import crypto from "crypto";
import { supabaseServer } from "./supabase";

export async function validateApiKey(rawKey: string) {
  if (!rawKey) return null;

  const hash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  const { data: key } = await supabaseServer
    .from("api_keys")
    .select("id, project_id")
    .eq("hashed_key", hash)
    .eq("active", true)
    .single();

  if (!key) return null;

  return {
    apiKeyId: key.id,
    projectId: key.project_id,
  };
}







   
