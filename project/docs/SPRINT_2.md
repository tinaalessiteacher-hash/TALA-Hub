# Sprint 2: signup verification and payment

Scope: SCRUM-46, SCRUM-47, SCRUM-48 and SCRUM-49. This is a frontend demo built on the existing React/Vite application, not Next.js. No Firebase, OAuth, payment SDK or new dependency was added.

## What to review

| Task | Frontend behavior | Main files under `frontend/src/` |
| --- | --- | --- |
| SCRUM-46 | Completed parent-first registration opens 2FA setup. No signup session is created yet. | `registration/useRegistration.ts`, `authentication/TwoFactorPage.tsx` |
| SCRUM-47 | Six-digit code entry, empty/invalid input, loading, service failure, retry, back and success. Only successful verification opens the parent demo session. | `authentication/TwoFactorPage.tsx`, `authentication/twoFactorService.ts`, `App.tsx` |
| SCRUM-48 | Payment page with funding choice, acknowledgement, validation, loading, retry and a clearly labeled demo result. No card, bank or address fields. | `payment/PaymentPage.tsx`, `payment/PaymentForm.tsx` |
| SCRUM-49 | Dashboard links to enrollment status. Pending and not-approved states cannot open the payment form. An approved sample can continue. Payment checks approval again when submitted. | `payment/ApprovalPage.tsx`, `payment/useApproval.ts`, `payment/paymentService.ts`, `App.tsx` |

## Walkthrough

1. Open Registration and finish the existing six steps with invented family details. Funding at this stage is only a preference.
2. On **Set up two-factor authentication**, select **Continue to verification**.
3. Try an empty value or `000000` to see errors. Use the clearly displayed demo code **246810** to succeed. No code is sent by email or SMS.
4. Select **Continue to parent workspace**. The original student login and parent/student role choices remain available.
5. Open **Enrollment status & payment**. The default is **Pending review**.
6. Select **Approved (demo)** in **Demo application status**, then **Continue to payment**. This selects a fixture; it does not approve an application.
7. Choose ESA, STO or Private funding, acknowledge the demo, then complete it. The result explicitly states that no money was paid.

Routes: `/#/two-factor`, `/#/enrollment-status`, `/#/payment`. Start 2FA through registration; opening it without a pending signup offers a restart. Anonymous payment access goes to login, then enrollment status.

## State and integration boundaries

- `TwoFactorService` defines setup, verify and cancel operations. Its current implementation uses an in-memory challenge and a public sample code. It never calls an endpoint or enrolls a real second factor.
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

Final results (2026-09-30): Format, Lint, Typecheck and Build **PASS**. Playwright **92/92 PASS**, zero failures, skips or retries: 60 existing regression cases, updated for signup verification, plus 32 new Sprint 2 cases.

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

Personal progress notes stay local and ignored. No dependencies, package versions, Skills, CNAME or hosting settings changed.

Final demo review: the normal build (QA controls off) passed the complete signup → 2FA → approval → payment → dashboard walkthrough at 320, 390, 768 and 1440 px, with no console errors, external requests or horizontal overflow. Generated reports and screenshots remain outside Git.
