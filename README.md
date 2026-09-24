# TALA-Hub

A React, TypeScript and Vite frontend for Tucson Adaptive Learning Academy.
**This is a functional demo: authentication, billing and SkipCourse are not connected.**

## Quick start

Use Node.js 22.13+ within 22.x, or 24+, and npm. Work on `staging`.

```sh
npm install
npm run dev
```

Open the URL printed in the terminal (normally http://127.0.0.1:5173/).
No API keys are required. Use `npm ci` for a lockfile-based installation.

## Repository layout

| Directory | Purpose |
| --- | --- |
| `src/` | Frontend pages, shared components, styles, assets and service boundaries |
| `tests/` | Automated browser tests |
| `docs/` | Technical and project documentation |
| `.agents/` | Development skills and reference instructions |

[AGENTS.md](AGENTS.md) contains project-wide development rules. Standard React/Vite/npm configurations remain at the root. See the [project structure guide](docs/PROJECT_STRUCTURE.md) for file locations.

## Build and test

```sh
npm run build       # Typecheck and build to dist/
npm run lint
npm run typecheck
npx playwright install chromium webkit  # First-time browser setup
npm test            # Builds and runs Playwright on local port 4173
```

Tests cover registration, community roles, dashboard, scheduling, keyboard access and 320 / 390 / 768 / 1440 px layouts. Generated files and test reports are ignored by Git.

Tests enable QA controls. Rebuild before presenting the ordinary demo:

```sh
VITE_DEMO_MODE=true VITE_DEMO_TOOLS=false npm run build
npm run preview
```

## Try the demo

Home → Registration → Parent → Student → Enrollment → Documents → Funding → Review → Student Login → Dashboard → Available class slots → Join class → Personal calendar.

For quick access, open Community Login, select a role and click **Explore with a sample profile**. Parents can enter as themselves or represent a sample student.

Use invented details only. Registration drafts reset when leaving or refreshing; demo sessions and class selections stay in the browser tab. No real accounts, payments, document uploads or class reservations are created. See [.env.example](.env.example) for public demo switches; never place secrets in `VITE_*` variables.

## Team documentation

- [Project structure](docs/PROJECT_STRUCTURE.md): code locations, local tooling and preview notes.
- [Backend integration needs](docs/BACKEND_INTEGRATION_NEEDED.md): required contracts and questions for the Backend Team.
- [Service boundaries](docs/INTEGRATION.md): adapters, mock data and integration ownership.
- [Sponsor requirements and QA](docs/SPONSOR_REQUIREMENTS.md): implemented flows, open decisions and validation.
- [MVP quality review](docs/QUALITY_REVIEW.md) and [Frontend Excellence review](docs/FRONTEND_EXCELLENCE.md): earlier engineering records.
- [Skills provenance](docs/skills/README.md): upstream sources and licenses.

## Preview hosting

Build with `npm run build`; serve `dist/` using the Vite preset. Share hash URLs such as `/#/register` and `/#/dashboard`, which do not need server route rewrites. Remote Vercel settings and deployment results still require verification; a Git push may trigger an automatic preview.

Real integrations remain **AWAITING BACKEND**. Required documents and role policies remain **AWAITING TINA**; official content, fees and funding rules remain **AWAITING SPONSOR**. Do not change production domains, DNS or `CNAME` as part of frontend development.
