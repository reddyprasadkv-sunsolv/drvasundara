# Phase 4 video and image SEO

Five patient-experience records are retained (three featured on Home, five on Testimonials), distinct from five educational videos. Both use an accessible link preview and create a youtube-nocookie iframe only after a user click. No autoplay, early embed, remote thumbnail request, transcript or upload date is added. External links include noopener/noreferrer. Responsive player uses the existing stage dimensions; keyboard activation and mobile menu are tested.

Educational source: [original clinic homepage](https://drvasundaragynec.com/). Titles are neutral English descriptions of the linked topics. Telugu labels were inherited from the original source titles for four videos; independent audio-language confirmation remains a clinician task. The surgery video does not infer a language label.

| YouTube ID  | Source                                      | Relationship policy                                                 |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------- |
| pJPwOgQFKoM | https://www.youtube.com/watch?v=pJPwOgQFKoM | Curated existing services and reviewed articles; sourceUrl recorded |
| Ig__-Ekwdm0 | https://www.youtube.com/watch?v=Ig__-Ekwdm0 | Curated existing services and reviewed articles; sourceUrl recorded |
| i3gide4bnFM | https://www.youtube.com/watch?v=i3gide4bnFM | Curated existing services and reviewed articles; sourceUrl recorded |
| BcUQ70k82ZU | https://www.youtube.com/watch?v=BcUQ70k82ZU | Curated existing services and reviewed articles; sourceUrl recorded |
| WIOJjiyeFlA | https://www.youtube.com/watch?v=WIOJjiyeFlA | Curated existing services and reviewed articles; sourceUrl recorded |

Care-after-hysterectomy ↔ hysterectomy/laparoscopic hysterectomy; postpartum ↔ postnatal care and antenatal preparation; pregnancy precautions ↔ antenatal/high-risk care and guides; surgery explanation ↔ robotic/laparoscopic care and surgical guides; hysterectomy reasons ↔ hysterectomy care/guide. These are reading links, not endorsements of every statement in the videos. No automatic clinical transcript approval.

## Asset audit

Clinic hero: user-supplied illustrative image, source JPEG 180,658 bytes, Astro eager priority with 400/600/800 responsive WebP variants and explicit 4:5 dimensions. Original doctor PNG preserved and optimized by Astro; approved photograph never replaced. Botanical SVG is decorative CSS, has no screen-reader content, low transfer cost and no layout shift. Twelve topic SVGs carry neutral meaningful alt text on article pages; card images inside aria-hidden duplicate links intentionally have empty alt. Journal wellbeing JPEG remains in source from the user's earlier change but is no longer emitted after the article-specific illustration request.

Build-created article social PNGs: twelve 1200×788 files, 353,354 bytes total in this build. Existing SVG display imagery remains unchanged. Generated social files are ignored and regenerated only for eligible published records; no source image binaries or private drafts need uploading. Public social-preview.png is the existing 1200×630 fallback.

Fonts are self-hosted WOFF2 with existing swap policy, no third-party font request. New code adds no preconnect to YouTube/WhatsApp and no external contact script.

Permission: doctor photo and clinic/wellbeing images have existing user-supplied publication authorization. No independent ownership/release/licensing guarantee is inferred. Original Pexels image credits remain historical; it is no longer the public homepage hero or article visual. SVG botanical and journal illustrations were authored in this repository. Clinic should retain asset permissions/releases and review portrayal before production.

Performance observations are recorded in PHASE4_TEST_RESULTS. Actual source dimensions and generated file sizes can be reproduced from `dist`, not assumed from CSS. No field INP measurement is available.
