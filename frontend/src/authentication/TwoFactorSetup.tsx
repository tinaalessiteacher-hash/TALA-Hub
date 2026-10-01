import type { AuthenticatorSetup, TwoFactorMethod } from "./twoFactorService";

export function TwoFactorSetup({
  prepared,
  preparationError,
  onRetry,
  method,
  onChange,
  name,
  email,
  disabled,
}: {
  prepared: AuthenticatorSetup | null;
  preparationError: string;
  onRetry: () => void;
  method: TwoFactorMethod;
  onChange: (method: TwoFactorMethod) => void;
  name: string;
  email: string;
  disabled: boolean;
}) {
  return (
    <div className="two-factor-setup">
      <dl className="two-factor-account">
        <div>
          <dt>Demo account</dt>
          <dd>{name}</dd>
        </div>
        <div>
          <dt>Account email</dt>
          <dd>{email}</dd>
        </div>
        <div>
          <dt>Account type</dt>
          <dd>Parent · TALA Hub demo</dd>
        </div>
      </dl>
      <fieldset className="two-factor-methods" disabled={disabled}>
        <legend>Choose a 2FA method</legend>
        <label>
          <input
            type="radio"
            name="two-factor-method"
            value="authenticator"
            checked={method === "authenticator"}
            onChange={() => onChange("authenticator")}
          />
          <span>
            <strong>Authenticator app</strong>
            <small>Use a real app-generated code in this local demo.</small>
          </span>
        </label>
        <label>
          <input
            type="radio"
            name="two-factor-method"
            value="email"
            checked={method === "email"}
            onChange={() => onChange("email")}
          />
          <span>
            <strong>Email code</strong>
            <small>Preview verification using an email code.</small>
          </span>
        </label>
      </fieldset>
      <section
        className="two-factor-instructions"
        aria-live="polite"
        aria-atomic="true"
      >
        {method === "authenticator" ? (
          <>
            <h2>Connect an authenticator app</h2>
            <p className="small">
              Scan with Google Authenticator or Microsoft Authenticator, or
              enter the key manually. Choose a time-based account. This key is
              only for this temporary demo.
            </p>
            {preparationError ? (
              <div role="alert">
                <p>{preparationError}</p>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={onRetry}
                >
                  Retry setup
                </button>
              </div>
            ) : !prepared ? (
              <p role="status">Preparing your authenticator key…</p>
            ) : (
              <div className="two-factor-provisioning">
                <img
                  className="two-factor-qr-image"
                  src={prepared.qrDataUrl}
                  width={240}
                  height={240}
                  alt="Scan this demo QR code with your authenticator app"
                />
                <div className="two-factor-manual">
                  <h3>Manual setup key</h3>
                  <code>{prepared.secret}</code>
                  <p className="small">
                    Account: {email}
                    <br />
                    Issuer: TALA Hub Demo
                    <br />
                    Time-based · 6 digits · 30 seconds
                  </p>
                  <p className="small">
                    Keep this key private. Refreshing or cancelling clears
                    setup. Remove the temporary TALA Hub Demo entry from your
                    app when finished.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>Verify with an email code</h2>
            <p className="small">
              The account email above is shown for context only. No message will
              be sent. Continue to use the sample code on the next screen.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
