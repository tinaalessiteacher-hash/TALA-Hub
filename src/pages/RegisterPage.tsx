import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { demoEnabled, demoToolsEnabled } from "../services/authService";
import {
  enrollmentService,
  enrollmentSteps,
  validateEnrollment,
} from "../services/enrollmentService";
import type {
  EnrollmentDraft,
  EnrollmentErrors,
  EnrollmentReceipt,
} from "../services/enrollmentService";
export function RegisterPage() {
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<EnrollmentDraft>({
    parentName: "",
    parentEmail: "",
    password: "",
    confirmPassword: "",
    studentName: "",
    studentEmail: "",
    learningMode: "",
    timeBlock: "",
    intent:
      params.get("intent") === "waiting-list" ? "Waiting list" : "Enrollment",
    documentsAcknowledged: false,
    funding: "",
    fundingAcknowledged: false,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<EnrollmentErrors>({});
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [simulateError, setSimulateError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [receipt, setReceipt] = useState<EnrollmentReceipt | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const failureBox = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (failure) failureBox.current?.focus();
  }, [failure]);
  useEffect(() => {
    heading.current?.focus();
  }, [step, receipt]);
  function change<K extends keyof EnrollmentDraft>(
    key: K,
    value: EnrollmentDraft[K],
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }
  function field(key: keyof EnrollmentDraft, label: string, type = "text") {
    return (
      <div className="form-field">
        <label htmlFor={key}>{label}</label>
        <input
          id={key}
          name={key}
          type={type}
          value={String(draft[key])}
          maxLength={
            type === "email"
              ? 254
              : key === "password" || key === "confirmPassword"
                ? 128
                : 80
          }
          required
          readOnly={pending}
          autoComplete="off"
          onChange={(e) => change(key, e.target.value)}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
        {errors[key] && (
          <p id={`${key}-error`} className="field-error">
            {errors[key]}
          </p>
        )}
      </div>
    );
  }
  function select(
    key: "learningMode" | "timeBlock" | "intent" | "funding",
    label: string,
    options: string[],
  ) {
    return (
      <div className="form-field">
        <label htmlFor={key}>{label}</label>
        <select
          id={key}
          value={draft[key]}
          required
          onChange={(e) => change(key, e.target.value)}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        >
          <option value="">Choose an option</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {errors[key] && (
          <p id={`${key}-error`} className="field-error">
            {errors[key]}
          </p>
        )}
      </div>
    );
  }
  function acknowledge(
    key: "documentsAcknowledged" | "fundingAcknowledged",
    label: string,
  ) {
    return (
      <>
        <label className="checkbox-row">
          <input
            id={key}
            type="checkbox"
            checked={draft[key]}
            onChange={(e) => change(key, e.target.checked)}
            aria-invalid={!!errors[key]}
            aria-describedby={errors[key] ? `${key}-error` : undefined}
          />
          {label}
        </label>
        {errors[key] && (
          <p id={`${key}-error`} className="field-error">
            {errors[key]}
          </p>
        )}
      </>
    );
  }
  async function next(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    const checked = validateEnrollment(draft, step);
    setErrors(checked);
    setFailure("");
    const first = Object.keys(checked)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }
    if (step < 5) {
      setStep(step + 1);
      return;
    }
    setPending(true);
    try {
      setReceipt(await enrollmentService.submit(draft, simulateError));
      setDraft((d) => ({ ...d, password: "", confirmPassword: "" }));
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Please retry.");
    } finally {
      setPending(false);
    }
  }
  if (receipt)
    return (
      <section className="container enrollment-page">
        <div className="enrollment-form">
          <p className="eyebrow">Registration demo complete</p>
          <h1 ref={heading} tabIndex={-1}>
            Your family demo is ready.
          </h1>
          <p>
            {receipt.parentName}, you have completed the parent-first steps for{" "}
            {receipt.studentName}.
          </p>
          <div className="notice">
            <strong>AWAITING BACKEND</strong>
            <p>
              No account, enrollment, payment or SkipCourse account was created.
              Real student access will follow verified registration and billing.
            </p>
          </div>
          <Link
            className="button"
            to="/login"
            state={{
              registered: {
                name: receipt.studentName,
                email: receipt.studentEmail,
              },
              family: receipt,
            }}
          >
            Continue to student demo login
          </Link>
          <p>
            <Link to="/login" state={{ family: receipt, role: "Parent" }}>
              Explore as a parent
            </Link>
          </p>
        </div>
      </section>
    );
  return (
    <section className="container enrollment-page">
      <header>
        <p className="eyebrow">Start with your family</p>
        <h1>Registration</h1>
        <p>A clear path from parent account to student access.</p>
      </header>
      <div className="enrollment-layout">
        <aside>
          <ol
            className="enrollment-progress"
            aria-label="Registration progress"
          >
            {enrollmentSteps.map((label, index) => (
              <li
                key={label}
                aria-current={step === index ? "step" : undefined}
              >
                <span>{index + 1}</span>
                {label}
                {index < step && <span className="sr-only"> completed</span>}
              </li>
            ))}
          </ol>
          <p className="small">
            Demo only. Use invented details. Entries stay on this page and are
            cleared when you leave or refresh.
          </p>
        </aside>
        <div className="enrollment-form">
          <p className="eyebrow">Step {step + 1} of 6</p>
          <h2 ref={heading} tabIndex={-1}>
            {enrollmentSteps[step]}
          </h2>
          <form ref={form} onSubmit={next} noValidate aria-busy={pending}>
            <fieldset
              disabled={pending || !demoEnabled}
              className="plain-fieldset"
            >
              {step === 0 && (
                <>
                  <p>
                    Create the parent account first. No real account is created
                    in this demo.
                  </p>
                  {field("parentName", "Parent name")}
                  {field("parentEmail", "Parent email", "email")}
                  {field(
                    "password",
                    "Demo password",
                    showPassword ? "text" : "password",
                  )}
                  {field(
                    "confirmPassword",
                    "Confirm demo password",
                    showPassword ? "text" : "password",
                  )}
                  <p className="small">
                    Use a made-up password with at least 8 characters.
                  </p>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show passwords
                  </label>
                </>
              )}
              {step === 1 && (
                <>
                  <p>
                    Add a sample student linked to this parent. Student access
                    follows all remaining steps.
                  </p>
                  {field("studentName", "Student name")}
                  {field("studentEmail", "Student email", "email")}
                  <p className="small">
                    AWAITING TINA — final student identity and guardian consent
                    requirements.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  {select("intent", "Registration interest", [
                    "Enrollment",
                    "Waiting list",
                  ])}
                  {select("learningMode", "Learning preference", [
                    "In-Person",
                    "Online",
                    "Hybrid",
                  ])}
                  {select("timeBlock", "Preferred time block", [
                    "6–8 AM",
                    "8–10 AM",
                    "10 AM–12 PM",
                    "12–2 PM",
                    "2–4 PM",
                    "4–6 PM",
                  ])}
                  <p className="small">
                    Arizona time. Preferences do not reserve a place.
                    Availability and placement await school review.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="notice">
                    <strong>AWAITING TINA — required document checklist</strong>
                    <p>
                      The supplied layout does not include a final checklist. No
                      health records, identity documents or files should be
                      uploaded here.
                    </p>
                  </div>
                  {acknowledge(
                    "documentsAcknowledged",
                    "I understand this demo does not collect or submit documents.",
                  )}
                </>
              )}
              {step === 4 && (
                <>
                  {select("funding", "Funding preference", [
                    "ESA",
                    "STO",
                    "Private",
                  ])}
                  <div className="notice">
                    <strong>AWAITING BACKEND — billing connection</strong>
                    <p>No charge will be made. Do not enter payment details.</p>
                    <p>
                      AWAITING SPONSOR — fees, funding eligibility and payment
                      instructions. Selecting ESA or STO does not establish
                      approval or coverage.
                    </p>
                  </div>
                  {acknowledge(
                    "fundingAcknowledged",
                    "I understand that no payment or funding approval takes place.",
                  )}
                </>
              )}
              {step === 5 && (
                <>
                  <p>Check the details before completing this demonstration.</p>
                  <dl className="review-list">
                    {[
                      [
                        "Parent",
                        `${draft.parentName} · ${draft.parentEmail}`,
                        0,
                      ],
                      [
                        "Student",
                        `${draft.studentName} · ${draft.studentEmail}`,
                        1,
                      ],
                      [
                        "Enrollment",
                        `${draft.intent} · ${draft.learningMode} · ${draft.timeBlock}`,
                        2,
                      ],
                      ["Documents", "Checklist pending; nothing uploaded", 3],
                      ["Funding", `${draft.funding} · no payment`, 4],
                    ].map(([label, value, index]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => setStep(Number(index))}
                        >
                          Edit {label}
                        </button>
                      </div>
                    ))}
                  </dl>
                  <p className="small">
                    Completing this demo does not submit an application.
                    AWAITING BACKEND — account creation, billing verification
                    and SkipCourse provisioning.
                  </p>
                </>
              )}
              {failure && (
                <p
                  ref={failureBox}
                  tabIndex={-1}
                  className="notice error"
                  role="alert"
                >
                  {failure}
                </p>
              )}
              <div className="form-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => {
                      setStep(step - 1);
                      setErrors({});
                      setFailure("");
                    }}
                  >
                    Back
                  </button>
                )}
                <button className="button" type="submit">
                  {pending
                    ? "Completing demo…"
                    : step === 5
                      ? "Complete registration demo"
                      : "Continue"}
                </button>
              </div>
            </fieldset>
            <p role="status" className="sr-only">
              {pending
                ? "Please wait…"
                : Object.values(errors).some(Boolean)
                  ? "Please correct the marked fields."
                  : ""}
            </p>
            {demoToolsEnabled && step === 5 && (
              <details className="demo-tools">
                <summary>Demo testing options</summary>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={simulateError}
                    disabled={pending}
                    onChange={(e) => setSimulateError(e.target.checked)}
                  />
                  Simulate service error
                </label>
              </details>
            )}
          </form>
          {!demoEnabled && (
            <p role="alert">AWAITING BACKEND — demo mode is disabled.</p>
          )}
        </div>
      </div>
    </section>
  );
}
