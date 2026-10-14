# Phase 4 production migration readiness

No production deployment, DNS, WordPress file changes, Cloudflare settings or redirects performed. Current production is still the old WordPress site; preview canonicals describe future root intent, not an active cutover.

## Verified URL evidence and mapping

| Existing URL                               | Evidence                                                                 | Future destination | Action                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------ |
| https://drvasundaragynec.com/              | Public page retrieved in Phase 4                                         | /                  | Preserve root path                                           |
| https://drvasundaragynec.com/about/        | Public page retrieved                                                    | /about/            | Preserve path                                                |
| https://drvasundaragynec.com/services/     | Public page retrieved                                                    | /services/         | Preserve path; 27 new detail paths are additional            |
| https://drvasundaragynec.com/contact/      | Link in original Home/About/Services navigation; direct retrieval failed | /contact/          | Preserve path; verify live status with owner                 |
| https://drvasundaragynec.com/testimonials/ | Original navigation/source link; direct retrieval failed                 | /testimonials/     | Preserve path; verify status                                 |
| https://drvasundaragynec.com/gallery/      | Original navigation/source link; direct retrieval failed                 | Not implemented    | Obtain actual gallery inventory; do not redirect arbitrarily |

The old public service page names several topics but does not supply individual detail URLs in retrieved content. No guessed historical service/blog path is included. WordPress robots/wp-sitemap retrieval failed in this tool; no accessible complete sitemap or Search Console/Bing export was supplied. Indexed URLs and important backlinks cannot be inferred from a sitemap or nav, and remain unknown. No indexed-URL count fabricated.

Required launch inputs: actual WordPress sitemap/feed exports, Search Console pages and links exports, Bing indexed pages, server logs if accessible, important inbound referral URLs, gallery/media inventory and approved deleted-content destinations. Record verified old URLs, proposed new exact path, reason, query-string policy, redirect type and verification status. Match meaningful replacements; retain unmapped pages or return appropriate 404/410 rather than redirect everything to Home.

## Eventual Cloudflare approach

[Cloudflare Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) can map verified legacy source URLs to approved production targets where the zone/plan/proxy configuration supports it. Use exact URL mappings, preserve query strings only when appropriate, avoid loops/chains, test http/https and www policy, and verify HTTP 301/308 behavior with real requests. Existing unchanged paths need no redirect. GitHub Pages does not provide general server rewrite rules; a meta refresh is not equivalent to an edge HTTP redirect.

Prepare/review mapping first; execute only during separately authorized Phase 5 cutover. Keep old WordPress backup and DNS rollback instructions. Confirm custom domain/TLS, root assets, production canonical/sitemap hosts and an actual missing-path 404 before separately enabling production indexing. Then crawl the mapped URLs and monitor real engine coverage. No redirects were activated here.
