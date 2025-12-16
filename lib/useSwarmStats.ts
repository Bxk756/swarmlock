"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "./supabase/client";

export function useSwarmStats() {
  const [stats, setStats] = useState({ total: 0, blocked: 0 });

  useEffect(() => {
    supabaseClient
      .from("swarm_stats")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) {
          setStats({
            total: data.total_requests,
            blocked: data.threats_blocked
          });
        }
      });
  }, []);

  return stats;
}
