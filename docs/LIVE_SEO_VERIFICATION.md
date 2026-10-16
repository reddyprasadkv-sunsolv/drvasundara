# Live production verification — 16 October 2026

## Independent observations

Baseline main: `32bb6af05db992b2e2be8ec699ac93d7df8e2067` (PR #15). Production website release remains `0935a19cbeffc3206b4b62a837ea47a43460afe3`, [approved Pages deployment](https://github.com/reddyprasadkv-sunsolv/drvasundara/actions/runs/38849836445).

PR #15's verifier had no runs when inspected. It was manually triggered through authorized GitHub UI access: [baseline run 38853388679](https://github.com/reddyprasadkv-sunsolv/drvasundara/actions/runs/38853388679), successful. Its logs show real HTTP responses; however, it checked only one service and one article. The expanded checker was independently run against all production URLs, yielding **68 PASS, zero FAIL, zero UNVERIFIED** checks. Results are technical observations, not a Google indexed-page total.

| Check                  | Result | Actual evidence                                                                                                                          |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| robots.txt             | PASS   | HTTPS 200, `text/plain; charset=utf-8`; `User-agent: *`, `Allow: /`, correct www sitemap reference                                       |
| Sitemap index          | PASS   | HTTPS 200, `application/xml`, valid sitemapindex, one child sitemap                                                                      |
| Child sitemap          | PASS   | HTTPS 200, valid urlset, 53 unique www URLs matching current approved production build                                                   |
| Every eligible URL     | PASS   | 53 live pages fetched; HTTP 200, no unexpected redirects, correct canonical/OG URL, indexable meta/header directives and unique metadata |
| Medical services       | PASS   | All 28 fetched, medical schema/reviewer identity checked                                                                                 |
| Journal articles       | PASS   | All 12 fetched, article and medical-review schema checked                                                                                |
| Intentional exclusions | PASS   | Five 200 pages retain noindex; missing `/404/` responds HTTP 404 with noindex; all six absent from sitemap                               |
| Internal links         | PASS   | 377 unique links/fragments across 59 destinations; no broken or inconclusive destination                                                 |
| Apex redirect          | PASS   | One HTTPS 301 from `https://drvasundaragynec.com/` to www; final HTTP 200, no loop                                                       |
| Structured data        | PASS   | JSON-LD parses; stable doctor Person ID, www host consistency, medical author/reviewer fields retained                                   |
| Publication safeguards | PASS   | Five patient-experience videos remain withheld; production indexing remains enabled; no source/UI/privacy/contact changes                |

No website retrieval failures, SSL failure or bot-blocking rules were observed. DNS address families are retained in JSON diagnostics; there was no demonstrated reason to change IPv4/IPv6, DNS, TLS or security settings. Preview noindex protections remain independently checked by existing CI.

## Authenticated Search Console and public Google evidence

Observed in the authorized domain property `sc-domain:drvasundaragynec.com` on 16 October 2026:

- Sitemap processing **Success**, submitted and last read 16 October; **53 discovered pages**, zero discovered videos. Discovered pages are not indexed-page counts.
- Homepage URL Inspection: **URL is on Google / Page is indexed**. Last crawl shown as 16 October 09:41:48, Googlebot smartphone; crawl/indexing allowed, successful fetch. Declared www canonical; Google-selected canonical is the inspected URL.
- Fresh homepage live test at 10:31: **URL is available to Google / Page can be indexed**. This supports present eligibility independently of the stored index result.
- PCOS service inspection: **indexed**, www inspected URL selected canonical; crawl 16 October 05:30:23, successful, indexing allowed.
- Urogynecology consultation inspection: **indexed**, www inspected URL selected canonical; crawl 16 October 09:51:56, successful, indexing allowed.
- PCOS/PCOD journal article inspection: **indexed**, www inspected URL selected canonical; crawl 16 October 08:05:43, successful, indexing allowed.
- Robotic gynecological surgery journal article inspection: **indexed**, www inspected URL selected canonical; crawl 16 October 09:47:45, successful, indexing allowed. Its Discovery/Sitemaps subsection displayed **Temporary processing error**, despite the global sitemap report showing Success and 53 discovered pages. That association warning remains a Search Console processing observation; direct sitemap/page retrieval passed.
- Aggregate Page indexing report: **Processing data, please check again in a day or so**. Indexed/non-indexed totals, aggregate reason counts and aggregate Google crawl-error counts are **UNVERIFIED**, not zero.

Actual public Google Search `site:drvasundaragynec.com` results were observed in the browser, including the homepage, services/about entries and the www Reproductive Health Evaluation service. Some snippets/host displays reflect older content, and a historical testimonials result remains observable despite current live noindex. This is not a reason to remove working noindex controls or to claim those snippets reflect current publication. No estimated site-search count is used as an indexed total. Separate search-tool results were stale; actual Google browser observations and Search Console are distinguished from them.

No new sitemap submission, indexing request, removal request, property/configuration change or fabricated ranking/impression/click metric was made. Current Google evidence supports specific inspected indexed URLs, **not a claim that every eligible page is indexed**.

## Monitoring corrections

The monitoring-only PR makes these demonstrated improvements:

- Fetch every eligible page and every intentional exclusion, deriving the expected URL set from the approved production build rather than hard-coding 53.
- Validate HTTPS status/content types, XML, duplicates/missing/unexpected sitemap URLs, canonical/OG consistency, robots meta/header rules, Googlebot/Bingbot robots rules, metadata, structured data and all unique internal anchor destinations/fragments.
- Preserve actual redirect steps and require a single 301 apex redirect. Keep patient video publication protections and the 404 HTTP/noindex contract.
- Normalize HTTP header names; treat `none` as restrictive. Require noindex as well as HTTP 404 rather than allowing either alone.
- Bounded concurrent fetches, bounded retries/timeouts and exact retrieval errors. A missing network response is **UNVERIFIED**, not asserted to be a website defect. Exit 1 denotes demonstrated technical failure; exit 2 denotes inconclusive verification so Actions cannot silently report a full pass. Google indexing delays are not build failures and are not part of these HTTP assertions.
- Retain JSON and readable URL-by-URL Markdown reports, step summary and 30-day workflow artifacts. Report bodies are omitted from JSON evidence; no account identities or sensitive patient records are exported.
- Retain manual execution, weekly Friday 03:30 UTC schedule and execution after successful approved production deployment. Permissions remain contents-read; no Pages deployment permission is added to monitoring.
- Add offline regression tests for headers, noindex/none, canonical duplication, strict 404 behavior, robots rules, schema/video safety, bounded network failures, dynamic inventories and the 404 page's own skip link. That skip link is valid; links from other pages to a missing page still fail.

Only monitoring, its tests and documentation change. The website's `src/`, approved medical content, publication digest, indexing setting, deployment request, Pages deployment workflow, domain/DNS, HTTPS and WhatsApp remain untouched. Merging deploys the workflow definition; no redundant website redeployment is necessary. The updated workflow is manually executed on main after green PR validation; its final run/artifact links accompany the completion report.

## Reading future results

Open **Actions → Live production SEO verification → Run workflow → main**. Download `live-seo-verification` and review `summary.md` and `results.json`. Each eligible URL and exclusion has PASS/FAIL/UNVERIFIED evidence. Network inconclusive results require comparison across checking environments; do not change DNS or security settings merely to make a checker green. A correct skip link on the intentionally missing 404 page must not be called a broken link.

Use Search Console for actual URL inclusion and canonical selection. Monitor the aggregate report once processing completes; investigate unexpected exclusions while preserving intentional noindex. Normal crawl/discovery delays do not prove a deployment defect.
