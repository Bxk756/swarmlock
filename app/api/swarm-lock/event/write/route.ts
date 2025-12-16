import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/validateApiKey";
import { incrementUsage } from "@/lib/incrementUsage";

/**
 * SwarmLock event write endpoint
 * Writes events after API key validation
 */
export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 401 }
      );
    }

    const keyRecord = await validateApiKey(apiKey);

    if (!keyRecord) {
      return NextResponse.json(
        { error: "Invalid or revoked API key" },
        { status: 401 }
      );
    }

    // Track usage for this API key
    await incrementUsage(keyRecord.id);

    const body = await req.json();

    /**
     * TODO:
     * - Persist event to database
     * - Forward to analytics / detection pipeline
     * - Trigger alerting if needed
     */
    // console.log("SwarmLock write event:", body);

    return NextResponse.json({
      success: true,
      message: "Event written successfully",
    });
  } catch (err) {
    console.error("SwarmLock write error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
