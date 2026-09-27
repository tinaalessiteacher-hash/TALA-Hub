# Deployment process

This guide covers building TALA Hub and publishing a frontend demo for review. It does not describe a live school service: login, enrollment, funding and SkipCourse data are still simulated.

The build settings below match the repository. Remote hosting settings and a remote deployment have not been verified. The team must confirm the hosting project and release owner before publishing.

## 1. Prepare the release

- Use `staging` for the team preview. Record the commit being reviewed.
- Obtain access to the approved hosting project from its owner.
- Use a Node.js version supported by `frontend/package.json` (`^22.13.0 || >=24`). Use the same version locally and on the host.
- Keep production separate. Publishing from `main` requires team approval; this guide does not authorize a merge or production release.

From the repository root:

```sh
git branch --show-current
git rev-parse HEAD
cd frontend
npm ci
```

## 2. Run the checks

```sh
npm run lint
npm run typecheck
npx playwright install chromium webkit
npm test
```

Playwright checks the frontend at 320, 390, 768 and 1440 pixels. It uses port 4173; stop any local server on that port before running it. Do not publish if a check fails.

Tests build the site with QA controls enabled. **Build again with those controls off before publishing:**

```sh
VITE_DEMO_MODE=true VITE_DEMO_TOOLS=false npm run build
npm run preview -- --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/` and check the demo. This preview server is for local verification, not production hosting.

## 3. Configure the preview build

Use these values in the approved static hosting project:

| Setting | Value |
| --- | --- |
| Source branch | `staging` |
| Application root | `frontend` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist`, relative to `frontend` |
| `VITE_DEMO_MODE` | `true` |
| `VITE_DEMO_TOOLS` | `false` |

Set both environment variables for the preview build, then rebuild. They are public build settings, not secrets. Never put credentials in `VITE_*` variables. Setting demo mode to false does not connect a real backend; account and data services become unavailable.

If publishing static files manually, publish the contents of `frontend/dist/`. Do not upload source files, dependencies, environment files or Playwright reports.

## 4. Publish and verify

1. Confirm that the hosting project targets the preview environment and the intended `staging` commit.
2. Start the preview build using the host's deployment mechanism. The exact platform steps must be confirmed by the hosting owner.
3. Check the build log for success. Record the commit, preview URL and deployment identifier.
4. Open the remote preview URL and complete: Home → Registration → Parent Account → Student Information → Enrollment → Documents → Funding → Review → Login → Dashboard → Add Class → Calendar.
5. Check parent/student switching, mobile navigation and keyboard navigation. Refresh a direct route such as `/#/register`.
6. Confirm there are no broken assets, browser console errors, horizontal overflow or QA controls. Demo labels must remain visible.

Local tests do not replace this check on the deployed URL. Attach the build result, URL and check results to the release record.

## 5. If a deployment fails

Do not promote a failed preview to production. Save the failing build log and commit identifier. Have the hosting owner restore the previous successful deployment using the host's supported rollback process, then check its URL again. If the host has no rollback option, rebuild the previously approved commit as a separate deployment. Do not rewrite Git history or force-push to recover a release.

## Production handoff — still to confirm

Before this guide can be used for a production release, the team must record:

- The hosting provider, project, release owner and access requirements.
- How preview and production are separated and what triggers each deployment.
- The platform-specific publish and rollback steps, including the last known good deployment.
- Approval to release from `main`, and the production URL and post-release checks.
- Backend readiness and approved school content; see [the backend checklist](BACKEND_INTEGRATION_NEEDED.md).

Do not change CNAME, DNS or production settings as part of preview setup. No remote deployment was performed when writing this guide.
