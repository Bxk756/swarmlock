import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/validateApiKey";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // 1️⃣ Read Authorization header
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing API key" },
      { status: 401 }
    );
  }

  // 2️⃣ Extract raw key
  const apiKey = auth.replace("Bearer ", "").trim();

  // 3️⃣ Validate key
  const customerId = await validateApiKey(apiKey);

  if (!customerId) {
    return NextResponse.json(
      { error: "Invalid API key" },
      { status: 401 }
    );
  }

  // 4️⃣ Parse payload
  const payload = await req.json();
  const blocked = payload.blocked === true;

  // 5️⃣ Secure server-side RPC
  await supabase.rpc("increment_swarm_stats", { blocked });

  return NextResponse.json({
    ok: true,
    customer: customerId,
  });
}


  
