/**
 * In-memory store for call tracking.
 * In production this would be Supabase or another persistent DB.
 */

export interface CallRecord {
  transaction_id: string;
  execution_id: string | null;
  customer_phone: string;
  customer_name: string;
  amount: string;
  merchant_name: string;
  drop_off_reason: string;
  call_status: "triggered" | "in_progress" | "completed" | "failed" | "no_answer";
  outcome: string | null;
  triggered_at: string;
  completed_at: string | null;
}

// Global in-memory map
const callStore = new Map<string, CallRecord>();

export function storeCall(record: CallRecord): void {
  callStore.set(record.transaction_id, record);
}

export function getCall(transactionId: string): CallRecord | undefined {
  return callStore.get(transactionId);
}

export function updateCall(transactionId: string, updates: Partial<CallRecord>): CallRecord | undefined {
  const existing = callStore.get(transactionId);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  callStore.set(transactionId, updated);
  return updated;
}

export function getAllCalls(): CallRecord[] {
  return Array.from(callStore.values());
}
