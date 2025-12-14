import { supabaseServer } from "@/lib/supabase/server";

type IncrementUsageResult = {
  request_count: number;
};

export async function incrementUsage(
  apiKeyId: string,
  route: string
) {
  const windowStart = new Date();
  windowStart.setUTCMinutes(0, 0, 0); // hourly window

  const { data, error } = await supabaseServer
    .rpc("increment_api_usage", {
      p_api_key_id: apiKeyId,
      p_route: route,
      p_window_start: windowStart.toISOString(),
    })
    .single();

  if (error) throw error;
  if (!data) throw new Error("No data returned from increment_api_usage");

  return (data as IncrementUsageResult).request_count;
}

