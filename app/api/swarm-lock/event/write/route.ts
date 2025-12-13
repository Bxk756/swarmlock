import { incrementUsage } from "@/lib/incrementUsage";
import { USAGE_LIMITS } from "@/lib/usageLimits";

const routePath = "/api/swarm-lock/event/write";
const plan = keyData.plan ?? "free";

const used = await incrementUsage(keyData.id, routePath);
const limit = USAGE_LIMITS[plan][routePath];

if (used > limit) {
  return NextResponse.json(
    { error: "Usage limit exceeded" },
    {
      status: 429,
      headers: {
        "X-Usage-Limit": limit.toString(),
        "X-Usage-Remaining": "0",
      },
    }
  );
}

