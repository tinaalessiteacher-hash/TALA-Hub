import { demoDelay } from "../shared/services/demoDelay";
import type { AuthAdapter } from "../shared/services/serviceTypes";
export const demoAuthAdapter: AuthAdapter = {
  async login(email, _password, name, simulateError) {
    await demoDelay(650);
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
