# Phase 5A SSL/HTTPS plan

Verified: current preview serves HTTPS; generated root canonicals/social/schema URLs are HTTPS; artifact verifier rejects HTTP src/href references and project-base paths. No future-domain GitHub certificate is provisioned in Phase 5A. Current Cloudflare SSL mode and GoDaddy origin certificate are not known from public DNS and must be exported privately before launch.

Phase 5B dependencies: exact domain ownership verification; repository custom-domain assignment; DNS-only GitHub web records (including reconciled AAAA); restrictive CAA/ACME validation checks; GitHub Pages certificate issuance for both apex and www; Enforce HTTPS; actual HTTP/www→HTTPS apex redirect validation. [GitHub HTTPS guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) identifies DNS conflicts and certificate provisioning dependencies. Do not infer readiness from a 200 response alone.

Public apex/www CAA queries returned no answers on14 Oct. Full zone/parent CAA inheritance still needs checking. If a restrictive CAA policy applies, reconcile it with GitHub's documented certificate issuer only after authorization; do not erase all CAA records or invent a policy. Capture CAA changes for rollback.

Initially use DNS-only as planned. After GitHub origin certificate is issued and validated, optional Cloudflare proxying may be assessed using [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/). Require correct hostname/SAN, expiry and trusted chain at the origin. Never use Flexible SSL or weaken certificate validation to conceal an invalid origin certificate. Do not turn proxying on before origin validation.

Read-only verification examples reserved for cutover acceptance:

```sh
curl -I https://drvasundaragynec.com/
curl -I https://www.drvasundaragynec.com/
curl -I http://drvasundaragynec.com/
openssl s_client -connect drvasundaragynec.com:443 -servername drvasundaragynec.com -verify_return_error
curl --resolve drvasundaragynec.com:443:185.199.108.153 -I https://drvasundaragynec.com/
```

The --resolve probe validates an already-provisioned GitHub origin independently of proxied public DNS; certificate failure before provisioning is a real blocker, not a reason to use `curl -k` as acceptance evidence. Check all origin addresses as appropriate. Inspect full certificate SAN/expiry/chain output without logging private keys. Verify images/fonts/favicon/social assets, user-click YouTube HTTPS and absent mixed content in a real browser.

Certificate issuance after DNS changes may not be immediate. Domain assignment can interrupt/redirect the existing preview before web DNS cutover; root-artifact replacement also changes it. Agree a maintenance window, failure threshold and rollback procedure. No live SSL/proxy/cache/WAF/HSTS changes during5A.
