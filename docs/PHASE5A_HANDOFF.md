# Phase 5A handoff and Phase 5B operator plan

Phase 5A continues on the existing `codex/phase5a-production-readiness` branch. Latest fetched main `3d375a35e6a58301ca5c94a83705a3d5d8ef5cbd` was merged, retaining all six post–Phase 4 commits. No new repository was created. See PHASE5A_UPDATED_BASELINE and PHASE5A_BASELINE_URL_INVENTORY for the preservation record and all 58 public destinations, including Urogynecology Consultation. There are 59 HTML documents including 404, 28 canonical services and 12 articles.

The artifact-only workflow and hashed root readiness bundle remain preparation tools. No main merge, push, Pages deployment, custom-domain assignment, DNS or WordPress change is performed in this continuation. Main remains at the fetched baseline; this branch preserves its latest portrait, homepage, About interests, clinical approvals and CTAs. Live preview deployment status is not inferred from local builds. The production workflow has only read permission and uploads a regular Actions artifact; it cannot deploy Pages. Production indexing remains disabled.

## Phase5B plan — explicit operator authorization required

1. Resolve NO-GO clinic/privacy/medical/video/galleries/legacy/backup/origin-record items; obtain exact written cutover/indexing approvals and maintenance/rollback window.
2. Verify complete WordPress files+DB backup and isolated restoration; capture full private Cloudflare record/proxy/SSL/redirect inventories and record actual rollback origin values. Keep GoDaddy hosting available.
3. Decide whether permanent preview requires separately approved staging repository before changing this one Pages slot. No automatic second repository.
4. Review/merge preparation and build the exact intended commit's root noindex artifact; verify manifest/SHA256 and sourceDirty=false. Add a separately approved, protected Phase5B deployment job, never assume the artifact upload deploys the site.
5. Verify GitHub domain ownership with the exact supplied TXT and then assign repository custom domain drvasundaragynec.com before pointing web DNS to GitHub. Expect existing preview redirection/replacement; notify owner.
6. Deploy reviewed root output only under Phase5B authorization. Change only approved apex4A/www CNAME and reconciled web AAAA records in Cloudflare DNS-only mode. Preserve nameservers/email/verification/subdomains/CAA except separately approved certificate validation changes.
7. Wait for GitHub apex/www TLS provisioning; validate origin hostname/chain/expiry and Enforce HTTPS. Don't use Flexible or bypass failed certificate verification. Execute rollback if agreed failure threshold is crossed.
8. Validate root routes/assets/404/links, 28 services/12 articles/categories, both video types, WhatsApp, optional form truthfulness, schema/canonicals and mobile/tablet/desktop. Confirm no sensitive data or unsupported claims.
9. Only after valid origin certificate and separate approval, assess Cloudflare Full(strict)/proxying and exact approved redirects. DNS-only traffic bypasses Cloudflare edge redirects, so coordinate redirect activation/proxy timing deliberately.
10. Only after separate indexing approval, adjust root indexing policy/final sitemap, rebuild/deploy, verify robots/meta and submit to real authorized engine properties. Keep staging noindex and analytics off unless separately approved.
11. Monitor TLS, DNS/email invariants, errors, engine coverage/redirects and actual field vitals; keep rollback resources until owner signs off. Do not cancel GoDaddy hosting automatically.

Instructions and templates are not execution authorization. Backup verification, domain certificate and clinic approvals remain incomplete. Stop after5A; production decision is NO-GO today.
