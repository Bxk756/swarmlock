import { validateApiKey } from "@/lib/validateApiKey";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const apiKey = auth?.replace("Bearer ", "");

    const customerId = await validateApiKey(apiKey || "");

    if (!customerId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // process request…
    return NextResponse.json({ ok: true });

  } catch (err: any) {
    if (err.message === "RATE_LIMIT_EXCEEDED") {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    throw err;
  }
}




  
