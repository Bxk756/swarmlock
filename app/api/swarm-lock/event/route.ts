import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/validateApiKey";
import { incrementUsage } from "@/lib/incrementUsage";

/**
 * SwarmLock event ingestion endpoint
 * Protected by API key
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

    // Increment usage for this API key
    await incrementUsage(keyRecord.id);

    const payload = await req.json();

    // TODO: process event payload (store, analyze, forward, etc.)
    // console.log("SwarmLock event:", payload);

    return NextResponse.json({
      success: true,
      message: "Event received",
    });
  } catch (err) {
    console.error("SwarmLock event error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



  
