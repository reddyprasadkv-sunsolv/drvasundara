# GitHub development, validation and production deployment

GitHub `main` is the integration source of truth. Start a feature branch from latest main and open a pull request. Review the change and require both production and preview validation jobs to pass before merging. No Mac deployment, FTP, SSH, GoDaddy upload or additional hosting account is needed.

`Validate static website` runs Astro/strict TypeScript, generated metadata/schema/link/publication checks, SEO inventory and responsive Chromium/axe checks on 14 representative routes at 375/768/1440 pixels in both root and project-preview modes (84 browser cases). Reports retain violations and items needing manual review for 14 days. Automated axe checks do not establish full accessibility compliance. No patient data or credentials are used in tests.

For an approved production change, update `.github/pages-deployment-request.json` in the same reviewed PR. Merging that request into main triggers `Deploy approved production website`. Its reusable validation job must pass in both modes before a fresh root artifact is built, tested, audited, hashed and uploaded. The deploy job depends on that build and publishes the artifact via GitHub Pages. Manual dispatch, when needed, is performed in GitHub Actions on main with `APPROVED`; it uses the same validation gates. Ordinary source pushes without a deployment request do not deploy.

`Prepare production artifact — no deployment` remains a separate read-only readiness-bundle workflow. It cannot deploy or modify Pages settings. No workflow changes DNS, custom-domain settings or redirects. The existing github-pages environment and domain/HTTPS remain in use. This change does not configure repository branch protection; PR review discipline still applies unless GitHub required checks are separately configured.

Live verification after deployment: check the production privacy/contact/appointment routes, www canonical metadata, non-www 301 redirect, robots and sitemap. The public deployment URL is https://www.drvasundaragynec.com/ . A successful deployment alone does not establish indexability or clinic approval.

## Publication safeguards

Production indexing remains disabled; preview is noindex and disallows crawling. Five patient-experience videos remain withheld, retaining their source records. The 28 services, 12 articles and five educational videos retain existing content and clinical approval dates. Only the verified WhatsApp number in `src/config/site.ts` supplies public contact links and their display labels. Contact, privacy and footer use the shared link component; appointment CTAs use the same URL. No email, telephone-call or Google Forms UI is enabled.

Unconfirmed privacy practices stay in the [clinic privacy draft](CLINIC_PRIVACY_POLICY_DRAFT.md) and [approval decision sheet](CLINIC_PUBLICATION_APPROVAL_CHECKLIST.md). Removing pending language from a public page did not establish those facts. No indexing activation, analytics activation or sitemap submission is authorized by this workflow update.
