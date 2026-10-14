# Phase 5A GitHub Pages plan

Verified source: existing pages.yml only builds PAGES_PREVIEW=true on approved main deployment request/manual approval. The repository has one Pages deployment slot. No settings/custom domain changes were made. Root and project builds use one Astro source tree; base/site environment configuration already passed Phase 4 checks and is retained.

## Prepared workflow

`.github/workflows/production-readiness.yml` runs on explicit workflow_dispatch or a pull request affecting its readiness/build inputs. It checks out code without persisted credentials, installs the pinned pnpm version from packageManager with frozen lockfile, runs Astro/strict TypeScript, root build, existing/new SEO/approval tests, release preparation and checksum verification, then uploads a normal Actions artifact retained14 days. It has only contents:read and **no** pages:write, id-token, configure-pages, upload-pages-artifact or deploy-pages job. It cannot assign a custom domain or replace preview through a Pages deployment action.

New checkout/setup-node/upload-artifact versions are official v7 tags verified by public GitHub API on14 Oct2026 and pinned to their immutable commit hashes. Existing preview workflow is not changed. The new workflow's SHA256 files/checks are additional integrity evidence, not a cryptographic signing or deployment approval mechanism. In CI, manifest sourceCommit identifies the checked-out GITHUB_SHA (a PR merge commit on PR runs); local sourceDirty is truthful for uncommitted preparation builds.

Local root preparation: `PAGES_PREVIEW=false pnpm build`, `pnpm test`, `pnpm release:prepare`, `pnpm release:verify`. Output is ignored `release/production-readiness/` with site/, manifest.json and SHA256SUMS. `shasum -a 256 -c SHA256SUMS` (macOS) or `sha256sum -c SHA256SUMS` (Linux) from bundle root verifies downloaded files. Do not execute deployment just because checksums pass. No private records/exports/source trees are bundled; hidden/type/symlink guards reject unexpected files.

## Domain and deployment sequence — Phase 5B only

Use GitHub owner/org Pages verified-domain settings first; copy the exact GitHub-provided TXT name/value, never a fabricated token. Account-level ownership verification does not by itself assign this repository domain. Adding the TXT record is still a DNS change requiring Phase 5B authorization.

At cutover, an admin sets repository Settings → Pages → Custom domain to drvasundaragynec.com **before** pointing DNS at GitHub, following [official GitHub guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Source remains GitHub Actions. Existing public/CNAME is descriptive in root output: for Actions-based Pages, the CNAME file is ignored and not required; it does not set the repository domain. Preview preparation still removes it.

A separately reviewed Phase 5B workflow/job will require actual approval gates, Pages permissions, a protected production environment and root-artifact identity before upload/deploy. No such job is enabled now. Do not reuse the project preview artifact as production output, and do not assume runtime canonical tags change the deployment base path.

Publishing root output/assigning a custom domain replaces or redirects the existing repository preview. Scheduling must acknowledge this window. If permanent independent preview access is required, obtain approval for a separate staging repository/host first; no second repository is created automatically. No path that keeps the same Pages deployment simultaneously serving two different build bases is promised.

Apex is canonical; correctly configured www CNAME permits GitHub to redirect www to apex. Verify actual HTTPS redirects/TLS after provisioning, not merely the CNAME. Only enable Enforce HTTPS when available and certificate evidence is valid. Certificate provisioning may take time; choose an agreed maintenance/rollback window rather than promising zero downtime.
