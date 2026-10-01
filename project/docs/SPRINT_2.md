# Sprint 2: signup verification and payment

Scope: SCRUM-46, SCRUM-47, SCRUM-48 and SCRUM-49. This is a frontend demo built on the existing React/Vite application, not Next.js. No Firebase, OAuth or payment SDK is connected. Local authenticator enrollment uses OTPAuth and QRCode; QR decoding is tested with jsQR.

## What to review

| Task | Frontend behavior | Main files under `frontend/src/` |
| --- | --- | --- |
| SCRUM-46 | Completed parent-first registration opens 2FA setup. No signup session is created yet. | `registration/useRegistration.ts`, `authentication/TwoFactorPage.tsx` |
| SCRUM-47 | Six-digit code entry, empty/invalid input, loading, service failure, retry, back and success. Only successful verification opens the parent demo session. | `authentication/TwoFactorPage.tsx`, `authentication/twoFactorService.ts`, `App.tsx` |
| SCRUM-48 | Payment page with funding choice, acknowledgement, validation, loading, retry and a clearly labeled demo result. No card, bank or address fields. | `payment/PaymentPage.tsx`, `payment/PaymentForm.tsx` |
| SCRUM-49 | Dashboard links to enrollment status. Pending and not-approved states cannot open the payment form. An approved sample can continue. Payment checks approval again when submitted. | `payment/ApprovalPage.tsx`, `payment/useApproval.ts`, `payment/paymentService.ts`, `App.tsx` |

## Walkthrough

1. Open Registration and finish the existing six steps with invented family details. Funding at this stage is only a preference.
2. On **Set up two-factor authentication**, scan the QR code with Google Authenticator or Microsoft Authenticator (or enter the manual key as a time-based account). Select **Continue to verification**.
3. Enter the current six-digit code from your app. Empty, incorrect and expired codes show errors. Email remains a separate mock option using **246810**; no message is sent.
4. Select **Continue to parent workspace**. The original student login and parent/student role choices remain available.
5. Open **Enrollment status & payment**. The default is **Pending review**.
6. Select **Approved (demo)** in **Demo application status**, then **Continue to payment**. This selects a fixture; it does not approve an application.
7. Choose ESA, STO or Private funding, acknowledge the demo, then complete it. The result explicitly states that no money was paid.

Routes: `/#/two-factor`, `/#/enrollment-status`, `/#/payment`. Start 2FA through registration; opening it without a pending signup offers a restart. Anonymous payment access goes to login, then enrollment status.

## State and integration boundaries

- `TwoFactorService` generates a random 20-byte secret and a standard otpauth QR locally. OTPAuth checks six-digit SHA-1 TOTP codes with a 30-second period and a one-step clock tolerance. Back preserves the setup; changing methods, cancellation, successful verification or page exit invalidates it. Secrets never enter browser storage or an endpoint. This demonstrates real TOTP compatibility, not server-enforced MFA. Email alone still uses a public sample code.
- Unfinished signup and challenge state stay in memory. Refresh clears them; leaving the 2FA page cancels any in-flight verification and restarts setup on return. No password or verification code goes into browser storage.
- Existing demo login remains a walkthrough entry, not identity verification. The signup-specific route guard prevents normal navigation around an unfinished verification, but it is not a security boundary.
- `PaymentService` defines approval lookup and demo submission. `selectApprovalDemo` is an explicit fixture selector, separate from the future backend interface.
- Approval starts pending. Approval fixtures and demo results reset on refresh, sign-out or another demo login. They are not stored in browser storage or sent to a server. Repeated submissions within the same demo identity return the existing in-memory result.
- Payment routes require a demo session and an approved fixture. Production authorization, approval and payment status must be checked by the backend. URL parameters do not grant approval.
- Turning off `VITE_DEMO_MODE` fails closed. Optional simulated service failures appear only when `VITE_DEMO_TOOLS=true`; ordinary previews keep those QA controls hidden.

## Still needed from the team

- **Karl/backend:** approved identity provider and SDK/API contract; 2FA enrollment and challenge verification; expiration, attempt limits, resend/recovery and session rules. Verification must be enforced server-side.
- **Karl/backend:** approval lookup and authorized payer rules; payment provider, server-owned amount/currency, safe checkout, idempotency, cancellation and verified payment confirmation. No illustrative endpoint is used as a real contract.
- **Tina/Sponsor:** confirm who sets up 2FA and when students complete it; approval criteria and role permissions; fees, funding eligibility and payment wording. This demo follows the existing parent-first signup and does not invent fees.

