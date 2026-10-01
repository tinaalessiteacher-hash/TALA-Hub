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
      <div role="status">
        <h2 ref={success} tabIndex={-1}>
          Payment demo complete
        </h2>
        <p>Sample funding choice: {receipt.funding}.</p>
        <p>
          No money was paid, no funding was approved and no financial
          information was saved. A real receipt will come from the payment
          provider once connected.
        </p>
      </div>
    );
  return (
    <form ref={form} onSubmit={submit} noValidate aria-busy={pending}>
      <dl className="review-list">
        <div>
          <dt>Application status</dt>
          <dd>Approved (demo only)</dd>
        </div>
        <div>
          <dt>Amount due</dt>
          <dd>AWAITING SPONSOR — fees have not been provided.</dd>
        </div>
      </dl>
      <fieldset className="plain-fieldset" disabled={pending}>
        <legend className="sr-only">Payment demo choices</legend>
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
        <button className="button" type="submit">
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
