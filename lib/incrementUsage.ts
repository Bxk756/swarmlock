import { supabaseServer } from "@/lib/supabase";

export async function incrementUsage(
  apiKeyId: string,
  route: string
) {
  const windowStart = new Date();
  windowStart.setUTCMinutes(0, 0, 0); // hourly window

  const { data, error } = await supabaseServer
    .from("api_usage")
    .upsert(
      {
        api_key_id: apiKeyId,
        route,
        window_start: windowStart.toISOString(),
        request_count: 1,
      },
      {
        onConflict: "api_key_id,route,window_start",
        ignoreDuplicates: false,
      }
    )
    .select("request_count")
    .single();

  if (error) throw error;

  return data.request_count;
}
