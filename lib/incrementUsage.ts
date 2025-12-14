import { supabaseServer } from "@/lib/supabase/server";

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

  return data.request_count;
}

