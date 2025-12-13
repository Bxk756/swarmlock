"use client";

import { useEffect, useMemo, useState } from "react";

type KeyRow = {
  id: string;
  project_id: string;
  active: boolean;
  scopes: string[] | null;
  created_at: string;
};

type UsageRow = {
  api_key_id: string;
  route_path: string;
  count: number;
};

export default function DashboardPage() {
  const [adminToken, setAdminToken] = useState("");
  const [projectId, setProjectId] = useState("");
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [rawKeyOnce, setRawKeyOnce] = useState<string | null>(null);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({
      "x-admin-token": adminToken,
      "content-type": "application/json",
    }),
    [adminToken]
  );

  async function loadKeys() {
    setLoading(true);
    setRawKeyOnce(null);
    const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
    const res = await fetch(`/api/admin/keys${qs}`, { headers });
    const json = await res.json();
    setKeys(json.keys ?? []);
    setLoading(false);
  }

  async function createKey() {
    setLoading(true);
    setRawKeyOnce(null);
    const res = await fetch(`/api/admin/keys`, {
      method: "POST",
      headers,
      body: JSON.stringify({ projectId, scopes: ["events:write"] }),
    });
    const json = await res.json();
    if (json.rawKey) setRawKeyOnce(json.rawKey);
    await loadKeys();
    setLoading(false);
  }

  async function revokeKey(id: string) {
    setLoading(true);
    await fetch(`/api/admin/keys/${id}/revoke`, { method: "POST", headers });
    await loadKeys();
    setLoading(false);
  }

  async function loadUsage(apiKeyId: string) {
    setSelectedKeyId(apiKeyId);
    const res = await fetch(`/api/admin/usage?apiKeyId=${apiKeyId}`, { headers });
    const json = await res.json();
    setUsage(json.usage ?? []);
  }

  useEffect(() => {
    setKeys([]);
    setUsage([]);
    setSelectedKeyId(null);
    setRawKeyOnce(null);
  }, [adminToken]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>SwarmLock Admin</h1>
      <p style={{ opacity: 0.8 }}>Manage API keys + usage.</p>

      <div style={{ display: "grid", gap: 12, maxWidth: 720, marginTop: 16 }}>
        <label>
          Admin token
          <input
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="paste SWARMLOCK_ADMIN_TOKEN"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Project ID
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="project_123"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button disabled={!adminToken} onClick={loadKeys} style={{ padding: "10px 14px" }}>
            Load keys
          </button>
          <button
            disabled={!adminToken || !projectId}
            onClick={createKey}
            style={{ padding: "10px 14px" }}
          >
            Create key
          </button>
          {loading ? <span style={{ alignSelf: "center" }}>Working…</span> : null}
        </div>

        {rawKeyOnce ? (
          <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
            <div style={{ fontWeight: 700 }}>New API Key (copy now — shown once)</div>
            <code style={{ display: "block", marginTop: 8, wordBreak: "break-all" }}>{rawKeyOnce}</code>
          </div>
        ) : null}
      </div>

      <hr style={{ margin: "22px 0" }} />

      <h2 style={{ fontSize: 18, fontWeight: 700 }}>Keys</h2>
      {keys.length === 0 ? (
        <p style={{ opacity: 0.75 }}>No keys loaded.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {keys.map((k) => (
            <div key={k.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {k.project_id} {k.active ? "✅" : "⛔"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{k.id}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    scopes: {(k.scopes ?? []).join(", ") || "(none)"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => loadUsage(k.id)} style={{ padding: "8px 12px" }}>
                    Usage
                  </button>
                  <button
                    disabled={!k.active}
                    onClick={() => revokeKey(k.id)}
                    style={{ padding: "8px 12px" }}
                  >
                    Revoke
                  </button>
                </div>
              </div>

              {selectedKeyId === k.id && usage.length > 0 ? (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee" }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Usage</div>
                  {usage.map((u, idx) => (
                    <div key={idx} style={{ fontSize: 13, opacity: 0.85 }}>
                      {u.route_path}: <b>{u.count}</b>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

