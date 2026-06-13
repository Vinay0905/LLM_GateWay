"use client";

import { useEffect, useState } from "react";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { StatPill } from "@/components/ui/StatPill";
import { fetchGatewayHealth, fetchGatewayMetrics } from "@/lib/gateway-client";

export function GatewayStatusPanel() {
  const [health, setHealth] = useState("-");
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const [h, m] = await Promise.all([fetchGatewayHealth(), fetchGatewayMetrics()]);
    setHealth(h);
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <NeonCard title="Gateway Status" subtitle="Live quick check from /health and /metrics">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Health" value={health} />
        <StatPill label="Requests" value={metrics?.requests_total ?? "-"} />
        <StatPill label="Blocks" value={metrics?.blocks_total ?? "-"} />
        <StatPill label="Upstream Errors" value={metrics?.upstream_errors ?? "-"} />
      </div>
      <div className="mt-4">
        <NeonButton variant="outline" onClick={() => void refresh()} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Status"}
        </NeonButton>
      </div>
    </NeonCard>
  );
}
