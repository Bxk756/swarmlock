import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function validateApiKey(rawKey: string) {
  if (!rawKey) return null;

  const hash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  const { data, error } = await supabase
    .from("api_keys")
    .select("customer_id, is_active")
    .eq("key_hash", hash)
    .single();

  if (error || !data || !data.is_active) {
    return null;
  }

  // Optional: update last used
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", hash);

  return data.customer_id;
}
