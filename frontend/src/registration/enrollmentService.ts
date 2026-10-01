import { demoDelay } from "../shared/services/demoDelay";
import { demoEnabled } from "../shared/services/demoConfig";
export const enrollmentSteps = [
  "Parent account",
  "Student information",
  "Enrollment information",
  "Required documents",
  "Billing / funding",
  "Review",
] as const;
export interface EnrollmentDraft {
  parentName: string;
  parentEmail: string;
  password: string;
  confirmPassword: string;
  studentName: string;
  studentEmail: string;
  learningMode: string;
  timeBlock: string;
  intent: string;
  documentsAcknowledged: boolean;
  funding: string;
  fundingAcknowledged: boolean;
}
export interface EnrollmentReceipt {
  parentName: string;
  parentEmail: string;
  studentName: string;
  studentEmail: string;
}
export type EnrollmentErrors = Partial<Record<keyof EnrollmentDraft, string>>;
export function validateEnrollment(
  draft: EnrollmentDraft,
  step: number,
): EnrollmentErrors {
  const errors: EnrollmentErrors = {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (step === 0) {
    if (!draft.parentName.trim())
      errors.parentName = "Enter a sample parent name.";
    if (!email.test(draft.parentEmail.trim()))
      errors.parentEmail = "Enter a valid sample email.";
    if (draft.password.length < 8)
      errors.password = "Use a made-up password with at least 8 characters.";
    if (draft.password !== draft.confirmPassword)
      errors.confirmPassword = "Passwords must match.";
  }
  if (step === 1) {
    if (!draft.studentName.trim())
      errors.studentName = "Enter a sample student name.";
    if (!email.test(draft.studentEmail.trim()))
      errors.studentEmail = "Enter a valid sample student email.";
  }
  if (step === 2) {
    if (!["Enrollment", "Waiting list"].includes(draft.intent))
      errors.intent = "Choose enrollment or waiting list.";
    if (!draft.learningMode)
      errors.learningMode = "Choose a learning preference.";
    if (!draft.timeBlock) errors.timeBlock = "Choose a preferred time block.";
  }
  if (step === 3 && !draft.documentsAcknowledged)
    errors.documentsAcknowledged =
      "Please acknowledge that no documents are being submitted.";
  if (step === 4) {
    if (!draft.funding) errors.funding = "Choose a funding preference.";
    if (!draft.fundingAcknowledged)
      errors.fundingAcknowledged =
        "Please acknowledge that this is not a payment or funding approval.";
  }
  return errors;
}
// Frontend interface only. No endpoint or production contract has been supplied.
export interface EnrollmentService {
  submit(
    draft: EnrollmentDraft,
    simulateError?: boolean,
    signal?: AbortSignal,
  ): Promise<EnrollmentReceipt>;
}
export const enrollmentService: EnrollmentService = {
  async submit(draft, simulateError, signal) {
    if (!demoEnabled)
      throw new Error("AWAITING BACKEND — enrollment is not connected.");
    if (
      [0, 1, 2, 3, 4].some(
        (step) => Object.keys(validateEnrollment(draft, step)).length,
      )
    )
      throw new Error("Please check each registration step.");
    await demoDelay(700, signal);
    if (simulateError)
      throw new Error(
        "The demo could not complete. Your entries are still here. Uncheck the test error and retry.",
      );
    // Passwords, documents and billing details are deliberately never persisted.
    return {
      parentName: draft.parentName.trim(),
      parentEmail: draft.parentEmail.trim(),
      studentName: draft.studentName.trim(),
      studentEmail: draft.studentEmail.trim(),
    };
  },
};
