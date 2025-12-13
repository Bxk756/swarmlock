import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const blocked = body.decision === "block";

  await supabaseServer.from("security_events").insert({
    ip: body.ip,
    path: body.path,
    method: body.method,
    risk_score: body.risk_score,
    decision: body.decision,
    signals: body.signals
  });

  await supabaseServer.rpc("increment_swarm_stats", { blocked });

  return NextResponse.json({ ok: true });
}
