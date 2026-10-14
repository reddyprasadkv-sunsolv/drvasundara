# Clinic editorial workflow

This is a GitHub-based publishing process, not a patient portal. The repository is public. Store signed clinical approvals, registration documents and any patient information in clinic-controlled secure storage, not in article files or GitHub attachments. A secure evidence URL can be referenced internally without publishing its contents.

## 1. Start a draft

Ask the website maintainer to run `pnpm journal:new my-new-topic "Working article title"`, or create a new MDX file under `src/content/blog` using a previous article as a structural example. The command creates an unpublished draft with no author, reviewer or dates assigned. Use a new descriptive slug; never overwrite an existing slug casually.

Keep `status` and `editorialStatus` set to `draft`. `governanceVersion: 3` identifies the current validation rules. `contentType: article` describes the intended document, not permission to publish it. No article becomes public merely because its file exists.

## 2. Choose a topic

Keep the legacy `category` for compatibility and add `journalCategory`: pregnancy-obstetrics, menstrual-health, pcos-hormonal-health, fertility-reproductive-health, gynecological-surgery, menopause-midlife-health or preventive-healthcare. Category pages are generated only for categories with public articles. Sparse collections remain noindex.

## 3. Prepare the explanation and sources

Add a title, plain-language summary/excerpt, introduction, key takeaways, coherent sections, reviewed FAQs and sources with specific titles and HTTPS URLs. Each reference must support the claims it accompanies. Do not use a general index as proof of an entire clinical protocol. Clinical body text must be substantive; the automated minimum is a floor, not a quality standard.

Record actual authorship: doctor-authored only when the doctor really wrote it; staff-authored when appropriate; ai-assisted when AI helped. `editorialAssistance` explains that assistance. Do not attribute AI prose to the doctor. Assign an existing truthful author record under `src/content/authors`, with `author` and matching `authorId`.

Add meaningful image alt text and use approved imagery only. Use a native figure/caption for informational illustrations; do not imply stock models are patients. Include the approved educational `clinicalDisclaimer`.

For a wide table, use a wrapper with `class="table-scroll"`, `tabindex="0"`, `role="region"` and a descriptive `aria-label`. Add a `<caption>`, column `<th scope="col">` and row headers where appropriate. The reading layout supports scrolling and print styles. Trusted MDX can import approved Astro components; avoid arbitrary scripts or external embeds.

## 4. Submit for medical review

Change both states to `medical-review` and open a pull request for the clinician. The legacy doctor-review state is still accepted. Ask the reviewer to check facts, current references, Indian applicability, urgent advice, alternatives/risks, FAQs, terminology, image/privacy permissions and the limits of the explanation.

## 5. Record the real review

After review actually occurs, assign `reviewer` and matching `reviewerId`; enter the real `medicalReviewedAt` date. Reviewer records need confirmed identity, clinical role and `reviewConfirmationRecord`. Record registration evidence when supplied; do not fabricate it or confuse a review confirmation with a registry audit. Credentials should have source evidence and clinic confirmation.

## 6. Obtain approval

Use the actual `approvedBy`, `approvedAt` and `approvalRecord`. The record should identify the clinician, version/scope and genuine approval event. It may refer to private secure storage. Do not put secrets or patient information in the public record. Set both states to `approved`; approved still does not publish.

## 7. Publish deliberately

Set both states to `published` and add the real `publishedAt` date. Confirm `authorshipConfirmed: true`, complete metadata, actual reviewed FAQs and related links. `authorId`/`reviewerId` must match their record references. Review and approval dates must precede the applicable publication/update; future or malformed dates fail eligibility. Missing sources, approval evidence, verified identities, substantive body or disclaimer block publication.

The maintainer runs `pnpm check`, `pnpm build` and `pnpm test`, then reviews the generated page on mobile/desktop. The homepage, journal, category listings, search, related links and sitemap all use the same public eligibility filter. A GitHub Pages preview publication does not authorize production cutover or indexing.

## 8. Revise a published article

Use a branch and obtain review of any substantive medical change. Record a real `updatedAt` or `lastUpdated`; when both are supplied they must agree. Retain the original publication date. Refresh actual medical review/approval metadata only after those events occur. A font/layout change is not a new medical review or clinical content update.

## 9. Withdraw inaccurate material

Explicitly return both states to `draft` and rebuild/deploy the preview. That removes the page from public search, listings, related links and sitemap. The deployment removes obsolete output; keep history for audit. Never silently republish a withdrawn file because it remains in the repository.

## 10. Plan periodic manual review

The clinic chooses a risk-appropriate interval and records `nextReviewDueAt` only when agreed. Run `pnpm journal:report` to inspect `qa/editorial/status.md` and `.json`: totals, drafts, awaiting review, approved/published, missing references/reviewers/evidence, due or unscheduled reviews and broken relationships. These reports are ignored, never deployed and contain no approval-document contents. `pnpm journal:validate` blocks public eligibility/link failures but does not require unpublished drafts to have finished medical metadata.

There is no automatic clinical approval, content rewrite or review event. The current twelve review dates remain 13 October 2026; manual review deadlines have not been invented.
