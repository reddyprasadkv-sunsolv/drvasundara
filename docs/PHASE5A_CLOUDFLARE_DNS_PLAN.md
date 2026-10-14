# Phase 5A Cloudflare DNS plan

Read-only observation: 14 October 2026, dns.google public DNS-over-HTTPS. Cloudflare authority verified through `aaden.ns.cloudflare.com` and `athena.ns.cloudflare.com`. GoDaddy remains the stated registrar; no nameserver move is proposed. No zone write, export download with credentials or account settings change.

## Before: actual public answers

| Query name                  | Type  | Observed answer                                                                   | Observed TTL seconds | Evidence limit                                       |
| --------------------------- | ----- | --------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------- |
| drvasundaragynec.com        | NS    | aaden.ns.cloudflare.com.; athena.ns.cloudflare.com.                               | 21600; 21600         | Public resolver answer, not a Cloudflare zone export |
| drvasundaragynec.com        | A     | 104.21.19.141; 172.67.186.122                                                     | 300; 300             | Public resolver answer, not a Cloudflare zone export |
| drvasundaragynec.com        | AAAA  | 2606:4700:3031::ac43:ba7a; 2606:4700:3037::6815:138d                              | 300; 300             | Public resolver answer, not a Cloudflare zone export |
| drvasundaragynec.com        | CNAME | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| drvasundaragynec.com        | MX    | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| drvasundaragynec.com        | TXT   | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| drvasundaragynec.com        | CAA   | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| www.drvasundaragynec.com    | NS    | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| www.drvasundaragynec.com    | A     | 104.21.19.141; 172.67.186.122                                                     | 300; 300             | Public resolver answer, not a Cloudflare zone export |
| www.drvasundaragynec.com    | AAAA  | 2606:4700:3031::ac43:ba7a; 2606:4700:3037::6815:138d                              | 300; 300             | Public resolver answer, not a Cloudflare zone export |
| www.drvasundaragynec.com    | CNAME | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| www.drvasundaragynec.com    | MX    | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| www.drvasundaragynec.com    | TXT   | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| www.drvasundaragynec.com    | CAA   | No answer in queried resolver snapshot                                            | —                    | Does not prove full-zone absence                     |
| _dmarc.drvasundaragynec.com | TXT   | v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net; | 300                  | Public resolver answer, not a Cloudflare zone export |

A/AAAA values are Cloudflare edge addresses; proxying is suggested, but underlying A/CNAME/AAAA targets, orange-cloud flags, configured TTLs and other subdomains are not visible. A public no-answer result for MX/TXT/CAA is not evidence that the entire zone has no email/verification settings. DKIM requires actual selector names; none were supplied, so no selectors were guessed. Public DMARC is retained as observed.

**Do not use 104.21.19.141 / 172.67.186.122 as WordPress origin rollback A targets.** They describe current public edges. Full Cloudflare zone export and screenshots/API inventory of the actual web origin records/proxy flags are required before cutover. Store privately, with access restricted; do not commit email selector inventories, credentials or backups to this public repository. Preserve every unrelated record.

## After: intended web records — Phase 5B only

| Type  | Name | Intended target                 | Initial proxy/TTL            |
| ----- | ---- | ------------------------------- | ---------------------------- |
| A     | @    | 185.199.108.153                 | DNS-only; owner-approved TTL |
| A     | @    | 185.199.109.153                 | DNS-only; owner-approved TTL |
| A     | @    | 185.199.110.153                 | DNS-only; owner-approved TTL |
| A     | @    | 185.199.111.153                 | DNS-only; owner-approved TTL |
| CNAME | www  | reddyprasadkv-sunsolv.github.io | DNS-only; no repository path |

[GitHub's official custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) corroborates these addresses/target. Recheck at execution, because documentation can change.

Inspect actual apex/www AAAA records in the zone export. Cloudflare-generated edge IPv6 answers are not necessarily explicit origin AAAA records. For direct GitHub IPv6, official addresses are 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153. Either explicitly approve that supported mapping or remove only confirmed stale web-host AAAA during authorized cutover; don't leave GoDaddy origin IPv6 pointing elsewhere and don't delete unrelated records.

## Full inventory and rollback gate

Owner must capture actual record IDs, name/type/content, priority, TTL, proxy flag for apex/www, MX, TXT, SPF, all real DKIM selectors, DMARC, CAA, DNSSEC/DS status, subdomains and GitHub challenge records. Also capture Cloudflare redirect/cache/WAF/SSL settings separately; DNS zone text alone does not capture all proxy/control settings. No root CNAME/wildcard is added.

Rollback is to those verified original origin records and proxy flags, not the public observations above. Exact origin values remain **unavailable / cutover blocker**, not guessed GoDaddy addresses. Compare complete before/after inventory: only approved apex/www web records and any necessary approved domain-validation records may differ. Email, verification and unrelated subdomains must remain identical.

Verification commands after Phase 5B authorization: `dig drvasundaragynec.com NS +noall +answer`, `dig drvasundaragynec.com A +noall +answer`, `dig drvasundaragynec.com AAAA +noall +answer`, `dig www.drvasundaragynec.com CNAME +noall +answer`, then actual MX/TXT/CAA/DMARC/selectors from the exported inventory against multiple resolvers. Record TTLs and result timestamps; resolver cache TTL differences are not themselves record edits.
