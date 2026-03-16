import { NextRequest, NextResponse } from "next/server";
import { classifyDropoff } from "@/lib/classify-dropoff";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("📡 Pine Labs Webhook — Hard Failure Received:", payload);

    // Use Gemini to classify the drop-off
    const classification = await classifyDropoff({
      drop_off_reason: payload.drop_off_reason,
      failure_code: payload.failure_code || null,
      last_screen: payload.last_screen || "payment_processing",
      time_spent: payload.time_spent || 0,
      amount: payload.amount || "0",
    });

    console.log("🧠 AI Classification:", classification);

    const contextObject = {
      transaction_id: payload.transaction_id || `TXN_${Math.floor(Math.random() * 100000)}`,
      customer_phone: payload.customer_phone || "+919876543210",
      customer_name: payload.customer_name || "Customer",
      amount: payload.amount || "4500",
      merchant_name: payload.merchant_name || "Croma",
      drop_off_reason: payload.failure_code || "unknown",
      mapped_reason: classification.root_cause,
      classification,
      available_offers: payload.available_offers || ["HDFC 10% cashback", "No cost EMI 6 months"],
      retry_link: payload.retry_link || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/retry/${payload.transaction_id}`,
      language: payload.language || "en-IN",
      context_source: "pinelabs_webhook",
    };

    // Only trigger voice agent if classification says we should call
    if (classification.should_call) {
      fetch(new URL("/api/voice/trigger", req.url).toString(), {
        method: "POST",
        body: JSON.stringify(contextObject),
        headers: { "Content-Type": "application/json" },
      }).catch((e) => console.error("Voice trigger error:", e));
    } else {
      console.log("📋 Classification says no call needed. Logging only.");
    }

    return NextResponse.json({ success: true, classification, context_built: contextObject });
  } catch (error: any) {
    console.error("Pine Labs webhook error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
