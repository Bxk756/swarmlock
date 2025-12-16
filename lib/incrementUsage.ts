import { getSupabaseServer } from "@/lib/supabase/server";

export type IncrementUsageResult = {
  request_count: number;
};

/**
 * Increment API usage for a given API key
 */
export async function incrementUsage(
  apiKeyId: string
): Promise<IncrementUsageResult | null> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("api_usage")
    .update({
      request_count: supabase.rpc("increment", { x: 1 }),
    })
    .eq("api_key_id", apiKeyId)
    .select("request_count")
    .single();

  if (error) {
    console.error("incrementUsage error:", error);
    return null;
  }

  return data;
}
