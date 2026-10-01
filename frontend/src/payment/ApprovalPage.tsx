import { Link } from "react-router-dom";
import type { DemoSession } from "../shared/services/serviceTypes";
import { demoToolsEnabled } from "../shared/services/demoConfig";
import { useApproval } from "./useApproval";
import { selectApprovalDemo } from "./paymentService";
import type { ApprovalStatus } from "./paymentService";
const labels: Record<ApprovalStatus, string> = {
  pending: "Pending review",
  approved: "Approved (demo)",
  "not-approved": "Not approved (demo)",
};
export function ApprovalPage({ session }: { session: DemoSession }) {
  const { state, reload } = useApproval(session);
  return (
    <section className="container enrollment-page payment-page">
      <div className="enrollment-form">
        <p className="eyebrow">Your next step</p>
        <h1>Enrollment status</h1>
        <p>Review your application status before continuing to payment.</p>
        <div className="notice">
          <strong>Approval demo · AWAITING BACKEND</strong>
          No school approval has been issued. Choose a sample status below to
          explore the flow. It resets on refresh, sign-out or a change of demo
          identity.
        </div>
        {state.status === "loading" && <p role="status">Checking approval…</p>}
        {state.status === "error" && (
          <div className="notice error" role="alert">
            <p>{state.message}</p>
            <button className="button" onClick={() => reload()}>
              Retry approval check
            </button>
          </div>
        )}
        {state.status === "ready" && (
          <>
            <h2>{labels[state.approval]}</h2>
            <p>
              {state.approval === "approved"
                ? "This sample application can continue to the payment demo. Funding eligibility and fees are not confirmed."
                : state.approval === "pending"
                  ? "Payment is unavailable while this sample application is awaiting review."
                  : "Payment is unavailable for this sample application. Real review and next steps are AWAITING BACKEND / AWAITING SPONSOR."}
            </p>
            {state.approval === "approved" && (
              <Link className="button" to="/payment">
                Continue to payment
              </Link>
            )}
          </>
        )}
        <div className="form-field approval-example">
          <label htmlFor="approval-example">Demo application status</label>
          <select
            id="approval-example"
            disabled={state.status !== "ready"}
            value={state.status === "ready" ? state.approval : ""}
            onChange={(event) => {
              selectApprovalDemo(session, event.target.value as ApprovalStatus);
              reload();
            }}
          >
            <option value="" disabled>
              Loading status…
            </option>
            <option value="pending">Pending review</option>
            <option value="approved">Approved (demo)</option>
            <option value="not-approved">Not approved (demo)</option>
          </select>
        </div>
        {demoToolsEnabled && (
          <details className="demo-tools">
            <summary>Demo testing options</summary>
            <button
              className="button button-outline"
              disabled={state.status === "loading"}
              onClick={() => reload(true)}
            >
              Simulate approval error
            </button>
          </details>
        )}
        <p>
          <Link to="/dashboard">Back to dashboard</Link>
        </p>
      </div>
    </section>
  );
}
