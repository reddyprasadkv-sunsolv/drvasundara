# Typography review and validation — 15 October 2026

Baseline: merged main `3298554565124859cd20c60e4b2c80ed12c33fd8`. Changes on `codex/typography-readability`. Source changes are limited to `src/styles/global.css` and the homepage’s scoped eyebrow CSS. No publishing, DNS, hosting, indexing or deployment setting changes.

## Changes

- Keep Playfair Display headings/editorial emphasis and Open Sans body, navigation and controls, with existing colors, section grids, images and content.
- Standardize small eyebrows at 12 px, CTA/text links and navigation at 14 px, supporting captions at 13 px, and footer/caption labels at least 12 px. Labels/buttons use existing 600 weight; navigation/body retain 400.
- Balance heading wrapping to avoid orphan words, allow long words to wrap rather than overflow, and permit existing grid text cells to shrink. Preserve the homepage responsive font scale; increase its line height from 1.18 to 1.2.
- Scale page/service titles between 32 and 38 px on narrow screens rather than forcing 38 px; let philosophy-strip text wrap rather than shrink to 8–9 px. These are text-reflow adjustments, not a grid redesign.
- Keep all existing self-hosted font imports and font-display: swap. No dependency or font-file changes. Screen-only refinements preserve existing print styles.

## Before/after computed measurements

Pixel sizes measured from actual styled local builds. Values are computed CSS px; they are not inferred from earlier stylesheet declarations, many of which are overridden later.

| Element | 320 px before → after | 375 px before → after | 768 px before → after | 1024 px before → after | 1440 px before → after |
| --- | --- | --- | --- | --- | --- |
| Navigation | 13px → 14px (hidden) | 13px → 14px (hidden) | 13px → 14px (hidden) | 13px → 14px | 14px → 14px |
| Homepage CTA | 13px → 14px | 13px → 14px | 14px → 14px | 14px → 14px | 14px → 14px |
| Homepage text link | 13px → 14px | 13px → 14px | 14px → 14px | 14px → 14px | 14px → 14px |
| Homepage specialty eyebrow | 11px → 12px | 11px → 12px | 12px → 12px | 12px → 12px | 12px → 12px |
| Section eyebrow | 10px → 12px | 10px → 12px | 11px → 12px | 11px → 12px | 11px → 12px |
| Portrait eyebrow | 9px → 12px | 9px → 12px | 9px → 12px | 9px → 12px | 9px → 12px |
| Portrait supporting caption | 12px → 13px | 12px → 13px | 10px → 13px | 11px → 13px | 11px → 13px |
| Philosophy strip | 8px → 12px | 9px → 12px | 12px → 12px | 12px → 12px | 12px → 12px |
| Footer contact link | 12px → 14px | 12px → 14px | 12px → 14px | 12px → 14px | 12px → 14px |
| Footer supporting text | 11px → 12px | 12px → 12px | 12px → 12px | 12px → 12px | 12px → 12px |
| Homepage H1 | 30px → 30px | 30.75px → 30.75px | 30.72px → 30.72px | 41.984px → 41.984px | 59.04px → 59.04px |
| Body | 16px → 16px | 16px → 16px | 16px → 16px | 16px → 16px | 16px → 16px |

Homepage H1 line height at 375 px: 36.285 → 36.9 px; at 1440 px: 69.667 → 70.848 px. Section eyebrow line height at 375 px: 16 → 19.2 px. Mobile CTA: 19.5 → 22.4 px. Urogynecology H1 at 375 px: 38 → 37.5 px; the journal article H1 remains 35.2 px.

## Tests and limits

