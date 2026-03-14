import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { CHECKOUT_AGENT_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { message, cart_total, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Build context-enriched user message
    const contextMessage = `[Cart Total: ₹${(cart_total || 4500).toLocaleString()}]\n\nCustomer: ${message}`;

    // Call Gemini with conversation history
    const rawReply = await geminiChat(
      CHECKOUT_AGENT_SYSTEM_PROMPT,
      contextMessage,
      history || []
    );

    // Parse action markers from the response
    let reply = rawReply;
    let action: { type: string; value?: string } | null = null;

    const actionMatch = rawReply.match(/<<<ACTION:(\w+)(?::(.+?))?>>>/);
    if (actionMatch) {
      reply = rawReply.replace(/<<<ACTION:\w+(?::.+?)?>>>/, "").trim();
      action = {
        type: actionMatch[1].toLowerCase(),
        value: actionMatch[2] || undefined,
      };
    }

    return NextResponse.json({
      reply,
      action,
    });
  } catch (error: any) {
    console.error("Checkout chat error:", error);

    // Graceful fallback if Gemini key isn't set
    if (error.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json({
        reply: "I'm having trouble connecting right now. You can browse EMI options on the left or try again in a moment!",
        action: null,
        error: "API key not configured",
      });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
