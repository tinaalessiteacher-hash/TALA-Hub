import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { DemoSession } from "../shared/services/serviceTypes";
import { demoToolsEnabled } from "../shared/services/demoConfig";
import { paymentDraftError, paymentService } from "./paymentService";
import type {
  DemoPaymentReceipt,
  FundingMethod,
  PaymentDraft,
} from "./paymentService";
export function PaymentForm({ session }: { session: DemoSession }) {
  const [draft, setDraft] = useState<PaymentDraft>({
    funding: "",
    acknowledged: false,
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState<DemoPaymentReceipt | null>(null);
  const [simulateError, setSimulateError] = useState(false);
  const request = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const errorBox = useRef<HTMLParagraphElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (receipt) success.current?.focus();
  }, [receipt]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (request.current || receipt) return;
    const validation = paymentDraftError(draft);
    setError(validation);
    if (validation) {
      form.current
        ?.querySelector<HTMLElement>(
          draft.funding ? "#payment-acknowledged" : "#payment-funding",
        )
        ?.focus();
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    try {
      setReceipt(
        await paymentService.submit(
          session,
          draft,
          controller.signal,
          simulateError,
        ),
      );
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(
          failure instanceof Error ? failure.message : "Please try again.",
        );
        requestAnimationFrame(() => errorBox.current?.focus());
      }
    } finally {
      if (!controller.signal.aborted) setPending(false);
      request.current = null;
    }
  }
  if (receipt)
    return (
      <section className="payment-success" role="status">
        <span className="success-mark" aria-hidden="true">
          ✓
        </span>
        <h2 ref={success} tabIndex={-1}>
          Payment demo complete
        </h2>
        <p className="payment-success-lead">
          Sample funding choice: {receipt.funding}. It is recorded only for this
          browser session.
        </p>
        <dl className="payment-summary">
          <div>
            <dt>Status</dt>
            <dd>Demo complete</dd>
          </div>
          <div>
            <dt>Funding method</dt>
            <dd>{receipt.funding}</dd>
          </div>
          <div>
            <dt>Amount charged</dt>
            <dd>$0 · Demo only</dd>
          </div>
        </dl>
        <p>
          No money was paid, no funding was approved and no financial
          information was saved. A real receipt will come from the payment
          provider once connected.
        </p>
      </section>
    );
  return (
    <form
      ref={form}
      className="payment-form"
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      <div className="payment-approved-banner" role="status">
        <span aria-hidden="true">✓</span>
        <div>
          <strong>Approved to continue</strong>
          <p>This status is a demo fixture and was not issued by TALA.</p>
        </div>
      </div>
      <dl className="payment-summary">
        <div>
          <dt>Account</dt>
          <dd>{session.email}</dd>
        </div>
        <div>
          <dt>Amount due</dt>
          <dd>AWAITING SPONSOR — fees have not been provided.</dd>
        </div>
      </dl>
      <fieldset className="plain-fieldset" disabled={pending}>
        <legend>Choose a funding method</legend>
        <div className="form-field">
          <label htmlFor="payment-funding">Funding method</label>
          <select
            id="payment-funding"
            required
            value={draft.funding}
            aria-invalid={!!error && !draft.funding}
            aria-describedby={error ? "payment-error" : undefined}
            onChange={(event) => {
              setDraft({
                ...draft,
                funding: event.target.value as FundingMethod,
              });
              setError("");
            }}
          >
            <option value="">Choose a method</option>
            <option>ESA</option>
            <option>STO</option>
            <option value="Private">Private funding</option>
          </select>
        </div>
        <p className="small">
          This choice does not verify ESA or STO eligibility. Card numbers, bank
          details and billing addresses are not collected.
        </p>
        {draft.funding && (
          <div className="funding-explanation" role="status">
            <strong>
              {draft.funding === "Private"
                ? "Private funding selected"
                : `${draft.funding} funding selected`}
            </strong>
            <p>
              {draft.funding === "ESA"
                ? "A future integration must verify ESA eligibility and approved expenses before payment."
                : draft.funding === "STO"
                  ? "A future integration must confirm the scholarship award and remaining balance."
                  : "A future payment provider will securely collect billing details. This demo does not."}
            </p>
          </div>
        )}
        <label className="checkbox-row">
          <input
            id="payment-acknowledged"
            type="checkbox"
            required
            checked={draft.acknowledged}
            aria-invalid={!!error && !!draft.funding && !draft.acknowledged}
            aria-describedby={error ? "payment-error" : undefined}
            onChange={(event) => {
              setDraft({ ...draft, acknowledged: event.target.checked });
              setError("");
            }}
          />
          I understand this is a demo and no money will be paid.
        </label>
        {error && (
          <p
            id="payment-error"
            ref={errorBox}
            tabIndex={-1}
            role="alert"
            className="notice error"
          >
            {error}
          </p>
        )}
        <button className="button payment-submit" type="submit">
          {pending ? "Completing payment demo…" : "Complete payment demo"}
        </button>
      </fieldset>
      <p role="status" className="small">
        {pending ? "Please wait. No payment is being processed." : ""}
      </p>
      {demoToolsEnabled && (
        <details className="demo-tools">
          <summary>Demo testing options</summary>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={simulateError}
              disabled={pending}
              onChange={(event) => setSimulateError(event.target.checked)}
            />
            Simulate payment error
          </label>
          <p>Uncheck to retry. Your choices stay on this page.</p>
        </details>
      )}
    </form>
  );
}
