# GitHub development, validation and production deployment

GitHub `main` is the integration source of truth. Start a feature branch from latest main and open a pull request. Review the change and require both production and preview validation jobs to pass before merging. No Mac deployment, FTP, SSH, GoDaddy upload or additional hosting account is needed.

`Validate static website` runs Astro/strict TypeScript, generated metadata/schema/link/publication checks, SEO inventory and responsive Chromium/axe checks on 14 representative routes at 375/768/1440 pixels in both root and project-preview modes (84 browser cases). Reports retain violations and items needing manual review for 14 days. Automated axe checks do not establish full accessibility compliance. No patient data or credentials are used in tests.

For an approved production change, update `.github/pages-deployment-request.json` in the same reviewed PR. Merging that request into main triggers `Deploy approved production website`. Its reusable validation job must pass in both modes before a fresh root artifact is built, tested, audited, hashed and uploaded. The deploy job depends on that build and publishes the artifact via GitHub Pages. Manual dispatch, when needed, is performed in GitHub Actions on main with `APPROVED`; it uses the same validation gates. Ordinary source pushes without a deployment request do not deploy.

`Prepare production artifact — no deployment` remains a separate read-only readiness-bundle workflow. It cannot deploy or modify Pages settings. No workflow changes DNS, custom-domain settings or redirects. The existing github-pages environment and domain/HTTPS remain in use. This change does not configure repository branch protection; PR review discipline still applies unless GitHub required checks are separately configured.

Live verification after deployment: check the production privacy/contact/appointment routes, www canonical metadata, non-www 301 redirect, robots and sitemap. The public deployment URL is https://www.drvasundaragynec.com/ . A successful deployment alone does not establish indexability or clinic approval.

## Publication safeguards

The approved 16 October release enables production indexing for eligible pages; preview is always noindex and disallows crawling. Five patient-experience videos are withheld under the latest indexing-release instruction; source records remain preserved. The 28 services, 12 articles and five educational videos retain existing content and clinical approval dates. Only the verified WhatsApp number in `src/config/site.ts` supplies public contact links and their display labels. Contact, privacy and footer use the shared link component; appointment CTAs use the same URL. No email, telephone-call or Google Forms UI is enabled.

Clinic-confirmed privacy practices and the relayed approval scope are recorded in the [privacy disclosure record](CLINIC_PRIVACY_POLICY_DRAFT.md) and [approval decision sheet](CLINIC_PUBLICATION_APPROVAL_CHECKLIST.md). Earlier removal of pending public language did not establish those facts; the subsequent clinic confirmation resolves them. The original workflow update did not authorize indexing. The later clinic readiness record now authorizes the indexing release; it does not activate analytics or submit a sitemap automatically.

The 16 October controlled-indexing preparation is documented in `INDEXING_RELEASE_PREPARATION.md`. It adds isolated disabled/enabled output validation without production deployment or fabricated clinic approvals.

The 16 October clinic confirmation resolves the recorded privacy/clinical readiness prerequisites for this release. See `INDEXING_PUBLICATION_APPROVAL_2026-10-16.md`; older pending notes above are historical.
