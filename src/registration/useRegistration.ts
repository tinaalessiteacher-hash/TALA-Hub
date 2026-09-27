import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { enrollmentService, validateEnrollment } from "./enrollmentService";
import type {
  EnrollmentDraft,
  EnrollmentErrors,
  EnrollmentReceipt,
} from "./enrollmentService";
export function useRegistration() {
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
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
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
      setDraft((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Please retry.");
    } finally {
      setPending(false);
    }
  }
  function goBack() {
    setStep(step - 1);
    setErrors({});
    setFailure("");
  }
  return {
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
  };
}
