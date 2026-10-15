# Clinic privacy wording — approval draft, not public policy

Updated from project-owner confirmations on 15 October 2026. This draft is not a completed clinic privacy policy and does not establish unconfirmed procedures. The current public page remains unchanged by this preparation PR.

## Confirmed facts and proposed disclosure

Patients may voluntarily share their name, contact details, enquiry and information needed to coordinate a consultation through the clinic's official WhatsApp channel. Please share only what is necessary for the enquiry; avoid sending sensitive health information or medical records unnecessarily in an initial message. WhatsApp must not be used for medical emergencies.

WhatsApp is the clinic's only public contact channel. Enquiries are stored in the clinic's WhatsApp account. Relevant information may also be copied into hospital management software or clinic spreadsheets for enquiry handling and appointment coordination. WhatsApp is a third-party service with its own privacy practices. Hospital software or spreadsheets may involve additional service providers, depending on the clinic’s actual arrangements. This draft does not identify unconfirmed vendors or claim particular security, storage-location or access controls.

The website is a static GitHub Pages website without an on-site patient database, patient accounts, payments or medical intake. It does not introduce a public email address or new form. Privacy questions and requests for access, correction or deletion can be raised through the official WhatsApp link supplied by `src/config/site.ts` and the shared `WhatsAppContact` component. No contact number is duplicated in this draft or a new component.

The existing video disclosure remains: educational players connect to YouTube only when activated, use its privacy-enhanced domain, and are subject to external processing after activation. Five patient-experience videos remain withheld, preserving their source records.

## Exact decisions needed before final wording can be approved

| Decision | Clinic must supply |
| --- | --- |
| General WhatsApp enquiry retention | Actual duration or defensible retention criteria, when the period starts and who decides exceptions. |
| Hospital software / spreadsheet copies | Actual retention and deletion/backup handling for each destination, including exports or staff/device copies if present. |
| Record access | Which clinic staff/roles and third-party providers can access WhatsApp, hospital software, spreadsheets and related copies; identify actual arrangements without exposing credentials or patient records. |
| Request handling | Responsible role, how a WhatsApp request is verified, reviewed and acted on for access/correction/deletion across all destinations; actual limitations, exceptions and any commitments the clinic approves. |
| Final policy approval | Clinic-approved wording reflecting these answers, approver, actual approval date and non-sensitive evidence reference. |

Do not fill these gaps with an assumed period, deletion deadline, staff restriction or safeguard. The clinic may provide accurate policy wording or instruct that a proposed claim be omitted, but an omitted public paragraph is not confirmation of the underlying practice. Keep sensitive records outside public GitHub.

## Wording reserved until the clinic supplies facts

- “We retain general WhatsApp enquiries for [clinic-confirmed period/criteria].”
- “Copies in [confirmed destination] are retained and deleted under [confirmed practice, including relevant exceptions].”
- “Access is available to [confirmed staff roles/providers] for [confirmed purposes].”
- “For a privacy request, [confirmed responsible role and actual process across the relevant systems].”

These are placeholders for clinic completion, not statements that such controls already exist. Do not publish placeholders. General “Approve all” intent is preserved separately and is not an approval of these unknown arrangements.
