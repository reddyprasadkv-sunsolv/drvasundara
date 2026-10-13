# Dr. Vasundhara Gynec — Phase 0 + Phase 1

A static, doctor-led women’s healthcare website, built with Astro 7, Tailwind CSS 4, strict TypeScript 6 and MDX. Production origin: https://drvasundaragynec.com. Official repository: https://github.com/reddyprasadkv-sunsolv/drvasundara.git. Work is on `main`.

## Run locally

Use Node 22.12+ (Node 24 recommended) and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the printed local URL. Validation and static preview:

```sh
pnpm check
pnpm build
pnpm test
pnpm preview
```

Set `ASTRO_TELEMETRY_DISABLED=1` if you prefer no Astro telemetry. Dependencies are lockfile-pinned; TypeScript 6 is used because the current Astro checker does not support TypeScript 7.

## Architecture

- `src/components/layout`: semantic sticky header, accessible mobile navigation and footer.
- `src/components/ui`: appointment links, breadcrumbs and original botanical SVG.
- `src/components/seo`: page metadata.
- `src/components/medical`: portrait, approved service list, editorial previews, FAQs and appointment section.
- `src/layouts`: shared document shell and editorial inner-page layout.
- `src/pages`: home, doctor profile, service index/detail, journal index/article, FAQs, contact, appointment guide, privacy information, disclaimer, 404 and robots endpoint.
- `src/content`: schema-validated local blog and author collections.
- `src/config`: clinic configuration, navigation, production origin and indexing switch.
- `src/data`: approved FAQ and service data; proposed service categories stay unpublished.
- `src/styles`: CSS/Tailwind theme tokens and responsive design.
- `src/utils`: publication filters, form allowlist, reading time and structured data.
- `src/assets`: locally supplied original doctor portrait, optimized during builds.
- `public/images`, `public/icons`, `public/fonts`: static media slots; actual font files are bundled from Fontsource.
- `scripts`: editorial/security boundary tests and generated-site link/metadata verification.
- `.github/workflows`: validation and gated manual Pages deployment.

## Design system

Lavender `#CDB4DB`, blush `#FFC8DD`, rose `#FFAFCC`, sky `#BDE0FE` and blue `#A2D2FF`, with deep plum text `#352C46` and accent `#554165` for accessible contrast. Playfair Display headings and Open Sans text are self-hosted with font-display swap. Body text starts at 16px with a 1.75 line height. Fluid heading/spacing scales, original line botanicals, arched portrait framing, alternating editorial compositions and understated motion establish the visual identity. There are no animation frameworks or client islands.

Small screens use an independent single-column hero, compact header and native disclosure navigation. Tablet and desktop progressively expand to asymmetric two-column layouts. The content width is capped for ultrawide displays. Focus states, a skip link, native FAQ disclosures, Escape-to-close navigation and reduced-motion rules are included.

## Clinic configuration

Edit `src/config/site.ts`. Leave unknown values empty. Qualifications, specialization, experience, clinical approach, telephone, email, address, map and verified social links render only when supplied. The original portrait was copied from the existing client workspace, whose image notes identify it as client-selected. No AI-edited portrait is used. Set `doctor.portraitApproved=false` for the neutral, botanical monogram fallback; the layout stays intact.

Services live in `src/data/services.ts`. The seven proposed categories are not advertised as available. Approval plus nonempty doctor-approved body copy is required for a public service route. FAQs live in `src/data/faqs.ts`; only `approved:true` records render. No reviews, statistics, affiliations or credentials were fabricated.

## Editorial workflow

See [editorial guide](docs/EDITORIAL.md). Draft → Doctor Review → Approved → Published. A publication also requires approvedAt, medicalReviewedAt, a reviewer, sources, verified author/reviewer records and a publication date that is not in the future. Approved but unscheduled/unpublished drafts do not get pages. Routes, homepage previews, journal listings, related links and sitemaps use the same filter. No medical articles are included in this foundation.

## Appointments

See [clinic form guide](docs/APPOINTMENTS.md). Set `appointmentFormUrl` to an HTTPS `forms.gle` URL or `docs.google.com/forms/…` URL. The reusable button opens configured forms in a new tab with noopener/noreferrer and a screen-reader notice. If unavailable or invalid, it opens the information page, where unavailability is stated plainly. There is no embedded form, backend or patient data storage.

## Search foundations

Unique titles/descriptions, production canonical URLs, Open Graph and X metadata, sitemap, breadcrumbs, WebSite schema and reviewed BlogPosting metadata are implemented. The social image is a local raster preview. Clinic/Physician/Organization schema utilities exist but are not emitted without verified data. All pages currently carry noindex/nofollow and robots disallows crawling because production cutover is unapproved. Set `productionIndexing=true` only during approved cutover. The 404 remains noindex. Search features are foundations, not promises of rich results or AI citations.

## GitHub Pages and production safety

Validation runs on main pushes and PRs. Deployment has no push trigger. It requires all of:

1. Explicit production cutover approval.
2. Repository variable `PRODUCTION_CUTOVER_APPROVED=true`.
3. Manual dispatch on main with the exact approval input `APPROVED`.

Before enabling it, configure required reviewers on the `github-pages` environment and confirm the approved domain/hosting plan. The variable is absent by default, so deployment jobs are skipped. `public/CNAME` prepares the custom domain locally; no DNS or hosting change was performed. No Cloudflare, GoDaddy or WordPress settings were changed. The privacy page is transparent foundation copy and needs clinic approval before public launch.

Stack references: [Astro Tailwind setup](https://docs.astro.build/en/guides/styling/), [content loader API](https://docs.astro.build/en/reference/content-loader-reference/), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Still needed from the doctor/clinic

Verified professional profile and final portrait approval; approved service content and FAQs; reviewed journal content, author/reviewer details and references; clinic address/contact/map/socials; clinic-owned Google Form and consent policy; privacy contact and retention rules; explicit production cutover authorization.

This delivery stays within Phase 0 and Phase 1. No later-phase medical content, search campaign, migration or production cutover is included.

## Patient experiences

User-authorized existing videos are configured in `src/data/testimonials.ts`. Three featured videos appear on the homepage; `/testimonials/` contains all five distinct videos, with a footer link. Local graphic previews avoid third-party requests until clicked. The privacy-enhanced player has no autoplay; direct YouTube links work without JavaScript. No written testimonials or education videos were imported. See the delivery report addendum for verification limits.

## Approved GitHub Pages preview deployment

The user approved deployment to `https://reddyprasadkv-sunsolv.github.io/drvasundara/` while preserving the existing WordPress domain. Set Pages source to GitHub Actions and leave Custom domain empty. The Pages workflow runs only on a manual approved dispatch or a deliberate update to `.github/pages-deployment-request.json`; normal source pushes run validation only.

The preview build sets `PAGES_PREVIEW=true` for Astro's asset base, then `scripts/prepare-pages-preview.mjs` prefixes internal navigation and removes CNAME from the artifact. Test it with `PAGES_PREVIEW=true pnpm build`, `node scripts/prepare-pages-preview.mjs`, and `VERIFY_PAGES_PREVIEW=true pnpm test`. Production builds still use the original production site configuration. Preview crawling remains disabled.
