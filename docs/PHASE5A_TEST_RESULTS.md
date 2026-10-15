# Phase 5A test results

Updated 15 October 2026 on the existing `codex/phase5a-production-readiness` branch after merging latest fetched main `3d375a35e6a58301ca5c94a83705a3d5d8ef5cbd`. All six commits after Phase 4 are preserved. No visitor source, clinical approval, portrait, homepage or CTA changes relative to latest main.

## Current executed checks

| Check | Actual result | Limit |
| --- | --- | --- |
| Astro / TypeScript | Zero errors, warnings or hints | Local check |
| Production-root build and complete tests | 23 tests pass, plus generated-site verifiers | No deployment |
| GitHub Pages project-preview build and complete tests | 23 tests pass, plus generated-site verifiers | Local build, not live hosting certification |
| Generated routes | 59 HTML documents: 58 public pages plus 404 | 28 canonical services, 12 articles, seven categories |
| Internal links and anchors | 2,072 href links pass in each mode; zero orphan visitor pages | No external-source recertification |
| SEO / schemas / assets | 59 canonical checks; 1,796 root and 2,150 preview references plus srcset/CSS checks | No Google external rich-result certification |
| Complete production inventory | Exact comparison of all 58 public destinations against build | 404 tracked separately; legacy source inventory remains incomplete |
| Urogynecology | Present in both sitemaps; MedicalWebPage review date matches source; inbound link present | Existing 14 Oct approval scope retained |
| Root artifact | 151 hashed files, 59 HTML documents; manifest and SHA256SUMS verified | Integrity is not signing or cutover authorization |
| Artifact safeguards | Private path/symlink rejection and deterministic hashing pass; preview rejected as root artifact | Not a full secrets scanner |
| Workflow | Read-only permissions, no deployment actions; site/public/script changes now trigger readiness PR checks | Remote CI not run in this continuation |
| Clinical and editorial gates | Approval boundaries, source-backed dates, profile, aliases and journal checks pass | Twelve article next-review deadlines remain unassigned |
| WhatsApp / appointments | Existing clean wa.me number, URL safety and appointment disclosure assertions pass | No message sent; optional Google Form remains blank |
| Indexing / analytics | All HTML noindex/nofollow, robots disallow, productionIndexing=false, analytics absent | No engine submission |

Baseline checks before branch continuation passed the original 19 tests in both build modes. Current tests include three existing artifact preparation tests and one added complete-inventory/Urogynecology regression test. Crawl evidence remains in ignored `qa/phase4/crawl-production.json` and `crawl-preview.json`.

The earlier Phase 5A record reported responsive/axe checks on 14 representative routes at 375/768/1440, video player stub and journal search interaction checks, DNS queries and public WordPress observations. Those are historical evidence on the older baseline; they were not repeated or represented as current browser/live checks. No fresh Lighthouse, real-user vitals, Safari, screen-reader session, live domain/TLS, DNS, redirect activation, WordPress backup restoration or private zone review is claimed.

The final local bundle is built from the committed preparation branch, with sourceCommit recorded in its manifest and sourceDirty=false. It is ignored local output, not a Pages deployment. Main, DNS, WordPress, custom domain and indexing remain unchanged. No remote CI or live preview verification is claimed.
