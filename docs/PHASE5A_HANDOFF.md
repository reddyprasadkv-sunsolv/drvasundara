# Phase 5A handoff and Phase 5B operator plan

Phase5A development is preparation only on codex/phase5a-production-readiness. Draft pull request contains the artifact-only workflow, hashed root readiness bundle scripts, safety tests,11 reports and removal of the unused empty public/fonts/.gitkeep placeholder. No UI/clinical/media rewrite, new dependency, main merge, Pages deployment, custom-domain assignment, DNS change or WordPress access/mutation is performed.

Existing preview remains the Phase4 main deployment; no redeployment is needed because the visitor source has not changed. A draft PR does not execute Pages' main-only deployment job. Main stays at the recorded Phase4 baseline. New production artifact workflow has no Pages credentials/actions and publishes only a regular Actions readiness artifact on reviewed PR/manual triggers.

## Phase5B plan — explicit operator authorization required

1. Resolve NO-GO clinic/privacy/medical/video/galleries/legacy/backup/origin-record items; obtain exact written cutover/indexing approvals and maintenance/rollback window.
2. Verify complete WordPress files+DB backup and isolated restoration; capture full private Cloudflare record/proxy/SSL/redirect inventories and record actual rollback origin values. Keep GoDaddy hosting available.
3. Decide whether permanent preview requires separately approved staging repository before changing this one Pages slot. No automatic second repository.
4. Review/merge preparation and build the exact intended commit's root noindex artifact; verify manifest/SHA256 and sourceDirty=false. Add a separately approved, protected Phase5B deployment job, never assume the artifact upload deploys the site.
5. Verify GitHub domain ownership with the exact supplied TXT and then assign repository custom domain drvasundaragynec.com before pointing web DNS to GitHub. Expect existing preview redirection/replacement; notify owner.
6. Deploy reviewed root output only under Phase5B authorization. Change only approved apex4A/www CNAME and reconciled web AAAA records in Cloudflare DNS-only mode. Preserve nameservers/email/verification/subdomains/CAA except separately approved certificate validation changes.
7. Wait for GitHub apex/www TLS provisioning; validate origin hostname/chain/expiry and Enforce HTTPS. Don't use Flexible or bypass failed certificate verification. Execute rollback if agreed failure threshold is crossed.
8. Validate root routes/assets/404/links, 27 services/12 articles/categories, both video types, WhatsApp, optional form truthfulness, schema/canonicals and mobile/tablet/desktop. Confirm no sensitive data or unsupported claims.
9. Only after valid origin certificate and separate approval, assess Cloudflare Full(strict)/proxying and exact approved redirects. DNS-only traffic bypasses Cloudflare edge redirects, so coordinate redirect activation/proxy timing deliberately.
10. Only after separate indexing approval, adjust root indexing policy/final sitemap, rebuild/deploy, verify robots/meta and submit to real authorized engine properties. Keep staging noindex and analytics off unless separately approved.
11. Monitor TLS, DNS/email invariants, errors, engine coverage/redirects and actual field vitals; keep rollback resources until owner signs off. Do not cancel GoDaddy hosting automatically.

Instructions and templates are not execution authorization. Backup verification, domain certificate and clinic approvals remain incomplete. Stop after5A; production decision is NO-GO today.
