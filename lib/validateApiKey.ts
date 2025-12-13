import crypto from "crypto";
import { supabase } from "./supabase";

export async function validateApiKey(rawKey: string) {
  if (!rawKey) return null;

  const hash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  // 1️⃣ Validate key exists & is active
  const { data: key, error } = await supabase
    .from("api_keys")
    .select("id, project_id")
    .eq("hashed_key", hash) // or key_hash — must match DB column
    .eq("active", true)
    .single();

  if (error || !key) return null;

  // 2️⃣ Enforce rate limit (key-scoped)
  const { data: allowed } = await supabase.rpc(
    "enforce_rate_limit",
    { p_key_hash: hash }
  );

  if (!allowed) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  // ✅ Return authorization context
  return {
    apiKeyId: key.id,
    projectId: key.project_id,
  };
}






   
