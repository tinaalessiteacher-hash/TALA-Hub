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
const descriptions: Record<ApprovalStatus, string> = {
  pending:
    "Payment remains locked while this sample application is awaiting review.",
  approved:
    "This sample application can continue to funding. Eligibility and fees are not confirmed.",
  "not-approved":
    "Payment remains locked. Real review details and next steps require the approval backend and school policy.",
};
export function ApprovalPage({ session }: { session: DemoSession }) {
  const { state, reload } = useApproval(session);
  return (
    <section className="container enrollment-page payment-page">
      <div className="enrollment-form">
        <p className="eyebrow">Your next step</p>
        <h1>Enrollment status</h1>
        <p>Review your application status before continuing to payment.</p>
        <ol className="payment-steps" aria-label="Enrollment payment progress">
          <li className="is-complete">Application</li>
          <li className="is-current" aria-current="step">
            Approval
          </li>
          <li>Funding</li>
        </ol>
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
          <section
            className={`approval-result approval-result-${state.approval}`}
            aria-labelledby="approval-result-heading"
          >
            <p className="status-label">Current application status</p>
            <h2 id="approval-result-heading">{labels[state.approval]}</h2>
            <p>{descriptions[state.approval]}</p>
            {state.approval === "approved" && (
              <Link className="button" to="/payment">
                Continue to payment
              </Link>
            )}
          </section>
        )}
        <div className="form-field approval-example">
          <label htmlFor="approval-example">Demo application status</label>
          <p id="approval-example-hint" className="small">
            This control changes an in-memory sample only. It cannot approve a
            real application.
          </p>
          <select
            id="approval-example"
            aria-describedby="approval-example-hint"
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
