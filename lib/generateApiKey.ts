import crypto from "crypto";

export function generateApiKey() {
  const rawKey = `sk_live_swarm_${crypto.randomBytes(24).toString("hex")}`;

  const hash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  return {
    rawKey, // show once
    hash,   // store only
  };
}
