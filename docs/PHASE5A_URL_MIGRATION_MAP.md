# Phase 5A exact URL migration map

Read-only audit14 Oct2026: current WordPress Home/About/Services retrieved by the web tool; navigation links provide additional exact path evidence. Public robots.txt, sitemap.xml, sitemap_index.xml, wp-sitemap.xml and public WordPress pages/posts REST probes were inaccessible. A failed fetch is not proof the route is404. No WordPress export, indexed-URL list, redirect configuration or Search Console backlink export was supplied.

| Legacy URL                                 | Verified evidence                        | Future Astro URL                           | Required action / approval                             |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| https://drvasundaragynec.com/              | Public Home retrieved                    | https://drvasundaragynec.com/              | Preserve path                                          |
| https://drvasundaragynec.com/about/        | Public About retrieved                   | https://drvasundaragynec.com/about/        | Preserve path                                          |
| https://drvasundaragynec.com/services/     | Public Services retrieved                | https://drvasundaragynec.com/services/     | Preserve path; retain topic guide                      |
| https://drvasundaragynec.com/contact/      | Exact navigation/appointment destination | https://drvasundaragynec.com/contact/      | Preserve; direct retrieval unavailable                 |
| https://drvasundaragynec.com/testimonials/ | Exact original navigation link           | https://drvasundaragynec.com/testimonials/ | Preserve; direct retrieval unavailable                 |
| https://drvasundaragynec.com/gallery/      | Exact original navigation link           | Not implemented                            | Missing-content review; no arbitrary redirect selected |

No old individual service/blog URL was discovered from the accessible pages. The new27 services/12 articles are not evidence that matching historical paths existed. Appointment links point to old Contact plus in-page booking flows, not a separately verified old appointment pathname. No guessed /appointment legacy redirect is created. Original media URLs under wp-content/uploads need an actual export/inbound-link inventory; the absence of a complete media map is a launch blocker.

Before Phase5B, obtain full sitemap/WordPress XML export, public page/post/media permalink inventory, GSC indexed/page/link reports, existing redirects and important external links. Keep exports private; publish only individually reviewed non-sensitive URL mappings. An XML export is content inventory, not a full WordPress restoration backup.

Proposed Cloudflare-compatible rule structure (not activated): exact source https://drvasundaragynec.com/<VERIFIED-OLD-PATH> → exact approved https://drvasundaragynec.com/<NEW-PATH>, permanent301/308, query handling reviewed per path. Placeholder rows are instructions, not real migration URLs. Unchanged mapped paths require no rule. Approve deleted-content404/410 separately; don't redirect all missing pages to Home.

Preflight validate: target exists and matches intent; source ≠ target; no target is another redirect source; no http/www normalization chain; preserve necessary query semantics without copying sensitive intake parameters; no wildcard catches that shadow assets or existing routes. Cloudflare Bulk Redirects require compatible zone/proxy settings; initially DNS-only requests bypass Cloudflare edge redirect rules. Decide when proxying is safely enabled after TLS origin validation, or select another explicitly approved redirect-capable hosting approach. GitHub Pages alone cannot supply arbitrary server redirects. No loop-prone meta-refresh substitute is silently installed.

Mapping is assessed, not clinic-approved or complete. Gallery/media and any indexed historical service/blog URLs remain unresolved. No redirects activated in5A.
