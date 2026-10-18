# Priority 3–5 SEO, GEO/AIO, enquiry attribution and Google Business Profile work plan

Prepared: 17 October 2026. Editorial and implementation review only. This document does not authorize new medical claims, patient data processing, GBP posts, reviews or photo uploads.

## 1. Medical FAQ / AI-search discoverability
- `/faqs/` now links to the existing clinician-reviewed PCOS, high-risk pregnancy, menopause, urogynecology, laparoscopic-surgery and robotic-surgery service pages.
- Preserve all reviewed wording, published review dates, existing person/medical schemas and page URLs. Avoid duplicating FAQs or adding special FAQ schema solely to target AI summaries.
- Before any substantial new Q&A is published, clinic reviewer should approve question, answer, supporting clinical source, and review timestamp.
- Measure improvements with Search Console query/page impressions and clicks over time, not a claimed AI ranking.

## 2. Review response workstream — drafts awaiting explicit per-reply approval
Connected GBP review inventory queried for 1 August–17 October 2026: 27 reviews, including two one-star reviews, with no owner replies returned. Avoid storing reviewer names, review IDs, symptoms, diagnoses or quotes in the public repository.
- Negative review response A (concerns about communication/team): “Thank you for sharing your concerns. We take feedback about attentiveness and communication seriously. We would welcome the opportunity to review your concerns privately. Please contact the clinic using the official contact information on this profile.”
- Negative review response B (concerns about consultation expectations): “Thank you for raising your concerns. Clear information about consultations and doctor availability is important. We would appreciate an opportunity to review your feedback privately. Please contact the clinic through the official details shown here.”
- Positive reviews: use individual short replies without confirming patient status or discussing treatments: “Thank you for taking the time to share your feedback. We appreciate your kind words and encouragement.”
- Two complaint themes merit private operational review before any public response. Never demand removal of an unfavorable review or imply treatment facts.

## 3. New medical journal editorial briefs — no auto-publication
Three candidate topics based on existing reviewed services and local search intent. Avoid duplicating existing 12 journal articles: inspect titles/slugs before selecting the final topics.
| Proposed topic | Main question | Existing service link | Reviewer notes |
| --- | --- | --- | --- |
| When to discuss persistent or unusual uterine bleeding | Which changes warrant assessment and which are urgent? | `/services/abnormal-uterine-bleeding/` | Clinical reviewer to confirm red flags, contraindications, investigations, evidence and safety wording |
| Menopause symptoms: preparing for a gynecology consultation | What should someone record and ask about? | `/services/menopause-care/` | Review individual variability, alarm symptoms and guideline references |
| Urogynecology: discussing bladder control and pelvic support concerns | What can be raised in a consultation? | `/services/urogynecology-consultation/` | Review non-diagnostic language, treatment scope and evidence |

Do not publish any draft as medically reviewed without the doctor's actual sign-off. Include dated authoritative clinical references (e.g. professional societies / national or international clinical guidelines) verified at authoring time.

## 4. WhatsApp enquiry attribution — privacy first
- Current website uses WhatsApp enquiry rather than on-site booking. Do not claim that clicking WhatsApp proves a completed enquiry or appointment.
- First perform a read-only audit of where the existing WhatsApp links are generated, any privacy/consent and analytics instrumentation already present, and current configuration. Do not add GA4/GTM or external tracking automatically.
- Subject to explicit clinic approval, propose privacy-respecting *aggregate outbound WhatsApp click events*, indicating source page and CTA only, without phone-number identifiers, message text, names, clinical conditions, IP addresses or diagnoses. Never put page-specific medical topics into the outgoing WhatsApp text for attribution.
- Separately measure GBP website clicks (Google's reporting) and Search Console organic clicks. Do not add them together as distinct people or appointments.
- Report click events, actual clinic-confirmed enquiries (only if available in an authorized secure reporting system) and confirmed bookings as separate stages. Establish consent/privacy policy and retention details before analytics changes.

## 5. GBP educational posts — drafts only
These drafts must be reviewed clinically and approved for release before any connector write action.
- **PCOS/PCOD:** “Questions about irregular periods or PCOS? Our reviewed guide explains common consultation topics and when individualized assessment may help. Read more: https://www.drvasundaragynec.com/services/pcos/”
- **Menopause:** “Changes during midlife can prompt questions about periods, symptoms and wellness. Review our menopause-care guide and prepare questions for a consultation: https://www.drvasundaragynec.com/services/menopause-care/”
- **Appointments:** “Dr. Vasundara Cheepurupalli consults at KIMS Hospital, Secunderabad. Enquire about appointment arrangements on the official website; consultation availability requires confirmation: https://www.drvasundaragynec.com/appointment/”
- For older posts making medical effectiveness, numerical success rate, autism-causation or vaccination claims, first verify clinical sources and approve specific corrections; do not silently edit.

## 6. Photos — read-only asset checklist
Connected media export returned no items for the query; this is not proof the public photo gallery is empty.
- Review the public gallery with the clinic owner; inventory existing image URLs and ownership.
- Select genuine doctor portrait, authorized entrance/wayfinding images and unoccupied clinic interiors. Hospital/photographer approval as applicable; no identifiable bystanders, medical records or treatment photographs without specific permission.
- Prepare actual asset URLs and image captions for a later separately approved upload. No AI-generated doctor or substitute clinic images.

## 7. Account-side state to preserve
- Doctor profile verified; GBP primary category Obstetrician-gynecologist, additional Gynecologist, 36 service entries after approved cleanup; profile hours Mon–Sat 09:00–17:00.
- Google still reported pending edits at last check. Re-check before submitting any further account modification. Do not edit GBP categories/services/hours again.
- Production domain https://www.drvasundaragynec.com/; latest approved sitemap inventory 54 URLs; maintain static Astro GitHub Actions publication safeguards, medical review gates, patient video restrictions and SEO verification.

## Approval gates / next actions
1. Validate new FAQ navigation in production and preview; confirm all six canonical targets exist and accessibility/test suites pass. No automatic deploy until existing authorized workflow approvals.
2. Clinic reviewer signs off new medical FAQ/article copy and posts; owner selects exact old posts to correct.
3. Owner signs off each specific public review reply before responding.
4. Clinic provides approved original photo files and verifies right to publish.
5. Owner approves an explicit, privacy-checked event-measurement plan before instrumentation.
6. Compare Google Search Console metrics after enough post-release data is available; no ranking guarantees.
