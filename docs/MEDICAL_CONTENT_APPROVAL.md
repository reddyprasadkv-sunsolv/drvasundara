# Medical content approval and clinic handoff

No Phase 2 service or article is medically approved. Public source corroboration does not substitute for clinician review. Drafts are stored in the repository, which is public, but excluded from website routes, listings, related links and sitemap.

## Exact approvals needed

- Confirm professional title, specializations and current role. Approve the final introduction and clinical approach; no guaranteed consultation or outcome promises.
- Supply qualifications and registration evidence, the registration number/authority, and the exact permitted credential wording. Confirm MBBS college/year, postgraduate qualification/year, robotic training credential and menopause certification. Do not expand degree abbreviations without evidence.
- Confirm all four timeline entries: 2018–present KIMS/KIMS Cuddles; 2017–2018 Mahavir; 2015–2017 KIMS/independent practice; 2014–2015 Community Health Centre Vizag. Confirm current affiliation and the outdated 13+ years label, or remove it.
- For each of 29 proposed services, confirm present availability and the exact procedure/consultation scope. Approve introduction, symptoms/reasons, advice thresholds, evaluation, benefits/risks/alternatives/limitations, every FAQ, references and SEO summary. Two preventive aliases must point to the canonical service rather than create duplicate routes.
- Resolve PCOS/PCOD terminology against current guidance; review urgent ectopic/pregnancy/bleeding advice. Independently assess cosmetic procedure evidence, indications, alternatives and risks without body-image pressure.
- Turn each of 12 outlines into a complete article; verify its actual human author, disclose AI assistance, obtain genuine medical review and record real dates. An AI planning identity is not a doctor author or medical reviewer.
- Approve portrait/stock permissions and any future article imagery. No identifiable patient images without applicable permission and ethics review.
- Confirm current street address, postcode, city, clinic name, doctor/clinic phone, email, map, Google Business Profile and affiliations. Resolve conflicting 09:00–16:00 Mon–Fri versus 08:00–16:00 Mon–Sat hours. No local schema or geo coordinates until confirmed.
- Supply clinic-owned HTTPS Google Forms URL, privacy contact, retention period, minimal necessary fields and consent text. Review the external form itself; this website does not store patient submissions.
- Review existing five videos under applicable NMC advertising/confidentiality requirements. Written experiences remain unpublished. Consent and prior user authorization do not constitute legal clearance.
- Approve privacy content and production cutover/indexing separately. GitHub preview approval does not authorize domain/DNS/WordPress changes.

## Review workflow

Draft → medical-review → approved → published. Approved remains unpublished until deliberate publication. Doctor-review is accepted as a legacy status. Review evidence must identify the responsible clinician, scope, source versions, revisions and actual approval date. Use a clinic-approved evidence URL; do not put private patient data or registration documents into this public repository.

Profile claims require corroborated/document-verified status, source URLs, doctorApprovalStatus=approved, approvedForPublication=true, approvedBy and a real non-future approvedAt. Re-check partially corroborated facts before changing verification status.

Services require status=published, approved=true, availabilityConfirmed=true, contentReviewed=true, reviewer, approvedBy, approvalRecord HTTPS URL, real review/approval dates, sources and complete clinical sections/FAQs. A checkbox alone is insufficient. Aliases do not create separate pages.

Articles require contentType=article, confirmed truthful authorship, reviewed FAQs, complete introduction/takeaways/sources, status=published, real dates and verified author/reviewer records. Verified identities need evidence; medical reviewers must be verified people with verified registration. Doctor-authored content requires an actual clinical author. Unrelated/unapproved articles and services never become public internal links. Revisions require renewed review and updatedAt; dates may not postdate the latest update/publication.

Run pnpm review:export to produce an ignored local clinician pack under qa/clinician-review. It contains the full service drafts and profile inventory; MDX outlines remain in src/content/blog. Review this material privately with the clinic before publication. The pack is never part of dist.

## Acceptance and maintenance

Before publishing a record: check references against current primary guidance, source accuracy, clear language, emergency wording, permissions, authorship and metadata. Run pnpm check, build and test, then inspect the actual page on desktop/mobile. Record a clinic-selected next-review interval; no review date has been invented. Withdraw obsolete content by returning it to draft and rebuilding. Production deployment and indexing require explicit separate authorization.
