# Dr. Vasundara Cheepurupalli — Phase 2

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
- `src/pages`: home, doctor profile, service index/detail, journal index/article, FAQs, contact, appointment guide, privacy information, 404 and robots endpoint.
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

Lavender `#CDB4DB`, blush `#FFC8DD`, rose `#FFAFCC`, sky `#BDE0FE` and blue `#A2D2FF`, with deep plum text `#352C46` and accent `#554165` for accessible contrast. Playfair Display headings and Open Sans text are self-hosted with font-display swap. Body text starts at 16px with a 1.75 line height. Fluid heading/spacing scales, original line botanicals, offset rectangular portrait framing, alternating editorial compositions and understated motion establish the visual identity. There are no animation frameworks or client islands.

Small screens use an independent single-column hero, compact header and native disclosure navigation. Tablet and desktop progressively expand to asymmetric two-column layouts. The content width is capped for ultrawide displays. Focus states, a skip link, native FAQ disclosures, Escape-to-close navigation and reduced-motion rules are included.

## Clinic configuration

Edit `src/config/site.ts`. Leave unknown values empty. Qualifications, specialization, experience, clinical approach, telephone, email, address, map and verified social links render only when supplied. The original portrait was copied from the existing client workspace, whose image notes identify it as client-selected. No AI-edited portrait is used. Set `doctor.portraitApproved=false` for the neutral, botanical monogram fallback; the layout stays intact.

Services are schema-validated from src/data/services.json. Twenty-nine approved entries across six groups have confirmed availability, reviewed clinical sections and recorded approval; two aliases leave 27 canonical service pages. Two aliases avoid duplicate pages. Profile and local practice data have separate evidence/approval gates; unknown data remain hidden. FAQs live in src/data/faqs.ts.

## Editorial workflow

See [editorial guide](docs/EDITORIAL.md) and [clinic approval checklist](docs/MEDICAL_CONTENT_APPROVAL.md). Twelve AI-assisted journal articles assembled from reviewed service prose are published following the confirmed 13 October 2026 medical review. Actual article authorship, verified reviewer identity and recorded review confirmation, complete content and real approval/review/publication dates are mandatory. Routes, lists, related links and sitemap use shared approval filters. Run pnpm review:export for a private local service/profile review pack.

## Appointments

See [clinic form guide](docs/APPOINTMENTS.md). Set `appointmentFormUrl` to an HTTPS `forms.gle` URL or `docs.google.com/forms/…` URL. The reusable button opens configured forms in a new tab with noopener/noreferrer and a screen-reader notice. If unavailable or invalid, it opens the information page, where unavailability is stated plainly. There is no embedded form, backend or patient data storage.

## Search foundations

Unique titles/descriptions, production canonical URLs, Open Graph and X metadata, sitemap, breadcrumbs, WebSite schema and reviewed BlogPosting metadata are implemented. The social image is a local raster preview. Clinic/Physician/Organization schema utilities exist but are not emitted without verified data. All pages currently carry noindex/nofollow and robots disallows crawling because production cutover is unapproved. Set `productionIndexing=true` only during approved cutover. The 404 remains noindex. Search features are foundations, not promises of rich results or AI citations.

## GitHub Pages and production safety

GitHub Actions deploys only the authorized GitHub Pages preview, on a deliberate change to .github/pages-deployment-request.json or approved manual dispatch. The artifact uses /drvasundara/ and removes CNAME. Normal source pushes run validation. Production domain, DNS, WordPress and indexing remain unchanged. See the preview instructions below.

Stack references: [Astro Tailwind setup](https://docs.astro.build/en/guides/styling/), [content loader API](https://docs.astro.build/en/reference/content-loader-reference/), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Still needed from the doctor/clinic

Verified professional profile and final portrait approval; approved service content and FAQs; reviewed journal content, author/reviewer details and references; clinic address/contact/map/socials; clinic-owned Google Form and consent policy; privacy contact and retention rules; explicit production cutover authorization.

Phase 2 adds medical drafts, approval governance and search foundations. Read the four Phase 2 reports in docs; medical publication is approved for the preview; production cutover remains pending.

## Patient experiences

User-authorized existing videos are configured in `src/data/testimonials.ts`. Three featured videos appear on the homepage; `/testimonials/` contains all five distinct videos, with a footer link. Local graphic previews avoid third-party requests until clicked. The privacy-enhanced player has no autoplay; direct YouTube links work without JavaScript. No written testimonials or education videos were imported. See the delivery report addendum for verification limits.

## Approved GitHub Pages preview deployment

The user approved deployment to `https://reddyprasadkv-sunsolv.github.io/drvasundara/` while preserving the existing WordPress domain. Set Pages source to GitHub Actions and leave Custom domain empty. The Pages workflow runs only on a manual approved dispatch or a deliberate update to `.github/pages-deployment-request.json`; normal source pushes run validation only.

The preview build sets `PAGES_PREVIEW=true` for Astro's asset base, then `scripts/prepare-pages-preview.mjs` prefixes internal navigation and removes CNAME from the artifact. Test it with `PAGES_PREVIEW=true pnpm build`, `node scripts/prepare-pages-preview.mjs`, and `VERIFY_PAGES_PREVIEW=true pnpm test`. Production builds still use the original production site configuration. Preview crawling remains disabled.

## Phase 3 journal

See docs/PHASE3_HANDOFF.md and EDITORIAL_WORKFLOW.md. The journal has seven topic collections, published-only local search, separate authorship/review/assistance, readable article controls and a reviewer profile. Run pnpm journal:report for the ignored local status report; pnpm journal:new my-topic creates an unpublished draft. Publication dates and clinical prose remain unchanged; substantive updates need actual medical review.
