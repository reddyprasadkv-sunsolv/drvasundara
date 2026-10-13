> Current status: services, professional profile and twelve journal pages are approved for preview publication following user-confirmed medical review on 13 October 2026. See [PUBLICATION_APPROVAL.md](PUBLICATION_APPROVAL.md). Any “pending” labels below describe the initial Phase 2 review; missing contact fields and production authorization remain unresolved.

# SEO, local search, GEO and AIO strategy

This preview remains noindex/nofollow with robots disallow. Production canonical URLs are retained for eventual approved migration; GitHub Pages navigation/assets use /drvasundara/. No domain cutover or indexing is authorized.

## Technical foundations implemented

Static semantic HTML, unique page titles/descriptions, one primary H1, breadcrumbs, canonical URLs, sitemap, OG/X metadata, accessible image descriptions and responsive optimized assets. Social images resolve on the preview origin with the correct base path. WebSite and BreadcrumbList are emitted where appropriate; About emits an identity-only ProfilePage/Person.

MedicalClinic, Physician and Organization builders exist but clinic/professional data are not emitted until approved. Future approved articles use BlogPosting linked to MedicalWebPage with genuine authorship, review date, references and optional image. Approved services use MedicalWebPage plus breadcrumbs. No Review/AggregateRating, fake affiliation or unsupported credential schema. JSON-LD syntax is tested; Google rich-result eligibility is not guaranteed. Definitions consulted: https://schema.org/Physician, https://schema.org/MedicalWebPage and https://developers.google.com/search/docs/appearance/structured-data/article.

## Local readiness

src/data/local-seo.json separates candidate evidence from approved public fields. Practice details require dated approval and verification evidence. Do not use the old website's phone/hours blindly. Align the clinic name, full address, phone, hours, map and Google Business Profile before adding local metadata/schema or service-location links. Exact coordinates and postcode remain empty.

Seven proposed keyword themes: Gynecologist in Secunderabad; Obstetrician in Secunderabad; Gynecologist in Hyderabad; Laparoscopic gynecological surgery in Hyderabad; Robotic gynecological surgery in Hyderabad; PCOS consultation in Hyderabad; Pregnancy care in Secunderabad. These are topic hypotheses, not measured search volumes or ranking claims. Use only those reflecting confirmed practice scope/location. No doorway city pages or duplicate location copy.

## Content architecture

Six service groups with 29 draft entries; menopause-midlife-health and contraception-counselling are aliases of existing canonical topics. Service sections give direct explanations, consultation reasons, evaluation, balanced benefits/risks and reviewed FAQs. Link only to approved relevant services/articles. Twelve outlines build patient education across PCOS terms, periods/bleeding, pregnancy, hysterectomy/robotics, cysts, fertility, menopause, ectopic pregnancy and contraception. Editorial calendar: docs/EDITORIAL_CALENDAR.json.

Prefer WHO, NICE, NHS and ACOG clinical references. References are prompts for clinician review, not evidence that AI drafts are clinically certified. Current PCOS naming differences between sources require medical resolution before publication. Claims about robotic/cosmetic procedures need particular scrutiny.

## Answer-system clarity

Plain definitions, short introductions, key takeaways, coherent H2/H3 sections, accurate FAQs, identifiable authors/reviewers, sources and consistent terminology help both readers and automated systems. No keyword repetition or AI filler. Do not promise inclusion in ChatGPT, Gemini, Perplexity or Google AI Overviews.

## Launch and monitoring

After clinic approval and separately authorized cutover: verify canonical/base behavior on the final origin, crawl links, inspect schema with current validation tools, align Google Business Profile, verify sitemap submission and Search Console ownership, review actual queries and indexing. Baseline before/after field Core Web Vitals where available; LCP ≤2.5s, CLS ≤0.1, INP ≤200ms and Lighthouse 95+ are targets. Preview SEO scores are constrained by intentional noindex. Laboratory checks cannot establish real-user INP. No analytics or third-party tracking was added.
