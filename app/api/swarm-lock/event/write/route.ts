
import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/validateApiKey";
import { incrementUsage } from "@/lib/incrementUsage";
import { USAGE_LIMITS } from "@/lib/usageLimits";

export async function POST(req: Request) {
  try {
    // 1️⃣ Authorization header
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const apiKey = auth.slice(7);

    // 2️⃣ Validate API key + scope
    const keyData = await validateApiKey(apiKey, "events:write");
    if (!keyData) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // 3️⃣ Usage metering
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

    // 4️⃣ Success response
    return NextResponse.json(
      {
        ok: true,
        usage: {
          used,
          limit,
          remaining: limit - used,
        },
      },
      {
        headers: {
          "X-Usage-Limit": limit.toString(),
          "X-Usage-Remaining": (limit - used).toString(),
        },
      }
    );
  } catch (err) {
    console.error("event/write error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
