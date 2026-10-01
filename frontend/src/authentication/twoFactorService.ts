import { Secret, TOTP } from "otpauth";
import QRCode from "qrcode";
import { demoEnabled, demoToolsEnabled } from "../shared/services/demoConfig";
import { demoDelay } from "../shared/services/demoDelay";

// UI contract only. No delivery method or Firebase contract has been approved.
export type TwoFactorMethod = "authenticator" | "email";
export interface TwoFactorChallenge {
  method: TwoFactorMethod;
  id: string;
}
export interface AuthenticatorSetup extends TwoFactorChallenge {
  secret: string;
  qrDataUrl: string;
}
export interface TwoFactorService {
  prepareAuthenticator(
    email: string,
    signal: AbortSignal,
  ): Promise<AuthenticatorSetup>;
  setup(
    method: TwoFactorMethod,
    signal: AbortSignal,
    simulateError?: boolean,
    prepared?: AuthenticatorSetup | null,
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
// Transient demo state only: never persist secrets in browser storage.
const activeChallenges = new Map<string, TOTP | null>();
let nextChallenge = 0;
function requireDemo() {
  if (!demoEnabled)
    throw new Error(
      "AWAITING BACKEND — two-factor authentication is not connected.",
    );
}
export const twoFactorService: TwoFactorService = {
  async prepareAuthenticator(email, signal) {
    requireDemo();
    const totp = new TOTP({
      issuer: "TALA Hub Demo",
      label: email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: new Secret({ size: 20 }),
    });
    const qrDataUrl = await QRCode.toDataURL(totp.toString(), {
      errorCorrectionLevel: "M",
      margin: 4,
      width: 240,
    });
    signal.throwIfAborted();
    const id = `demo-challenge-${++nextChallenge}`;
    activeChallenges.set(id, totp);
    return {
      id,
      method: "authenticator",
      secret: totp.secret.base32,
      qrDataUrl,
    };
  },
  async setup(method, signal, simulateError, prepared) {
    requireDemo();
    await demoDelay(650, signal);
    if (demoToolsEnabled && simulateError)
      throw new Error("Could not start the demo setup. Try again.");
    if (method === "authenticator") {
      if (!prepared || !activeChallenges.get(prepared.id))
        throw new Error("Prepare an authenticator key first.");
      return { id: prepared.id, method };
    }
    const challenge = { method, id: `demo-challenge-${++nextChallenge}` };
    activeChallenges.set(challenge.id, null);
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
    const totp = activeChallenges.get(challenge.id);
    const valid = totp
      ? totp.validate({ token: code, window: 1 }) !== null
      : code === demoVerificationCode;
    if (!valid)
      throw new Error(
        "That code does not match or has expired. Try the current code and check your device clock.",
      );
    activeChallenges.delete(challenge.id);
  },
  cancel(challenge) {
    activeChallenges.delete(challenge.id);
  },
};
