import { validateApiKey } from "@/lib/validateApiKey";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1️⃣ Read Authorization header
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const apiKey = auth.slice(7);

    // 2️⃣ Validate API key (no scope required for this route)
    const keyData = await validateApiKey(apiKey);
    if (!keyData) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // 3️⃣ ✅ FIX: alias `id` → `apiKeyId`
    const { projectId, id: apiKeyId } = keyData;

    // 4️⃣ Process request scoped to projectId
    // (example: log event, increment stats, etc.)

    return NextResponse.json({
      ok: true,
      projectId,
      apiKeyId,
    });
  } catch (err: any) {
    if (err?.message === "RATE_LIMIT_EXCEEDED") {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    console.error("event route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




  
