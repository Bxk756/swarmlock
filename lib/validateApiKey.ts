import crypto from "crypto";
import { supabase } from "./supabase";

export async function validateApiKey(rawKey: string) {
  if (!rawKey) return null;

  const hash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  // 1️⃣ Validate key exists
  const { data: key } = await supabase
    .from("api_keys")
    .select("id, customer_id")
    .eq("key_hash", hash)
    .eq("active", true)
    .single();

  if (!key) return null;

  // 2️⃣ Enforce rate limit
  const { data: allowed } = await supabase.rpc(
    "enforce_rate_limit",
    { p_key_hash: hash }
  );

  if (!allowed) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  return key.customer_id;
}




   
