import { NextRequest, NextResponse } from "next/server";
import { getCall, getAllCalls } from "@/lib/call-store";

/**
 * GET /api/voice/status?transaction_id=TXN_123
 * 
 * Query the status of a voice recovery call by transaction ID.
 * If no transaction_id is provided, returns all call records.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transaction_id");

  if (transactionId) {
    const record = getCall(transactionId);
    if (!record) {
      return NextResponse.json({ error: "No call record found for this transaction" }, { status: 404 });
    }
    return NextResponse.json({ success: true, call: record });
  }

  // Return all calls if no specific transaction requested
  const all = getAllCalls();
  return NextResponse.json({ success: true, total: all.length, calls: all });
}
