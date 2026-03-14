import { NextRequest, NextResponse } from "next/server";
import { storeCall } from "@/lib/call-store";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      transaction_id,
      customer_phone,
      customer_name,
      amount,
      merchant_name,
      drop_off_reason,
      mapped_reason,
      classification,
      context_source,
      available_offers,
      retry_link,
      language,
    } = payload;

    console.log("═══════════════════════════════════════════");
    console.log("🔔 Voice Recovery Agent Triggered!");
    console.log(`   Transaction: ${transaction_id}`);
    console.log(`   Customer: ${customer_name} (${customer_phone})`);
    console.log(`   Amount: ₹${amount}`);
    console.log(`   Merchant: ${merchant_name}`);
    console.log(`   Reason: ${drop_off_reason || mapped_reason}`);
    console.log(`   Source: ${context_source}`);
    if (classification) {
      console.log(`   AI Classification: ${classification.root_cause} (${classification.severity})`);
      console.log(`   Recommended: ${classification.recommended_action}`);
      console.log(`   Script hint: ${classification.voice_script_hint}`);
    }
    console.log("═══════════════════════════════════════════");

    const voiceEnabled = process.env.VOICE_CALLS_ENABLED === "true";
    const bolnaApiKey = process.env.BOLNA_API_KEY;
    const bolnaAgentId = process.env.BOLNA_AGENT_ID;

    let executionId: string | null = null;

    if (voiceEnabled && bolnaApiKey && bolnaAgentId) {
      // ===== REAL BOLNA API CALL =====
      console.log(`📞 Making real Bolna call to ${customer_phone}...`);

      const bolnaResponse = await fetch("https://api.bolna.ai/call", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${bolnaApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: bolnaAgentId,
          recipient_phone_number: customer_phone,
          user_data: {
            customer_name: customer_name || "Customer",
            amount: amount || "0",
            merchant_name: merchant_name || "Store",
            drop_off_reason: drop_off_reason || mapped_reason || "unknown",
            recommended_action: classification?.recommended_action || "retry_payment",
            voice_script_hint: classification?.voice_script_hint || "",
            available_offers: Array.isArray(available_offers) ? available_offers.join(", ") : (available_offers || "No special offers"),
            retry_link: retry_link || `${process.env.NEXT_PUBLIC_APP_URL || "https://pay.pinelabs.com"}/retry/${transaction_id}`,
            language: language || "en-IN",
          },
        }),
      });

      const bolnaData = await bolnaResponse.json();
      console.log("📞 Bolna API response:", JSON.stringify(bolnaData, null, 2));

      executionId = bolnaData.execution_id || bolnaData.call_id || bolnaData.id || null;

      if (!bolnaResponse.ok) {
        console.error("❌ Bolna call failed:", bolnaData);
        storeCall({
          transaction_id,
          execution_id: null,
          customer_phone,
          customer_name,
          amount,
          merchant_name,
          drop_off_reason: drop_off_reason || mapped_reason,
          call_status: "failed",
          outcome: `API error: ${bolnaResponse.status}`,
          triggered_at: new Date().toISOString(),
          completed_at: null,
        });
        return NextResponse.json({ success: false, error: "Bolna call failed", details: bolnaData }, { status: 502 });
      }
    } else {
      // ===== DRY RUN MODE =====
      console.log("🔇 VOICE_CALLS_ENABLED is false — dry run mode.");
      console.log(`   Would have called ${customer_phone} via Bolna agent ${bolnaAgentId || "(no agent ID)"}`);
      executionId = `dry_run_${Date.now()}`;
    }

    // Store call record
    storeCall({
      transaction_id,
      execution_id: executionId,
      customer_phone,
      customer_name,
      amount,
      merchant_name,
      drop_off_reason: drop_off_reason || mapped_reason,
      call_status: "triggered",
      outcome: null,
      triggered_at: new Date().toISOString(),
      completed_at: null,
    });

    return NextResponse.json({
      success: true,
      message: voiceEnabled ? "Voice agent call initiated via Bolna." : "Dry run — call simulated.",
      execution_id: executionId,
      transaction_id,
    });
  } catch (error: any) {
    console.error("Voice trigger error:", error);
    return NextResponse.json({ error: "Failed to trigger voice agent", details: error.message }, { status: 500 });
  }
}
