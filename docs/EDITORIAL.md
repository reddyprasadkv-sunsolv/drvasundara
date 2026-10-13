# Doctor-reviewed publication through GitHub

1. Create a branch or PR containing `src/content/authors/<id>.json` with `name`, `role`, `verified:false`, optional qualifications and profile URL. Only set verified after clinic confirmation. Never invent credentials.
2. Add an MDX document under `src/content/blog/`. Put real doctor-authored prose below its frontmatter. Use `status: draft`.
3. Move to `doctor-review`; the clinician reviews accuracy, advice, references, authorship and image permissions through the PR.
4. After explicit clinician approval set `status: approved`, `approvedAt`, `medicalReviewedAt` and reviewer. Approved is still unpublished.
5. Set `published`, choose publishedAt, and verify author/reviewer records. Run checks, build and tests; review the generated route and metadata. Merge only the approved document. Build publication does not authorize a production deployment.
6. For revisions set updatedAt and obtain medical review again. To withdraw, set draft and rebuild.

Frontmatter structure (documentation only; not a publishable medical article):

```yaml
title: <doctor-approved title>
slug: <unique-lowercase-slug>
category: Preventive Care
excerpt: <doctor-approved summary>
author: <verified-author-file-id>
reviewer: <verified-reviewer-file-id>
publishedAt: YYYY-MM-DD
updatedAt: YYYY-MM-DD
medicalReviewedAt: YYYY-MM-DD
approvedAt: YYYY-MM-DD
featuredImage: ../../assets/<approved-image>.jpg
imageAlt: <meaningful image description>
sources:
  - title: <source title>
    url: https://<verified-reference>
relatedArticles: []
seo:
  title: <unique title>
  description: <accurate description>
status: draft
```

Categories: Pregnancy, PCOS, Menstrual Health, Fertility, Menopause, Preventive Care, Women’s Wellness. Dates used for publication/approval/review must be no later than build time. Reading time is estimated at 200 words/minute. References to unrelated or withdrawn articles never become public links. MDX is trusted repository code: accept authorship only from trusted maintainers, review imports and avoid third-party embeds or interactive scripts.
