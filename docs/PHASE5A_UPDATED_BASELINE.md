# Phase 5A updated baseline — 15 October 2026

Latest origin/main fetched and inspected: `3d375a35e6a58301ca5c94a83705a3d5d8ef5cbd`; local main matches. All six commits after Phase 4 `eb766570ba6ac28c54d9f9bf4c9138002546d003` are present:

- `6c32ea6` Replace shared doctor portrait with supplied hospital photograph
- `80c0589` Add Urogynecology and Fertility to homepage specialty line
- `1b296d8` Enlarge homepage specialties and add Urogynecology enquiry card and review draft
- `63ed65a` Publish clinician-reviewed Urogynecology consultation guide
- `38bef6d` Rename WhatsApp contact buttons to Talk to Us
- `3d375a3` Include Urogynecology in About page clinical interests

## Measured build baseline

Both production-root and GitHub Pages project-preview builds passed the existing complete test command: 19 unit tests, build verification, approval boundaries, journal verification, editorial validation and search-readiness verification. Astro check passed with zero errors, warnings or hints. Each build contains 59 HTML documents: 58 public pages and the 404 error document; 28 canonical approved service detail pages, 12 articles and seven category pages. Build verification checked 2,072 internal links in each mode. Both crawls found zero orphan visitor pages. These are local build checks, not live-host or browser interaction tests.

The new `/services/urogynecology-consultation/` exists in both crawls, carries MedicalWebPage schema, has inbound internal links, and appears in the preview sitemap. Both modes passed sitemap URL/file consistency and source-backed schema review-date checks. The complete production destination inventory is PHASE5A_BASELINE_URL_INVENTORY.md. Preserve this new destination in migration planning; a legacy source URL or redirect must be established from real exports, not invented. No redirects activated.

Doctor photograph, homepage layout, clinical interests, approval records and clinical content were not edited. Urogynecology retains its 14 October 2026 user-relayed review and the precise publication scope in UROGYNECOLOGY_PUBLICATION_APPROVAL.md; prior approval dates remain unchanged. Approval of procedures or additional claims is not inferred.

WhatsApp URL checks and appointment-page assertions pass in both builds. The configured Google Form URL remains blank; WhatsApp continues as the available enquiry flow. No form submission capability is inferred. All generated pages retain noindex/nofollow, productionIndexing remains false, and analytics remain disabled.

## Continuation boundary

The user confirmed reuse of `codex/phase5a-production-readiness`. Latest main was merged into that branch without conflicts, preserving all six commits. Phase 5A reports, artifact guards and readiness workflow input coverage were updated there; see PHASE5A_HANDOFF and PHASE5A_TEST_RESULTS for continuation results. Main remains unchanged. No clinical approval, visitor source, DNS, WordPress, custom-domain, indexing or deployment changes were made. Crawl evidence is in ignored qa/phase4/crawl-production.json and crawl-preview.json.

## Reproduction

Use the available Node runtime with ASTRO_TELEMETRY_DISABLED=1. Run `pnpm check`, `pnpm build`, `pnpm test`, `pnpm seo:audit` for root output. Then run `PAGES_PREVIEW=true pnpm build`, `node scripts/prepare-pages-preview.mjs`, `VERIFY_PAGES_PREVIEW=true pnpm test`, and `VERIFY_PAGES_PREVIEW=true pnpm seo:audit` for project-preview output.
