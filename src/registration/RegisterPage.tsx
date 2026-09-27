import { demoEnabled, demoToolsEnabled } from "../shared/services/demoConfig";
import { enrollmentSteps } from "./enrollmentService";
import { useRegistration } from "./useRegistration";
import { RegistrationFields } from "./RegistrationFields";
import { RegistrationComplete } from "./RegistrationComplete";

export function RegisterPage() {
  const {
    draft,
    step,
    errors,
    pending,
    failure,
    simulateError,
    showPassword,
    receipt,
    heading,
    form,
    failureBox,
    change,
    next,
    setStep,
    goBack,
    setSimulateError,
    setShowPassword,
  } = useRegistration();
  if (receipt)
    return <RegistrationComplete receipt={receipt} heading={heading} />;
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
              <RegistrationFields
                {...{
                  draft,
                  errors,
                  pending,
                  step,
                  showPassword,
                  change,
                  setShowPassword,
                  setStep,
                }}
              />
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
                    onClick={goBack}
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
