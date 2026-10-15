# Steps 1–3: controlled indexing release preparation — 16 October 2026

Latest baseline: `d0bad71`, fetched from GitHub main. It sets the site flag true but retains a false deployment-request flag. The live site was separately verified as blocked/noindex. No essential privacy or scoped clinical indexing-readiness evidence has been supplied. This PR is **not for merge or deployment until those decisions are resolved**.

## Proposed release contract

The feature branch keeps `productionIndexing: false`, matches the request's disabled value and explicitly records `indexingApproved: false` with no invented authorization reference. It proposes withholding the five patient videos again under the newest instruction. The live site is left unchanged. Shared metadata/robots/sitemap policy supports an approved future enabled release without an environment-variable switch.

For an authorized activation, deliberately change the site and request booleans together, set explicit indexing approval and a genuine non-sensitive reference, record actual privacy/clinical approval sign-offs/dates and bind them to the current source inventory digest. `node scripts/verify-indexing-release.mjs` prints that digest even when it exits unsuccessfully for missing approvals. A digest is not approval evidence. All source changes invalidate that approval binding.

The standard test command and pre-build deployment guard reject mismatches or missing approval records. Production release still requires a reviewed deployment request or APPROVED main-only dispatch, then reusable validation before artifact build and deploy. Changes to validation or guard code cannot themselves authorize indexing. No DNS, custom-domain, HTTPS or redirect changes are made.

## Generated output and testing

All 58 public routes are preserved. The proposed sitemap contains 53 eligible URLs: 404, the noindex patient-experiences notice and four existing single-article noindex categories are excluded. The 28 service pages, 12 articles, seven category pages and five educational videos retain their content, URLs and approval dates. Preview always disallows crawling and stays noindex, independently of the production flag.

Normal production and preview Actions checks cover Astro/TypeScript, SEO, schema, links, images/fonts, publication gates and 84 responsive/axe cases. Additional disabled/enabled integration jobs create disposable copies, build actual root and preview artifacts under each state, run the full generated-site tests and 168 additional responsive/axe cases, and verify root release checksums. Synthetic approvals exist only in temporary test copies and are explicitly marked as synthetic; they do not modify or approve the real repository. Only browser evidence is uploaded, never those indexable fixture site artifacts. Temporary repositories are deleted after testing.

## Deployment and search handoff

No merge, production deployment, sitemap submission or Search Console/Bing action is performed while blockers remain. Search Console ownership is owner-confirmed, not re-verified by this task. Current live sitemap is https://www.drvasundaragynec.com/sitemap-index.xml ; its existing 58 entries differ from the proposed 53-entry eligible inventory. Only after a real approved release and direct live robots/meta/sitemap/HTTPS/redirect checks should search submission proceed. Passing CI does not establish clinic readiness or Google indexing.
