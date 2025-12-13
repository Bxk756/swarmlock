import crypto from "crypto";

export function generateApiKey() {
  const raw = `sk_live_swarm_${crypto.randomBytes(24).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  return { raw, hash };
}
