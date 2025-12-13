export const metadata = {
  title: "Swarm Lock | Edge Security Shield",
  description: "Real-time edge security and threat protection for modern apps.",
};

export default function Home() {
  return (
    <main style={{ padding: "4rem", maxWidth: 720 }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Swarm Lock
      </h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Edge Security Shield for modern web applications.
      </p>

      <ul style={{ marginBottom: "2rem" }}>
        <li>🛡️ API threat ingestion</li>
        <li>⚡ Edge-native protection</li>
        <li>📊 Real-time security telemetry</li>
        <li>🔒 Supabase + Vercel hardened</li>
      </ul>

      <a
        href="/dashboard"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.25rem",
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: 6,
        }}
      >
        Open Dashboard →
      </a>
    </main>
  );
}

