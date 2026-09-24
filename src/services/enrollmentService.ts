import { demoEnabled } from "./authService";
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
  d: EnrollmentDraft,
  step: number,
): EnrollmentErrors {
  const errors: EnrollmentErrors = {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (step === 0) {
    if (!d.parentName.trim()) errors.parentName = "Enter a sample parent name.";
    if (!email.test(d.parentEmail.trim()))
      errors.parentEmail = "Enter a valid sample email.";
    if (d.password.length < 8)
      errors.password = "Use a made-up password with at least 8 characters.";
    if (d.password !== d.confirmPassword)
      errors.confirmPassword = "Passwords must match.";
  }
  if (step === 1) {
    if (!d.studentName.trim())
      errors.studentName = "Enter a sample student name.";
    if (!email.test(d.studentEmail.trim()))
      errors.studentEmail = "Enter a valid sample student email.";
  }
  if (step === 2) {
    if (!["Enrollment", "Waiting list"].includes(d.intent))
      errors.intent = "Choose enrollment or waiting list.";
    if (!d.learningMode) errors.learningMode = "Choose a learning preference.";
    if (!d.timeBlock) errors.timeBlock = "Choose a preferred time block.";
  }
  if (step === 3 && !d.documentsAcknowledged)
    errors.documentsAcknowledged =
      "Please acknowledge that no documents are being submitted.";
  if (step === 4) {
    if (!d.funding) errors.funding = "Choose a funding preference.";
    if (!d.fundingAcknowledged)
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
  ): Promise<EnrollmentReceipt>;
}
export const enrollmentService: EnrollmentService = {
  async submit(draft, simulateError) {
    if (!demoEnabled)
      throw new Error("AWAITING BACKEND — enrollment is not connected.");
    if (
      [0, 1, 2, 3, 4].some(
        (step) => Object.keys(validateEnrollment(draft, step)).length,
      )
    )
      throw new Error("Please check each registration step.");
    await new Promise((resolve) => setTimeout(resolve, 700));
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
