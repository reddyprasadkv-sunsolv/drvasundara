# Testimonials indexing authorization — 16 October 2026

Following confirmation and publication of all five existing patient videos, the project owner instructed:

> make testimonials page remain index

This explicitly authorizes enabling search indexing for `/testimonials/` and including its canonical www URL in the production sitemap. It supplements the [five-video website publication attestation](PATIENT_VIDEO_PUBLICATION_CONFIRMATION_2026-10-16.md); no independent review of private patient releases, new medical content approval or altered clinical review dates is claimed.

Remove both the route-specific noindex prop and shared testimonials exclusion. Production now has 54 eligible sitemap URLs and five intentional exclusions: 404 and the four existing single-article journal categories. Preview remains noindex/disallowed. Global production indexing remains true. Preserve all five patient videos, existing featured homepage placement, click-to-load privacy controls, 28 services, 12 articles and five educational videos.

The explicit deployment request and scoped source approval record reference this instruction; the source inventory digest is refreshed without changing existing clinical/privacy approval scope. Release validation requires the testimonials indexing request to match this scoped record. Existing production/preview, indexing-state, sitemap, schema, links, accessibility and publication checks must pass before deployment through GitHub Actions.

Verify actual production HTTP 200, `index, follow`, no restrictive X-Robots-Tag, www canonical, sitemap inclusion and existing video cards after deployment. This authorizes technical indexability; it is not proof of Google index inclusion and does not submit a new indexing request. No DNS, domain, HTTPS, website design or medical text changes.
