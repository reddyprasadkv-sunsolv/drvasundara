# Phase 3 validation report

Test date: 14 October 2026. Final measurements and deployment evidence are appended after execution.

Automated coverage includes preservation of clinical narrative/state/date baseline; draft/unapproved/unverified exclusion; genuine review/approval chronology; published-only static search and safe field whitelist; query/category matching and empty results; taxonomy/curated relationship validity; FAQ approval and administrative separation; local dashboard warnings; actual generated titles/descriptions/H1/IDs/anchors/images/canonicals/internal links/JSON-LD/sitemap/noindex; base-prefixed Pages output and absence of preview CNAME/private QA/evidence records.

Astro check includes strict TypeScript. Both production and preview builds are required. Browser checks cover mobile/tablet/desktop, category navigation, search input/filter/reset/empty, keyboard controls, link copy, native contents, reduced motion, no-JS reading/navigation, image loading and print/table behavior. Local fixture content is nonclinical QA only, removed before final build and never published.

Lighthouse results are lab measurements; no field INP is measured. The intentionally noindexed preview constrains SEO scores. Source-access limitations and incomplete clinic evidence are recorded separately in the content audit and handoff.

## Results

- Astro/strict TypeScript: zero errors, warnings or hints across 71 files after completion.
- Production/Pages builds: 58 public HTML pages and a 12-entry JSON search index; 27 service and 12 article routes preserved.
- Fifteen tests pass, including original narrative/FAQ/introduction/state/date protection, metadata/calendar validation, search exclusion, actual review and source/link rules.
- Generated HTML: 2,162 internal links, unique metadata/H1/IDs, valid internal anchors/images, JSON-LD syntax, production canonicals, sitemap exclusion and preview noindex/base handling pass.
- All 57 non-404 pages checked at 375px and 1440px: 114 responsive/axe WCAG A/AA checks passed. Twenty additional checks at 320/430/768/1024/1920px cover journal, category, article and reviewer.
- Search query/category/reset/empty results, keyboard focus/contents, clipboard link copying, reduced motion and JavaScript-disabled static reading/navigation passed. The no-JS test asserts the actual input’s disabled state; Playwright does not treat a fieldset itself as a disabled input.
- Local long-form/table fixture: 320/768/1440px, three additional axe checks, scrollable keyboard table, print width and FAQ open/restore behavior passed. A4 print output was visually inspected. Fixture was nonclinical, removed and never committed.
- A real generated draft was built alongside the twelve approved articles: no author/reviewer/dates/references invented; draft remained absent from search, routes/listings and sitemap; local report showed 1 draft/12 published. Removed before final build.
- Mobile Lighthouse journal: Performance 97, Accessibility 100, Best Practices 100, SEO 69; LCP 2.256s, CLS 0.0011, TBT 0ms. Article (ectopic): Performance 98, Accessibility 100, Best Practices 100, SEO 69; LCP 1.953s, CLS 0.0078, TBT 0ms. Each is a local laboratory run. No field INP measured. Intentional noindex is the sole failed SEO audit.
- No new runtime dependency or heavy framework; private status files/approval URLs absent from deployed visitor output. Manual screen-reader sessions, real-device Safari and external Google rich-result certification were not performed; automated semantics/JSON-LD checks do not substitute for them.

## Resolved issues found during QA

The draft command originally omitted the required excerpt field; it now creates a schema-valid incomplete draft. Publication-only related-link requirements no longer block incomplete drafts. Calendar dates reject null/numeric coercion and impossible dates instead of turning them into 1970 or normalized dates. Browser harness selectors were corrected to target the actual searchbox/input rather than a landmark or fieldset. Clinical content was not changed to resolve these issues.
