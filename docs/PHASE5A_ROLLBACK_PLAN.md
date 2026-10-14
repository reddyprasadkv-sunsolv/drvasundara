# Phase 5A WordPress backup and rollback

**Plan exists; backups and a restore rehearsal do not.** No private WordPress data was accessed, exported or committed. GoDaddy hosting is not cancelled and WordPress files/database are not deleted. Public Cloudflare edge addresses are not actual restoration origin values.

Before cutover, authorized owner captures privately: complete WordPress filesystem including wp-content/uploads, themes/plugins and configuration; consistent database dump; version/plugin/PHP settings; wp-config secrets in secure storage; .htaccess/webserver redirects; site/home URL settings, permalink rules and existing booking setup; origin certificate/config; full Cloudflare DNS record/proxy/TTL inventory, SSL mode, cache/redirect/WAF rules, DNSSEC/DS state; existing Pages workflow/deployed commit/domain configuration; GSC/Bing coverage/link exports where authorized. Encrypt/restrict backups and record hashes, snapshot timestamp, owner and retention. Never put these backups in this public repository or Actions artifact.

Verify backup integrity by restoring to an isolated private environment under authorized access: DB imports, uploads render, links/forms/plugin behavior works, private patient/intake data stays private, HTTPS/origin settings are recoverable. Document restore owner/time and tested acceptance. WordPress XML is not a substitute for files+DB backup. GoDaddy backup status cannot be inferred from current site availability.

## Rollback triggers and execution — Phase5B only

Agree objective failure thresholds before execution: invalid apex/www TLS beyond accepted maintenance window; wrong artifact/base path; widespread404/assets/links; unavailable contact path; unauthorized content/privacy exposure; email/unrelated DNS changes. Any data disclosure is handled by the clinic's incident process, not solely a DNS reset.

1. Stop further changes/indexing and preserve diagnostic timestamps/request evidence without patient data.
2. Restore **verified original apex/www record content, types, TTLs and proxy flags** from the private Cloudflare export. Current origin values are unavailable in5A; the operator must fill and approve them before launch.
3. Restore original SSL/redirect/cache/WAF settings only if changed, keeping original WordPress origin certificate valid. Check email/verification/subdomains are unchanged.
4. Keep old WordPress hosting/files/database available; restore only from verified backups if actually modified or damaged. DNS rollback alone may suffice when WordPress remains intact.
5. If repository custom-domain assignment caused preview redirection, restore the documented previous blank-domain configuration and approved project preview artifact via the existing workflow after authorization. These are settings/deploy operations, not automatic steps in5A.
6. Verify HTTP/HTTPS and canonical/www behavior, multiple resolver answers, original WordPress pages/media/contact, preview, email DNS and absence of stale mixed content. Cache TTL may delay all visitors returning; don't call rollback complete from one browser.
7. Keep indexing disabled for the new static artifact; preserve engine evidence and notify the designated owner. Do not automatically purge everything or cancel hosting.

Secure runbook fields still required: original web origin values, record IDs/proxy/TTL, SSL mode/issuer, backup locations/checksums, restore owner, maintenance/rollback thresholds and approvals. No guessed operational values are published.
