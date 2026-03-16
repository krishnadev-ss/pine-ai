import { geminiGenerate } from "./gemini";
import { DROPOFF_CLASSIFIER_SYSTEM_PROMPT } from "./prompts";

export interface DropoffClassification {
  root_cause: string;
  severity: "high" | "medium" | "low";
  recommended_action: string;
  voice_script_hint: string;
  should_call: boolean;
}

const KNOWN_REASONS = [
  "price_shock",
  "emi_confusion",
  "otp_timeout",
  "otp_failure",
  "bank_redirect_failure",
  "payment_method_mismatch",
  "payment_declined",
  "offer_confusion",
  "form_fatigue",
];

/**
 * Uses Gemini to classify a drop-off event into a structured context
 * that the voice agent can use.
 */
export async function classifyDropoff(signals: {
  drop_off_reason?: string | null;
  failure_code: string | null;
  last_screen: string;
  time_spent: number;
  amount: string;
}): Promise<DropoffClassification> {
  const input = `Classify this checkout drop-off:
- drop_off_reason: ${signals.drop_off_reason || "unknown"}
- failure_code: ${signals.failure_code || "none (frontend behavioural drop-off)"}
- last_screen: ${signals.last_screen}
- time_spent: ${signals.time_spent} seconds
- amount: ₹${signals.amount}`;

  try {
    const raw = await geminiGenerate(DROPOFF_CLASSIFIER_SYSTEM_PROMPT, input);
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
  drop_off_reason?: string | null;
  failure_code: string | null;
  last_screen: string;
  time_spent: number;
  amount: string;
}): DropoffClassification {
  const amount = parseInt(signals.amount) || 0;
  const severity: "high" | "medium" | "low" = amount > 5000 ? "high" : amount > 2000 ? "medium" : "low";

  // Trust drop_off_reason directly if it is a known type
  if (signals.drop_off_reason && KNOWN_REASONS.includes(signals.drop_off_reason)) {
    const reasonMap: Record<string, { action: string; hint: string; should_call: boolean }> = {
      price_shock: {
        action: "apply_cashback_offer",
        hint: "Main dekh raha hoon aap payment screen pe the — aapki order pe ek cashback offer available hai jo total kam kar dega. Kya main updated link bhejoon?",
        should_call: true,
      },
      emi_confusion: {
        action: "explain_emi",
        hint: "Kya aap EMI mein pay karna chahte the? Main aapko best no-cost EMI option explain kar sakta hoon aur ek pre-filled link bhej sakta hoon. Kya bhejoon?",
        should_call: true,
      },
      otp_timeout: {
        action: "send_upi_link",
        hint: "OTP mein kuch issue aa raha tha kya? Main aapko seedha UPI link bhej doon, usse bina OTP ke payment ho jaayega.",
        should_call: true,
      },
      otp_failure: {
        action: "send_upi_link",
        hint: "OTP enter karne mein dikkat aayi? Koi baat nahi — main aapko ek UPI link bhejta hoon jisse seedha payment ho jaayega.",
        should_call: true,
      },
      bank_redirect_failure: {
        action: "send_upi_link",
        hint: "Aapke bank ki site pe connection issue tha — yeh aapki galti nahi thi. Main aapko UPI link bhejta hoon jo instantly kaam karega.",
        should_call: true,
      },
      payment_method_mismatch: {
        action: "send_alternative_method",
        hint: "Lagta hai aapki preferred payment method available nahi thi. Main aapko ek link bhejta hoon jahan aap UPI, card, ya net banking se pay kar sakte hain.",
        should_call: true,
      },
      payment_declined: {
        action: "send_alternative_method",
        hint: "Aapka payment is baar complete nahi hua. Kya aap kisi doosre card ya UPI se try karna chahenge? Main aapko link bhejta hoon.",
        should_call: true,
      },
      offer_confusion: {
        action: "apply_cashback_offer",
        hint: "Aap offers dekh rahe the — main aapke liye best available offer apply karke updated checkout link bhej sakta hoon. Kya bhejoon?",
        should_call: true,
      },
      form_fatigue: {
        action: "follow_up_later",
        hint: "Checkout form mein kuch mushkil lagi? Main aapko baad mein call kar sakta hoon ya ek simpler link bhej sakta hoon.",
        should_call: severity === "high",
      },
    };

    const mapped = reasonMap[signals.drop_off_reason];
    return {
      root_cause: signals.drop_off_reason,
      severity,
      recommended_action: mapped.action,
      voice_script_hint: mapped.hint,
      should_call: mapped.should_call,
    };
  }

  // Hard failure from Pine Labs webhook
  if (signals.failure_code) {
    const codeMap: Record<string, { root_cause: string; action: string; hint: string }> = {
      bank_timeout: {
        root_cause: "bank_redirect_failure",
        action: "send_upi_link",
        hint: "Aapke bank ki site pe connection issue tha. Main aapko UPI link bhejta hoon jo instantly kaam karega.",
      },
      otp_timeout: {
        root_cause: "otp_timeout",
        action: "send_upi_link",
        hint: "OTP mein kuch issue aa raha tha kya? Main aapko seedha UPI link bhej doon, usse bina OTP ke payment ho jaayega.",
      },
      otp_failure: {
        root_cause: "otp_failure",
        action: "send_upi_link",
        hint: "OTP enter karne mein dikkat aayi? Main aapko UPI link bhejta hoon jisse seedha payment ho jaayega.",
      },
      payment_declined: {
        root_cause: "payment_declined",
        action: "send_alternative_method",
        hint: "Aapka payment is baar complete nahi hua. Kya aap kisi doosre card ya UPI se try karna chahenge?",
      },
      payment_method_unavailable: {
        root_cause: "payment_method_mismatch",
        action: "send_alternative_method",
        hint: "Aapki preferred payment method available nahi thi. Main alternatives bhejta hoon.",
      },
    };

    const mapped = codeMap[signals.failure_code] || {
      root_cause: "unknown",
      action: "retry_payment",
      hint: "Aapka payment complete nahi hua. Kya main aapko ek retry link bhej sakta hoon?",
    };

    return {
      root_cause: mapped.root_cause,
      severity: "high",
      recommended_action: mapped.action,
      voice_script_hint: mapped.hint,
      should_call: true,
    };
  }

  // Soft behavioural drop-off — classify from last_screen
  const screenMap: Record<string, { root_cause: string; action: string; hint: string }> = {
    price_breakdown: {
      root_cause: "price_shock",
      action: "apply_cashback_offer",
      hint: "Main dekh raha hoon aap payment screen pe the — aapki order pe ek cashback offer available hai. Kya main updated link bhejoon?",
    },
    emi_selection: {
      root_cause: "emi_confusion",
      action: "explain_emi",
      hint: "Kya aap EMI mein pay karna chahte the? Main aapko best no-cost EMI option explain kar sakta hoon.",
    },
    payment_method: {
      root_cause: "method_confusion",
      action: "send_alternative_method",
      hint: "Lagta hai payment method dhundhne mein thodi dikkat aayi. Main aapki madad kar sakta hoon.",
    },
    offer_selection: {
      root_cause: "offer_confusion",
      action: "apply_cashback_offer",
      hint: "Aap offers dekh rahe the — main best offer apply karke updated link bhej sakta hoon.",
    },
    address_form: {
      root_cause: "form_fatigue",
      action: "follow_up_later",
      hint: "Checkout form mein kuch mushkil lagi? Main aapko baad mein help kar sakta hoon.",
    },
    otp_screen: {
      root_cause: "otp_timeout",
      action: "send_upi_link",
      hint: "OTP mein kuch issue aa raha tha kya? Main aapko seedha UPI link bhej doon.",
    },
  };

  const mapped = screenMap[signals.last_screen] || {
    root_cause: "unknown",
    action: "follow_up_later",
    hint: "Aapka payment complete nahi hua. Kya main aapko retry link bhej sakta hoon?",
  };

  const shouldCall = mapped.root_cause !== "form_fatigue" || severity === "high";

  return {
    root_cause: mapped.root_cause,
    severity,
    recommended_action: mapped.action,
    voice_script_hint: mapped.hint,
    should_call: shouldCall,
  };
}