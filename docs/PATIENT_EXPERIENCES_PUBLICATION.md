# Patient Experiences page publication — 16 October 2026

Implements the project owner's request through existing PR #17. Latest main baseline: `6344af6bf4032c3ef2e5494db832461c141a5dc7`; reviewed original PR head: `292cbd5df498e433e6473ffc7bd16d876d519438`.

## Published page scope

`/testimonials/` becomes a complete informational Patient Experiences page with a clear introduction, three responsive care-guide cards, links directly to the existing pregnancy/antenatal and general gynecology services, appointment information and privacy information. These are informational cards, **not patient testimonials**. No review, quotation, patient identity, rating or medical outcome is invented. The existing fonts, palette, page layout and shared button/focus styling are preserved.

The existing privacy-conscious PatientVideos component is used only when the existing publishedTestimonials gate supplies authorized records. That gate remains unchanged and currently supplies no patient videos. No unavailable-message component is rendered as the page content. The homepage's existing patient-video gate and five educational videos remain untouched.

## Evidence review and publication outcome

Reviewed `src/data/testimonials.ts`, `src/data/written-testimonial-review.json`, `.github/publication-readiness.json`, the clinic publication checklist and 16 October indexing approval. No individual patient release or non-sensitive authorization reference covering this website was present in the supplied records. Private evidence must remain outside public GitHub; no sensitive release documents are copied here.

| Inventory                          | Published now | Reason                                                                                                            |
| ---------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Genuine patient video testimonials | 0 of 5        | Individual permission covering intended website publication cannot be verified from reviewed evidence             |
| Written patient testimonials       | 0             | Existing review record says authenticity not independently established, permission not supplied and publish false |
| Informational care-guide cards     | 3             | Links and administrative information, clearly presented as care guides rather than patient accounts               |

All five original video records remain intact. The same missing authorization evidence applies to each recorded video: `LQ5VBo9wZhw`, `ZjGuZZEki4w`, `Tn6soQyuW68`, `FcWkoQz6dko`, `gyG40rv_UOQ`. YouTube availability and the owner's request to publish are not recorded as individual patient permission. This is a statement that permission is **unverified**, not that no consent exists anywhere.

The user expressly authorized the informational fallback when permission is not established. This record authorizes the nonclinical page implementation and approved deployment; it does not fabricate patient permission or a new medical review. Existing clinical/privacy approvers, dates and scope remain unchanged. The source inventory digest is updated to bind the requested page to this release, resolving PR #17's stale-inventory validation failure without weakening the guard.

## Indexing and delivery

- `/testimonials/` remains `noindex, nofollow`, with no Review/AggregateRating markup or sitemap inclusion.
- Production indexing remains enabled globally; 53 sitemap URLs and six intentional exclusions remain unchanged. Preview remains noindex and crawling protected.
- Existing 28 services, 12 articles, five educational videos, WhatsApp, source patient records, DNS, domain, HTTPS and approved medical content remain unchanged.
- The explicit Pages request revision changes to publish this approved informational page through the existing production workflow. No local deployment or settings change is performed.
- Existing production/preview validation covers Astro/TypeScript, links, metadata, schema, publication safeguards and accessibility. Testimonials-specific browser assertions verify three visible cards, appropriate destination links, visible keyboard focus, no unavailable-only content and one-column/three-column layouts at existing test widths. Patient-video absence remains a global assertion.
- Merge only after the updated exact head passes all required CI. The approved Pages workflow revalidates before deploying; the live SEO workflow then checks actual production responses.

Live verification must confirm HTTP 200, a populated introduction and care-guide section, working destinations, no patient videos, noindex and sitemap exclusion. The completion report supplies the merge SHA, validation/deployment runs, live result and genuine testimonial count. No claim of patient publication approval or new Google indexing is made.
