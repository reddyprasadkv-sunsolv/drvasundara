# Phase 3 handoff

## Delivered

A per-page audit of all 27 services and 12 articles; premium journal landing, seven category routes, static search, enhanced reading layout/copy/print/anchors, medical reviewer profile and editorial policy, explicit approval metadata with compatibility, curated related links, shared FAQ knowledge and an ignored local editorial status report. Original article clinical narratives, slugs, dates and publication states are protected by baseline tests.

## Files

See PHASE3_FILES.md for the exact modified/created source list. Important locations: src/components/journal, src/utils/publication.mjs, journal.mjs and faqs.ts, src/data/journal-categories.json, the blog pages/JSON endpoint, content.config.ts and scripts/editorial-*.mjs. No backend, database, authentication or additional runtime dependency was added.

## Clinic items still needed

- Supply confirmed registration number/authority and appropriate professional evidence. Current attribution uses the previous user-confirmed review and institutional identity, not an independent licence audit.
- Supply a signed or clinic-owned secure approval record where available; existing 13 October user-relayed approval is retained rather than invented or withdrawn.
- Select actual nextReviewDueAt deadlines; all twelve are currently unscheduled.
- Resolve source-scope/currency issues in PHASE3_CONTENT_AUDIT.md, especially PCOS terminology, broad abnormal bleeding, high-risk/pregnancy complications, fertility investigations, surgical consent and cosmetic evidence. Some original ACOG full text and NICE direct pages were inaccessible; accessible primary abstracts/official indexed recommendations and NHS supplements improve coverage without claiming comprehensive verification.
- Any substantial narrative expansion/differentiation needs fresh medical review. Current articles are short reviewed overviews reusing service copy, not exhaustive clinical guidance. A genuinely relevant cosmetic journal article remains a future content gap.
- Confirm exact address/postcode, registration details, email, conflicting hours and clinic-owned Google Forms URL. Existing safe appointment fallback remains because the form was not supplied.
- Existing video advertising/privacy review remains a clinic task. Five videos are preserved; no new written patient quotes or ratings were added.

## Operations

Use EDITORIAL_WORKFLOW.md. Run pnpm journal:report for the private local status pack; journal:new creates only an unpublished draft. Public record validation is part of pnpm test. Never store signed/private documents or patient data in this public source repository. Review evidence may link to secure storage and is excluded from visitor output.

Publish only via the approved GitHub Pages preview workflow. No Cloudflare/GoDaddy/DNS/WordPress/indexing changes were performed. Stop here: Phase 4 requires a separate instruction.
