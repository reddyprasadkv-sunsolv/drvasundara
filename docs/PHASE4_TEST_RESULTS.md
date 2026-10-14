# Phase 4 test results

Audit date: 14 October 2026. Local baseline HEAD 1553a0a; compared with Phase 3 84cda29. All results below are executed checks, not proposed tests. Browser reports and Lighthouse JSON are local ignored QA artifacts.

## Build and contract validation

- Astro check / strict TypeScript: 78 files, zero errors, warnings or hints in recorded run.
- Production-root and GitHub Pages builds: 58 HTML files / 57 visitor pages, 27 canonical services, 12 articles, seven categories, original two source aliases excluded from public routes. Neither build enables indexing.
- Node tests: 19 passed (15 existing + four search-safety cases). Existing article/service clinical preservation, approval gates, sources, reviewed FAQs, draft exclusion and genuine dates pass.
- Existing generated-page verification: 2,041 internal href links pass in both modes; unique titles/descriptions, one H1, IDs/anchors, images, JSON-LD syntax, 404 artifact, sitemap, robots, no preview CNAME.
- New search contracts: 58 distinct exact production-intent canonicals; 1,771 root / 2,119 preview local href/src references checked, plus srcset/CSS images/fonts, social PNGs, sitemap routes, new-tab rel safety, reviewer/publisher identity/date agreement, 27 service schemas / 12 article schemas, five educational records, clean WhatsApp URL, unavailable form fallback and absent analytics.
- Full generated graph: zero orphan visitor pages. Heading crawl found Testimonials H1→H3 and fixed it with a hidden H2. No clinical paragraphs changed.
- Dependency registry audit: 397 total packages; zero info/low/moderate/high/critical advisories reported. This is a timestamped registry result, not a complete security certification.
- Review metadata: 12 actual 2026-10-13 medical reviews; no missing reference/reviewer/approval records among published entries; 12 next-review deadlines remain unscheduled. Technical audit date is not a new medical-review date.

## Browser checks

114 responsive/axe checks: all 57 visitor pages at 375 and 1440 CSS pixels; no horizontal overflow and no detected WCAG A/AA violations. Desktop checks do not substitute for a manual screen-reader review.

Verified Home educational5/patient3 and Testimonials patient5 through source and generated contracts. No YouTube iframe on initial page load; clicking a video loads the privacy-enhanced player. WhatsApp destination remains +919346825723, accessible new-tab label and minimum tap target retained; safe-area bottom offset added. Mobile menu keyboard open/Escape works. Journal search/query/category/clear/empty state, keyboard focus, copy current URL, print controls and no-JavaScript fallback passed using the existing focused browser harness. Appointment route is usable WhatsApp guidance; an unconfigured Google Form is not displayed or pretended submitted.

## Before / after Lighthouse

Lighthouse 13.5.0, local static project-path server, Chrome headless, single mobile and desktop lab runs for Home, Journal and ectopic-pregnancy article. Desktop uses 1350×940 emulation and 1× CPU, mobile Lighthouse defaults. Same machine/tools/configuration before and after; variability is expected. Latest semantic Testimonials H2 and service metadata change do not affect the three measured URLs. No claim that unchanged performance scores prove ranking improvement.

| Device  | Page    | Performance | Accessibility | Best Practices | LCP seconds   | CLS             | TBT ms |
| ------- | ------- | ----------- | ------------- | -------------- | ------------- | --------------- | ------ |
| mobile  | home    | 97 → 97     | 100 → 100     | 100 → 100      | 2.331 → 2.331 | 0.0395 → 0.0395 | 0 → 0  |
| mobile  | journal | 97 → 97     | 100 → 100     | 100 → 100      | 2.252 → 2.253 | 0.0011 → 0.0011 | 0 → 0  |
| mobile  | article | 99 → 99     | 100 → 100     | 100 → 100      | 1.802 → 1.952 | 0.0009 → 0.0009 | 0 → 0  |
| desktop | home    | 100 → 100   | 100 → 100     | 100 → 100      | 0.504 → 0.503 | 0.0000 → 0.0024 | 0 → 0  |
| desktop | journal | 100 → 100   | 100 → 100     | 96 → 100       | 0.532 → 0.563 | 0.0009 → 0.0019 | 0 → 0  |
| desktop | article | 100 → 100   | 100 → 100     | 100 → 100      | 0.442 → 0.442 | 0.0007 → 0.0016 | 0 → 0  |

SEO is 69 before/after on all six runs; sole failed audit is intentional crawl/index blocking. Do not remove preview noindex to improve that score. Desktop Journal baseline Best Practices 96 resulted from a one-off local WOFF2 connection reset; final run100, not attributed to a fabricated font optimization. All mobile Performance targets95+, Accessibility95+, Best Practices95+, LCP≤2.5s and CLS≤0.1 are met in these runs. All TBT values are0ms. INP≤200ms cannot be assessed without real-user field data.

Phase 3 reported Journal97/article98 mobile; latest before and after remain97/99. Homepage Phase 2 baseline97 remains97. Comparing different historical runs is contextual, not a controlled causal result.

No real-device Safari, manual screen-reader session, public Google Rich Results certificate, field Core Web Vitals, production URL Inspection, indexing/ranking/citation result or complete indexed/backlink inventory is claimed. Medical-reference full-text access restrictions and clinic approvals remain documented. Production WordPress/DNS/Cloudflare/GoDaddy are untouched. Final GitHub Actions and live deployment verification are reported at handoff after the committed preview deploy finishes.
