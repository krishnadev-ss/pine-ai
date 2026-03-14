import { NextRequest, NextResponse } from "next/server";
import { updateCall, getCall } from "@/lib/call-store";
import { sendSMS } from "@/lib/sms";

/**
 * POST /api/voice/callback
 * 
 * Webhook endpoint that Bolna calls back with call outcomes.
 * Configure this URL as the webhook_url in your Bolna agent.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("═══════════════════════════════════════════");
    console.log("📲 Voice Callback Received from Bolna:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("═══════════════════════════════════════════");

    // Bolna may send various event types — extract relevant fields
    const transactionId = payload.transaction_id || payload.context_variables?.transaction_id;
    const executionId = payload.execution_id || payload.call_id;
    const callStatus = payload.status; // "completed", "failed", "no_answer", etc.

    // Map Bolna outcomes to our internal outcome types
    let outcome: string | null = null;
    const transcript = payload.transcript || "";

    if (callStatus === "completed") {
      // Analyze transcript or Bolna's own analysis for outcome
      if (payload.outcome) {
        outcome = payload.outcome;
      } else if (transcript.toLowerCase().includes("upi") || transcript.toLowerCase().includes("link")) {
        outcome = "upi_link_sent";
      } else if (transcript.toLowerCase().includes("emi")) {
        outcome = "emi_selected";
      } else if (transcript.toLowerCase().includes("not interested") || transcript.toLowerCase().includes("no")) {
        outcome = "declined";
      } else {
        outcome = "completed_unknown";
      }
    } else if (callStatus === "no_answer" || callStatus === "unanswered") {
      outcome = "no_answer";
    } else if (callStatus === "failed" || callStatus === "error") {
      outcome = "failed";
    } else if (callStatus === "busy" || callStatus === "rejected") {
      outcome = "call_dropped";
    }

    // Update call record if we can find the transaction
    if (transactionId) {
      const updated = updateCall(transactionId, {
        call_status: callStatus === "completed" ? "completed" : callStatus === "no_answer" ? "no_answer" : "failed",
        outcome,
        completed_at: new Date().toISOString(),
        execution_id: executionId || undefined,
      });

      if (updated) {
        console.log(`✅ Call record updated for ${transactionId}: ${outcome}`);
      } else {
        console.log(`⚠️ No call record found for transaction ${transactionId}`);
      }
    }

    // If call_dropped or no_answer, we could schedule a follow-up in 2 hours
    if (outcome === "call_dropped" || outcome === "no_answer") {
      console.log(`⏰ Scheduling follow-up call for ${transactionId} in 2 hours`);
      // In production: schedule via a queue/cron job
    }

    return NextResponse.json({
      success: true,
      transaction_id: transactionId,
      outcome,
      message: "Callback processed successfully",
    });
  } catch (error: any) {
    console.error("Voice callback error:", error);
    return NextResponse.json({ error: "Failed to process callback", details: error.message }, { status: 500 });
  }
}
