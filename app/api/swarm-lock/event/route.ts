import { validateApiKey } from "@/lib/validateApiKey";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const apiKey = auth?.replace("Bearer ", "");

    const keyData = await validateApiKey(apiKey || "");

    if (!keyData) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const { projectId, apiKeyId } = keyData;

    // ✅ process request scoped to projectId
    // example: log event, increment stats, etc.

    return NextResponse.json({
      ok: true,
      projectId,
    });

  } catch (err: any) {
    if (err?.message === "RATE_LIMIT_EXCEEDED") {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    throw err;
  }
}



  
