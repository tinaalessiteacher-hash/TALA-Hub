import { demoEnabled, demoToolsEnabled } from "../shared/services/demoConfig";
import { demoDelay } from "../shared/services/demoDelay";
import type { DemoSession } from "../shared/services/serviceTypes";

// Frontend contracts, not approved backend schemas or authorization rules.
export type ApprovalStatus = "pending" | "approved" | "not-approved";
export type FundingMethod = "ESA" | "STO" | "Private";
export interface PaymentDraft {
  funding: FundingMethod | "";
  acknowledged: boolean;
}
export interface DemoPaymentReceipt {
  mode: "demo";
  funding: FundingMethod;
}
export interface PaymentService {
  getApproval(
    session: DemoSession,
    signal: AbortSignal,
    simulateError?: boolean,
  ): Promise<ApprovalStatus>;
  submit(
    session: DemoSession,
    draft: PaymentDraft,
    signal: AbortSignal,
    simulateError?: boolean,
  ): Promise<DemoPaymentReceipt>;
}
const approvals = new Map<string, ApprovalStatus>();
const receipts = new Map<string, DemoPaymentReceipt>();
const key = (session: DemoSession) =>
  JSON.stringify([session.role ?? "Student", session.email]);
function requireDemo() {
  if (!demoEnabled)
    throw new Error(
      "AWAITING BACKEND — approval and payment are not connected.",
    );
}
export function resetPaymentDemo(): void {
  approvals.clear();
  receipts.clear();
}
// Explicit fixture selection for walkthroughs, never a real approval action.
export function selectApprovalDemo(
  session: DemoSession,
  status: ApprovalStatus,
): void {
  requireDemo();
  approvals.set(key(session), status);
}
export function paymentDraftError(draft: PaymentDraft): string {
  if (!["ESA", "STO", "Private"].includes(draft.funding))
    return "Choose a funding method for this demo.";
  if (!draft.acknowledged)
    return "Confirm that this is a demo and no money will be paid.";
  return "";
}
export const paymentService: PaymentService = {
  async getApproval(session, signal, simulateError) {
    requireDemo();
    await demoDelay(500, signal);
    if (demoToolsEnabled && simulateError)
      throw new Error("Could not load approval status. Try again.");
    return approvals.get(key(session)) ?? "pending";
  },
  async submit(session, draft, signal, simulateError) {
    requireDemo();
    if (paymentDraftError(draft)) throw new Error(paymentDraftError(draft));
    if (approvals.get(key(session)) !== "approved")
      throw new Error("Approval is required before continuing to payment.");
    await demoDelay(700, signal);
    if (demoToolsEnabled && simulateError)
      throw new Error(
        "The payment demo could not complete. No payment was made. Try again.",
      );
    if (approvals.get(key(session)) !== "approved")
      throw new Error("Approval has changed. Return to enrollment status.");
    // Repeat submissions return the existing in-memory result; no financial data is stored.
    const receipt = receipts.get(key(session)) ?? {
      mode: "demo",
      funding: draft.funding as FundingMethod,
    };
    receipts.set(key(session), receipt);
    return receipt;
  },
};
