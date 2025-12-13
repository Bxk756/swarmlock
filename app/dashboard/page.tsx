"use client";

import { useSwarmStats } from "@/lib/useSwarmStats";

export default function Dashboard() {
  const { total, blocked } = useSwarmStats();

  return (
    <main style={{ padding: 40 }}>
      <h1>🛡️ Swarm Lock Dashboard</h1>
      <p>Total Requests: {total}</p>
      <p>Threats Blocked: {blocked}</p>
      <strong>LIVE STREAM</strong>
    </main>
  );
}
