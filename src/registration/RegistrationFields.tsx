import { TextField } from "../shared/TextField";
import { RegistrationReview } from "./RegistrationReview";
import type { EnrollmentDraft, EnrollmentErrors } from "./enrollmentService";

interface Props {
  draft: EnrollmentDraft;
  errors: EnrollmentErrors;
  pending: boolean;
  step: number;
  showPassword: boolean;
  change: <K extends keyof EnrollmentDraft>(
    key: K,
    value: EnrollmentDraft[K],
  ) => void;
  setShowPassword: (visible: boolean) => void;
  setStep: (step: number) => void;
}
export function RegistrationFields({
  draft,
  errors,
  pending,
  step,
  showPassword,
  change,
  setShowPassword,
  setStep,
}: Props) {
  function field(key: keyof EnrollmentDraft, label: string, type = "text") {
    return (
      <TextField
        label={label}
        error={errors[key]}
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
      />
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
  return (
    <>
      {step === 0 && (
        <>
          <p>
            Create the parent account first. No real account is created in this
            demo.
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
            Add a sample student linked to this parent. Student access follows
            all remaining steps.
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
            Arizona time. Preferences do not reserve a place. Availability and
            placement await school review.
          </p>
        </>
      )}
      {step === 3 && (
        <>
          <div className="notice">
            <strong>AWAITING TINA — required document checklist</strong>
            <p>
              The supplied layout does not include a final checklist. No health
              records, identity documents or files should be uploaded here.
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
          {select("funding", "Funding preference", ["ESA", "STO", "Private"])}
          <div className="notice">
            <strong>AWAITING BACKEND — billing connection</strong>
            <p>No charge will be made. Do not enter payment details.</p>
            <p>
              AWAITING SPONSOR — fees, funding eligibility and payment
              instructions. Selecting ESA or STO does not establish approval or
              coverage.
            </p>
          </div>
          {acknowledge(
            "fundingAcknowledged",
            "I understand that no payment or funding approval takes place.",
          )}
        </>
      )}
      {step === 5 && <RegistrationReview draft={draft} onEdit={setStep} />}
    </>
  );
}
