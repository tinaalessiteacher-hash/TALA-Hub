# SkipCourse integration handoff

Status: **frontend demo; real backend integration AWAITING BACKEND**.

Latest scope and source differences: [SPONSOR_REQUIREMENTS.md](SPONSOR_REQUIREMENTS.md).

Backend request checklist (12 integrations, unknown contracts and questions): [BACKEND_INTEGRATION_NEEDED.md](BACKEND_INTEGRATION_NEEDED.md). This file explains existing code boundaries; the checklist records what the Backend Team must supply.

## Boundaries in this MVP

- `frontend/src/authentication/authService.ts` selects the auth adapter and manages the explicitly marked demo session; `demoAuthAdapter.ts` implements demo login.
- `frontend/src/dashboard/skipCourseApi.ts` is the student-data boundary. `demoStudentAdapter.ts` simulates responses, and `demoLearningData.ts` holds fictional learning records.
- `frontend/src/dashboard/learningTypes.ts` and `frontend/src/shared/services/serviceTypes.ts` contain frontend models and adapter contracts, not confirmed backend schemas.
- `frontend/src/registration/enrollmentService.ts` owns input checks and the registration submission interface. No real account, billing or provisioning occurs.
- `frontend/src/classes/scheduleService.ts` owns timetable loading and joining; `demoClassSlots.ts` contains fictional availability. The calendar and class list read the same selections.
- `frontend/src/shared/services/demoConfig.ts` owns demo flags; `demoDelay.ts` owns shared simulated latency; `demoData.ts` holds the shared sample identity.
- `frontend/src/public-site/programContent.ts` holds program previews. Other copy stays with its page. **Awaiting final content from Ayushi/Tina.**

Demo mode defaults on for this local MVP and is visibly labeled across the site. Set `VITE_DEMO_MODE=false` to fail closed: neither account service nor student-data service will use a real or guessed endpoint. This flag is not a backend integration mechanism.

## NEEDS_CONFIRMATION

| Owner | Needed before live integration |
| --- | --- |
| Tina | Final registration fields/documents and guardian policy, student identity rules, attendance meaning, messaging and Alumni/Staff permissions; core dashboard sections now follow the supplied layout |
| Karl / Sponsor | Actual staging API base URL, endpoint documentation, sample responses, error shapes, CORS/origin requirements, session/token approach, identity mapping and authorization rules |
| Karl / Sponsor | Registration/provisioning ownership: how TALA registration creates or links a SkipCourse student, duplicate handling, partial-failure recovery and safe retry behavior |
| Sponsor | Approved enrollment flow, privacy/consent requirements, applicable age/guardian policies, contact channel, brand identity, production deployment decision |
| Ayushi | Approved Home/About/Programs copy, program details, contact text and approved imagery |

Do not infer any of these from the demo. The 8-character password check is a demonstration constraint, not an approved account-security policy.

## When the contract arrives

1. Confirm the API in a staging environment, including unauthenticated/unauthorized responses and the mapping from the logged-in user to their own student record.
2. Implement a real auth adapter and a student adapter against that documented contract. Add runtime validation of the actual responses at this boundary, then map them to UI view models.
3. Let the agreed server-side registration/provisioning flow own account creation and partial failures. Never ship admin credentials or service account secrets in browser code.
4. Replace the demo session marker with the agreed secure session mechanism. The existing route guard is a UX convenience, not authorization; the backend must enforce access.
5. Keep loading, empty, error, cancellation and retry behavior. Test integration failures and cross-account access using approved staging fixtures.
6. After sponsor approval, remove demo fixtures/testing controls from the live experience, update docs and test the approved deployment separately.

No SkipCourse repository, GoDaddy, DNS, GitHub Pages setting, or production site was modified.

## Demo identity and privacy

Parent sessions retain their sample student name/email and visibly distinguish self from represented-student views. All roles are publicly selectable demonstration states, not RBAC. A direct sample-login path intentionally remains available for walkthroughs; production student access must be enforced by the backend after registration/billing checks.

Registration drafts live only in component memory and reset on refresh/navigation. Only sample family names/emails pass through route state after completion. Passwords are not saved. No file upload, medical records, card details or financial transactions are implemented. Missing API credentials are not needed for this preview.

The technical buildout document contains illustrative HubSpot/EZAMU payloads and endpoints. They are not treated as an approved API contract, and no such URLs were introduced into application code. Final server contracts must define identity verification, family association, enrollment atomicity/idempotency, billing outcomes, capacity/conflict rules and SkipCourse provisioning recovery before production integration.
