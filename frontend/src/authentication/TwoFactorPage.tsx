import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { TextField } from "../shared/TextField";
import { demoEnabled, demoToolsEnabled } from "../shared/services/demoConfig";
import type { EnrollmentReceipt } from "../registration/enrollmentService";
import { RegistrationComplete } from "../registration/RegistrationComplete";
import { demoVerificationCode, twoFactorService } from "./twoFactorService";
import type { TwoFactorChallenge } from "./twoFactorService";

export function TwoFactorPage({
  receipt,
  verified,
  onVerified,
  onCancel,
}: {
  receipt: EnrollmentReceipt | null;
  verified: boolean;
  onVerified: () => void;
  onCancel: () => void;
}) {
  const [challenge, setChallenge] = useState<TwoFactorChallenge | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const request = useRef<AbortController | null>(null);
  const activeChallenge = useRef<TwoFactorChallenge | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLParagraphElement>(null);
  useEffect(
    () => () => {
      request.current?.abort();
      if (activeChallenge.current)
        twoFactorService.cancel(activeChallenge.current);
    },
    [],
  );
  useEffect(() => {
    heading.current?.focus();
  }, [challenge, verified]);
  useEffect(() => {
    if (error) errorBox.current?.focus();
  }, [error]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (request.current || !receipt) return;
    setError("");
    if (challenge && !/^\d{6}$/.test(code.trim())) {
      setError("Enter the six-digit verification code.");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    try {
      if (challenge) {
        await twoFactorService.verify(
          challenge,
          code.trim(),
          controller.signal,
          simulateError,
        );
        activeChallenge.current = null;
        setCode("");
        onVerified();
      } else {
        const next = await twoFactorService.setup(
          controller.signal,
          simulateError,
        );
        activeChallenge.current = next;
        setChallenge(next);
      }
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(
          failure instanceof Error ? failure.message : "Please try again.",
        );
    } finally {
      if (!controller.signal.aborted) setPending(false);
      request.current = null;
    }
  }
  function back() {
    if (challenge) twoFactorService.cancel(challenge);
    activeChallenge.current = null;
    setChallenge(null);
    setCode("");
    setError("");
    setSimulateError(false);
  }
  if (!receipt)
    return (
      <section className="container enrollment-page">
        <h1>Start with registration</h1>
        <p>
          No signup is waiting for verification. Refreshing clears unfinished
          demo setup.
        </p>
        <Link className="button" to="/register">
          Start registration
        </Link>
        <p>
          <Link to="/login">Back to community login</Link>
        </p>
      </section>
    );
  if (verified)
    return <RegistrationComplete receipt={receipt} heading={heading} />;
  return (
    <section className="container enrollment-page security-page">
      <div className="enrollment-form">
        <p className="eyebrow">
          Parent signup · {challenge ? "Step 2 of 2" : "Step 1 of 2"}
        </p>
        <h1 ref={heading} tabIndex={-1}>
          {challenge ? "Verify your code" : "Set up two-factor authentication"}
        </h1>
        <p>
          {challenge
            ? "Enter the sample code to finish this signup demo."
            : "A second verification step comes after your parent account details, before opening your workspace."}
        </p>
        <div className="notice">
          <strong>2FA demo · AWAITING BACKEND</strong>
          No email or text is sent, and no authenticator is connected. This does
          not secure a real account. Delivery method and recovery rules are
          awaiting confirmation.
        </div>
        <form onSubmit={submit} noValidate aria-busy={pending}>
          {challenge && (
            <TextField
              id="verification-code"
              label="Verification code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              readOnly={pending}
              error={error || undefined}
              hint={
                <>
                  For this demo only, enter{" "}
                  <strong>{demoVerificationCode}</strong>. No real code is
                  needed.
                </>
              }
            />
          )}
          {error && (
            <p
              ref={errorBox}
              tabIndex={-1}
              role="alert"
              className="notice error"
            >
              {error}
            </p>
          )}
          <div className="form-actions">
            {challenge && (
              <button
                type="button"
                className="button button-outline"
                disabled={pending}
                onClick={back}
              >
                Back to setup
              </button>
            )}
            <button className="button" disabled={pending || !demoEnabled}>
              {pending
                ? challenge
                  ? "Verifying…"
                  : "Preparing setup…"
                : challenge
                  ? "Verify code"
                  : "Continue to verification"}
            </button>
          </div>
          <p role="status" className="small">
            {pending ? "Please wait…" : ""}
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
                Simulate 2FA service error
              </label>
              <p>Uncheck to retry normally. No request is sent.</p>
            </details>
          )}
        </form>
        {!demoEnabled && (
          <p role="alert">AWAITING BACKEND — demo mode is disabled.</p>
        )}
        <button className="text-link" disabled={pending} onClick={onCancel}>
          Cancel signup demo
        </button>
        <p className="small">
          Setup stays in memory only. Leaving this page restarts setup;
          refreshing clears the signup.
        </p>
      </div>
    </section>
  );
}