- Astro check: 82 files, zero errors/warnings/hints. Both root and GitHub Pages project-preview builds pass all 23 existing tests plus build, clinical approval, editorial, journal, schema, sitemap and link verification (59 HTML documents / 58 public pages / 28 canonical services).
- Root responsive layout: all 58 public pages at 320, 375, 768, 1024 and 1440 px: 290 checks, no horizontal document overflow or heading-box clipping. Project-preview: 174 checks across all 58 public pages at 375, 768 and 1440 px, also clear.
- WCAG text-spacing stress: all 58 pages at 320 px with line height 1.5, letter spacing 0.12em, word spacing 0.16em and paragraph spacing 2em: no document overflow or clipped heading boxes. This is not a browser-zoom or screen-reader certification.
- Axe-core WCAG 2 A/AA and 2.1 A/AA: 42 runs across 14 representative templates at 375/768/1440 px; zero automated violations. Color-contrast checks were incomplete in 31 runs and need manual assessment; no full accessibility-compliance claim. Screenshots were inspected separately.
- Mobile menu opens; Escape closes and restores summary focus. Journal PCOS query returns one article, nonexistent query shows the empty state, reset restores twelve results. No WhatsApp message sent.
- Before/after comparison of all 59 HTML documents confirms unchanged text, metadata, canonical links, structured data, navigation/media URLs and media attributes. All twelve emitted WOFF/WOFF2 files match byte-for-byte. CSS filenames and scoped style hashes naturally change.
- Single paired Lighthouse laboratory runs, local HTTP, default simulated mobile and desktop presets; timings vary between runs. No field Core Web Vitals or INP claim.

| Performance measurement | Mobile before → after | Desktop before → after |
| --- | --- | --- |
| Performance score | 98 → 97 | 100 → 100 |
| Largest Contentful Paint | 2.328 s → 2.338 s | 0.504 s → 0.531 s |
| Cumulative Layout Shift | 0.038 → 0.039 | 0 → 0.002 |
| Total Blocking Time | 0 ms → 0 ms | 0 ms → 0 ms |
| Transferred bytes | 275248 B → 276286 B | 249465 B → 250503 B |

Both before and after load the same four font resources on the tested homepage. The final change adds approximately 1 KB of transferred page/CSS output. Mobile LCP remains approximately 2.34 s, TBT is zero and desktop performance remains 100. The one-point mobile score decrease is reported rather than concealed; single paired runs cannot establish statistical equivalence.

## Screenshot review steps

1. Homepage on mobile and desktop — readable CTA/eyebrow sizes and balanced headings; colors and two-column desktop structure preserved.
2. Urogynecology service on mobile — approved title and body unchanged; heading and CTA fit without clipping.
3. Journal article on mobile — existing reading scale preserved; byline/caption support remains legible.
4. Production homepage — verification fails because the deployed stylesheet does not load; see below.

## Production verification — separate existing issue

Read-only browser navigation to https://drvasundaragynec.com/ reached https://www.drvasundaragynec.com/. Its stylesheet URL was https://www.drvasundaragynec.com/drvasundara/_astro/Base.Dfe7WCYR.css and `link.sheet` was absent. Visible navigation targets also contained `/drvasundara/`. Text rendered in the Times fallback rather than the intended font families. This indicates a deployed asset/base-path problem; DNS or hosting causes were not established. The changed typography cannot be verified as deployed because it has not been published. No attempt was made to fix deployment settings or URLs, as requested.

## Visual evidence

The screenshots below are local audit evidence saved under ignored `qa/typography/`; they are not bundled into the website.

### Homepage mobile

Before:
![Before Homepage mobile](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/before-mobile.png)

After:
![After Homepage mobile](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/after-mobile.png)

### Homepage desktop

Before:
![Before Homepage desktop](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/before-desktop.png)

After:
![After Homepage desktop](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/after-desktop.png)

### Urogynecology mobile

Before:
![Before Urogynecology mobile](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/before-service-mobile.png)

After:
![After Urogynecology mobile](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/after-service-mobile.png)

### Article mobile

Before:
![Before Article mobile](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/before-article-mobile.png)

After:
![After Article mobile](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/after-article-mobile.png)

### Production read-only observation

![Production missing stylesheet](/Users/reddyprasadkv/Documents/ChatGPT/Dr Vasundhara/premium-website/qa/typography/production-before.png)

Raw computed measurements, responsive matrices, axe results and Lighthouse JSON files are saved beside the screenshots.
