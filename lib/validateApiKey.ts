import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function validateApiKey(rawKey: string) {
  if (!rawKey.startsWith("sk_live_swarm_")) return null;

  const hash = crypto.createHash("sha256").update(rawKey).digest("hex");

  const { data } = await supabase
    .from("api_keys")
    .select("customer_id")
    .eq("key_hash", hash)
    .eq("active", true)
    .single();

  return data?.customer_id || null;
}



   
