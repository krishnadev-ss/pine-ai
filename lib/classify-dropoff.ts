import { geminiGenerate } from "./gemini";
import { DROPOFF_CLASSIFIER_SYSTEM_PROMPT } from "./prompts";

export interface DropoffClassification {
  root_cause: string;
  severity: "high" | "medium" | "low";
  recommended_action: string;
  voice_script_hint: string;
  should_call: boolean;
}

/**
 * Uses Gemini to classify a drop-off event into a structured context
 * that the voice agent can use.
 */
export async function classifyDropoff(signals: {
  failure_code: string | null;
  last_screen: string;
  time_spent: number;
  amount: string;
}): Promise<DropoffClassification> {
  const input = `Classify this checkout drop-off:
- failure_code: ${signals.failure_code || "none (frontend behavioural drop-off)"}
- last_screen: ${signals.last_screen}
- time_spent: ${signals.time_spent} seconds
- amount: ₹${signals.amount}`;

  try {
    const raw = await geminiGenerate(DROPOFF_CLASSIFIER_SYSTEM_PROMPT, input);
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed: DropoffClassification = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error("Gemini classification failed, using rule-based fallback:", error);
    return fallbackClassify(signals);
  }
}

/**
 * Rule-based fallback if Gemini is unavailable or returns invalid JSON.
 */
function fallbackClassify(signals: {
  failure_code: string | null;
  last_screen: string;
  time_spent: number;
  amount: string;
}): DropoffClassification {
  const amount = parseInt(signals.amount) || 0;

  if (signals.failure_code) {
    // Hard failure
    const codeMap: Record<string, { root_cause: string; action: string; hint: string }> = {
      bank_timeout: { root_cause: "bank_redirect_failed", action: "send_alternative_method", hint: "Bank connection timed out. Offer UPI link as alternative." },
      otp_timeout: { root_cause: "otp_timeout", action: "send_upi_link", hint: "OTP wasn't entered in time. Offer UPI payment link to bypass OTP." },
      otp_failure: { root_cause: "otp_failure", action: "send_upi_link", hint: "OTP entered incorrectly. Offer UPI link as simpler alternative." },
      payment_declined: { root_cause: "payment_declined", action: "send_alternative_method", hint: "Card was declined by the bank. Suggest trying another card or UPI." },
      payment_method_unavailable: { root_cause: "method_confusion", action: "send_alternative_method", hint: "Payment method not available. Help find another option." },
    };
    const mapped = codeMap[signals.failure_code] || { root_cause: "unknown", action: "retry_payment", hint: "Payment didn't go through. Offer to retry." };
    return { root_cause: mapped.root_cause, severity: "high", recommended_action: mapped.action, voice_script_hint: mapped.hint, should_call: true };
  }

  // Soft drop-off
  const screenMap: Record<string, { root_cause: string; action: string; hint: string }> = {
    price_breakdown: { root_cause: "price_shock", action: "offer_discount", hint: "Customer left at price screen. Mention available discounts or cashback." },
    emi_selection: { root_cause: "emi_confusion", action: "suggest_emi", hint: "Customer was checking EMI options. Explain the best no-cost EMI deal." },
    payment_method: { root_cause: "method_confusion", action: "send_alternative_method", hint: "Customer couldn't find a payment method. Help guide them." },
    offer_selection: { root_cause: "offer_confusion", action: "offer_discount", hint: "Customer was looking at offers. Apply the best available offer." },
    address_form: { root_cause: "form_fatigue", action: "follow_up_later", hint: "Checkout form was too long. Simplify and retry." },
  };
  const mapped = screenMap[signals.last_screen] || { root_cause: "unknown", action: "follow_up_later", hint: "Customer dropped off for unknown reason." };
  const severity = amount > 5000 ? "high" : amount > 2000 ? "medium" : "low";
  const shouldCall = mapped.root_cause !== "form_fatigue" || severity === "high";

  return { root_cause: mapped.root_cause, severity, recommended_action: mapped.action, voice_script_hint: mapped.hint, should_call: shouldCall };
}
