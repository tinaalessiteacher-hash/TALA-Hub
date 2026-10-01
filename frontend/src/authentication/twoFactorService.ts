import { demoEnabled, demoToolsEnabled } from "../shared/services/demoConfig";
import { demoDelay } from "../shared/services/demoDelay";

// UI contract only. No delivery method or Firebase contract has been approved.
export interface TwoFactorChallenge {
  id: string;
}
export interface TwoFactorService {
  setup(
    signal: AbortSignal,
    simulateError?: boolean,
  ): Promise<TwoFactorChallenge>;
  verify(
    challenge: TwoFactorChallenge,
    code: string,
    signal: AbortSignal,
    simulateError?: boolean,
  ): Promise<void>;
  cancel(challenge: TwoFactorChallenge): void;
}
export const demoVerificationCode = "246810";
const activeChallenges = new Set<string>();
let nextChallenge = 0;
function requireDemo() {
  if (!demoEnabled)
    throw new Error(
      "AWAITING BACKEND — two-factor authentication is not connected.",
    );
}
export const twoFactorService: TwoFactorService = {
  async setup(signal, simulateError) {
    requireDemo();
    await demoDelay(650, signal);
    if (demoToolsEnabled && simulateError)
      throw new Error("Could not start the demo setup. Try again.");
    const challenge = { id: `demo-challenge-${++nextChallenge}` };
    activeChallenges.add(challenge.id);
    return challenge;
  },
  async verify(challenge, code, signal, simulateError) {
    requireDemo();
    await demoDelay(650, signal);
    if (demoToolsEnabled && simulateError)
      throw new Error(
        "Verification is temporarily unavailable in this demo. Try again.",
      );
    if (!activeChallenges.has(challenge.id))
      throw new Error("This demo setup has ended. Go back and start again.");
    if (code !== demoVerificationCode)
      throw new Error(
        "That code does not match. Enter the demo code and try again.",
      );
    activeChallenges.delete(challenge.id);
  },
  cancel(challenge) {
    activeChallenges.delete(challenge.id);
  },
};