## Verification

Run commands from `frontend/`: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`.

The existing regression suite remains in `tests/frontend.spec.ts`; its registration journeys now include 2FA. `tests/sprint2.spec.ts` covers new validation and service errors, cancellation/refresh, route guards, approval states, funding choices, keyboard use, browser storage and accessibility. Playwright runs at 320, 390, 768 and 1440 pixels, including WebKit/iPad.

Original Sprint 2 results (2026-09-30): Format, Lint, Typecheck and Build **PASS**. Playwright **92/92 PASS**, zero failures, skips or retries: 60 existing regression cases, updated for signup verification, plus 32 new Sprint 2 cases.

The first run exposed a WebKit keyboard-test assumption: plain Tab did not traverse to the payment button. The test now uses the same Option+Tab traversal as the existing WebKit keyboard suite, while retaining focus and Enter-submit assertions. Registration submission also gained cancellation so leaving the page cannot trigger a late redirect. Both are covered by the final run.

Visual review also found that WebKit shrank native payment-module select controls to 27px. The module now uses explicitly styled 48px selects, and the browser tests check a minimum 44px touch target.

## Files changed

All paths below are relative to the repository root.

- `frontend/src/App.tsx`: signup state, demo sessions and protected routes.
- `frontend/src/authentication/`: new `TwoFactorPage.tsx` and `twoFactorService.ts`; updated `LoginPage.tsx` and `authentication.css`.
- `frontend/src/registration/`: updated `RegisterPage.tsx`, `useRegistration.ts`, `enrollmentService.ts` and `RegistrationComplete.tsx`.
- `frontend/src/payment/`: new `ApprovalPage.tsx`, `PaymentPage.tsx`, `PaymentForm.tsx`, `paymentService.ts`, `useApproval.ts` and `payment.css`.
- `frontend/src/dashboard/`: updated `StudentDashboard.tsx` and `CommunityWorkspace.tsx` with an enrollment-status link.
- `frontend/src/shared/`: updated `RouteFocus.tsx` and `styles/global.css` for new routes and styles.
- `frontend/tests/`: updated `frontend.spec.ts`; added `signupHelpers.ts` and `sprint2.spec.ts`.
- `project/docs/`: added this guide; updated `PROJECT_STRUCTURE.md`, `INTEGRATION.md`, `BACKEND_INTEGRATION_NEEDED.md`, `SPONSOR_REQUIREMENTS.md`, `DEPLOYMENT.md` and `QUALITY_REVIEW.md`.

Personal progress notes stay local and ignored. Skills, CNAME and hosting settings remain unchanged.

Final demo review: the normal build (QA controls off) passed the complete signup → 2FA → approval → payment → dashboard walkthrough at 320, 390, 768 and 1440 px, with no console errors, external requests or horizontal overflow. Generated reports and screenshots remain outside Git.

## Authenticator follow-up (2026-10-01)

Authenticator setup now provides a locally generated, scannable QR and manual key, with account details. OTPAuth performs TOTP verification; QRCode renders the QR locally. Email remains a mock. No backend or other application page was changed.

Format, Lint, Typecheck and Build passed. Full Playwright: **100/100 passed**, including QR decoding and secret matching, expired/invalid/empty codes, retry, cancellation and all existing journeys across four sizes (WebKit on iPad). The normal local demo also passed signup → authenticator → verified at all four widths, without QA controls, browser errors or overflow. Physical phone apps were not operated by the automated tests.

Enrollment secrets are masked in setup screenshots; authentication traces are disabled. Test artifacts are ignored and removed after review. No secret is hardcoded, logged or stored in browser storage.

## Payment UI follow-up (2026-10-01)

The approval and payment pages now show a clear Application → Approval → Funding progress path. Pending and not-approved fixtures keep payment locked; an approved fixture exposes the payment action and the payment service checks approval again before completing. URL parameters still cannot grant approval.

The payment page now includes an approved-status banner, demo account and fee summary, responsive funding guidance for ESA, STO and Private funding, inline validation, retryable failure state and a complete demo confirmation. It does not collect card, bank or billing data. Approval, amounts, eligibility and payment processing remain explicit backend or Sponsor integration points; no endpoint or payment API was invented.

Final verification after the payment follow-up: Format, Lint, Typecheck and Build **PASS**. The focused Sprint 2 suite passed **32/32**, followed by the complete Playwright suite at **100/100** with zero failures across 320px, 390px, 768px WebKit/iPad and 1440px.
