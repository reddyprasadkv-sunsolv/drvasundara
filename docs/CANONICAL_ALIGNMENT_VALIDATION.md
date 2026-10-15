# Canonical host alignment — 15 October 2026

Baseline: `552560e`. Preferred production origin: `https://www.drvasundaragynec.com`.

Before implementation, HTTPS apex returned 301 to www and www returned 200 without a redirect loop. No DNS or GitHub Pages custom-domain setting was changed. The source CNAME now describes the existing www domain; Actions publishing does not configure that setting from this file.

Canonical, Open Graph, sitemap, robots sitemap and structured-data URLs now derive from www. Relative navigation is unchanged. Historical clinical/source evidence URLs remain verbatim where they are not emitted as production URLs. No medical copy, approval date, component styling, image, video or contact functionality changed.

## Validation

- Astro check and production build passed.
- Existing automated suite: 23 unit tests and all generated-site validators passed in production and preview modes.
- 58 public pages plus 404; 28 services, including Urogynecology Consultation; 12 articles and seven categories.
- Both crawls verified 2,072 internal links; SEO audit found zero orphan visitor pages.
- Production: all 58 sitemap entries and 844 structured-data URL references use the preferred origin; all 59 HTML documents have consistent canonical/Open Graph metadata and noindex directives.
- Preview: GitHub project-path canonicals and sitemap retained; no custom domain or production sitemap advertisement; all pages noindex. Production entities remain identified by www URLs.
- Production artifact: 152 files, 59 HTML documents; checksum verification passed.
- Browser regression: 14 representative routes at 375, 768 and 1440 pixels, 42 checks total; no horizontal overflow or axe WCAG A/AA violations. Automated accessibility checks do not establish complete compliance; manual-review items remain.

Raw local evidence is under ignored `qa/canonical-alignment/`; reproducible host assertions are in `scripts/verify-host-consistency.mjs` and run in the standard test command.

## Publication boundary

`productionIndexing` remains false. Production robots disallows crawling and references the www sitemap; preview disallows crawling without that production sitemap reference. The 404 remains noindex. No sitemap submission or analytics activation is part of this release.

See [clinic decision sheet](CLINIC_PUBLICATION_APPROVAL_CHECKLIST.md). Privacy/data-handling facts, registration, exact practice address/hours, clinical source reviews and five patient-video permissions remain outstanding. Recommend withholding those videos pending permission evidence; this technical release does not alter them. Explicit clinic readiness and separate indexing authorization are still required.

Deployment-specific verification must confirm the host redirect, www metadata and blocked robots policy on the actual deployed site; local artifacts cannot configure or prove edge redirect behavior.
