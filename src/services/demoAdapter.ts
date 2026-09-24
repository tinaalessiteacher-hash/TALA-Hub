import { demoStudent, emptyStudent } from "./demoData";
import type { AuthAdapter, StudentAdapter } from "./serviceTypes";

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
}
export const demoAuthAdapter: AuthAdapter = {
  async login(email, _password, name, simulateError) {
    await delay(650);
    if (simulateError)
      throw new Error(
        "We could not open your demo session. Your details are still here; please try again.",
      );
    // No identity verification. This creates only a frontend demo session.
    return {
      mode: "demo",
      name: name?.trim() || "Demo learner",
      email: email.trim(),
    };
  },
};
export const demoStudentAdapter: StudentAdapter = {
  async getOverview(scenario, signal) {
    await delay(scenario === "loading" ? 4000 : 650, signal);
    if (scenario === "error")
      throw new Error(
        "We could not load your learning overview. Please try again.",
      );
    return structuredClone(scenario === "empty" ? emptyStudent : demoStudent);
  },
};
