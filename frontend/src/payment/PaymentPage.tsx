import { Link } from "react-router-dom";
import { useApproval } from "./useApproval";
import { PaymentForm } from "./PaymentForm";
import type { DemoSession } from "../shared/services/serviceTypes";
export function PaymentPage({ session }: { session: DemoSession }) {
  const { state, reload } = useApproval(session);
  return (
    <section className="container enrollment-page payment-page">
      <div className="enrollment-form">
        <p className="eyebrow">Enrollment · Funding</p>
        <h1>Payment</h1>
        <p>Confirm a funding path for this approved enrollment demo.</p>
        <ol className="payment-steps" aria-label="Enrollment payment progress">
          <li className="is-complete">Application</li>
          <li className="is-complete">Approval</li>
          <li className="is-current" aria-current="step">
            Funding
          </li>
        </ol>
        <div className="notice">
          <strong>Payment demo · AWAITING BACKEND</strong>
          No charge will be made. Do not enter real payment information. Real
          approval, billing and payment processing are not connected.
        </div>
        {state.status === "loading" && (
          <div className="payment-state" role="status">
            <span className="state-dot" aria-hidden="true" />
            <div>
              <strong>Checking approval</strong>
              <p>Confirming that this demo can continue to funding…</p>
            </div>
          </div>
        )}
        {state.status === "error" && (
          <div role="alert" className="notice error">
            <p>{state.message}</p>
            <button className="button" onClick={() => reload()}>
              Retry approval check
            </button>
          </div>
        )}
        {state.status === "ready" &&
          (state.approval === "approved" ? (
            <PaymentForm session={session} />
          ) : (
            <div className="payment-state payment-state-locked" role="status">
              <span className="state-lock" aria-hidden="true">
                ×
              </span>
              <div>
                <strong>Approval required</strong>
                <p>
                  This application is{" "}
                  {state.approval === "pending"
                    ? "pending review"
                    : "not approved"}
                  . Return to enrollment status before continuing.
                </p>
              </div>
            </div>
          ))}
        <div className="form-actions">
          <Link to="/enrollment-status">Back to enrollment status</Link>
          <Link to="/dashboard">Back to dashboard</Link>
        </div>
      </div>
    </section>
  );
}
