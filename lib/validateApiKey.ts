import crypto from "crypto";
import { getSupabaseServer } from "@/lib/supabase/server";

export type ApiKeyRecord = {
  id: string;
  key_hash: string;
  revoked: boolean;
};

/**
 * Validate an incoming API key
 */
export async function validateApiKey(
  rawKey: string
): Promise<ApiKeyRecord | null> {
  if (!rawKey) return null;

  const supabase = getSupabaseServer();

  const hashedKey = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, key_hash, revoked")
    .eq("key_hash", hashedKey)
    .single<ApiKeyRecord>();

  if (error) {
    console.error("validateApiKey error:", error);
    return null;
  }

  if (!data || data.revoked) {
    return null;
  }

  return data;
}







   
