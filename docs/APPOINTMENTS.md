# Clinic-owned Google Forms integration

Create the form in a clinic-controlled Google Workspace account. Collect only name, contact information and preferred appointment timing; avoid open-ended medical histories or uploads. Make the consent notice clear about the purpose, the clinic’s privacy contact, access and retention policy, and confirmation requirements. Provide clinic-approved wording before connecting it.

Use a clinic-managed linked Google Sheet only if needed. Limit Form and Sheet editor access to authorized clinic staff, enable account security, and avoid public response sharing. The clinic owns appointment follow-up, confirmation, access reviews and removal of records according to its approved retention policy. Nothing in this website sends, stores or reads form responses.

Put the final HTTPS Form link in `src/config/site.ts` under `appointmentFormUrl`. Supported hosts are exactly `forms.gle` and `docs.google.com` with `/forms/` paths. Test the final form in a private browser session, confirm accessibility and submission permissions, and check that the confirmation message explains clinic confirmation. Do not use a patient response as a QA fixture.

Until the URL is set, all request CTAs point to the honest appointment information page. No functioning booking promise is made. A request form is not an emergency communication channel.
