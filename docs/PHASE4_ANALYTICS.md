# Phase 4 search verification and analytics readiness

No analytics loaded, no consent banner fabricated, no measurement ID invented, no form submissions captured. `data-contact-channel` is a static integration hook (whatsapp/form), not an event sender. No sensitive prefilled WhatsApp message.

## Search Console

After separately authorized production launch: use [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080). Prefer existing verified Domain property if clinic owner has it. A new DNS TXT method needs separate DNS authorization; do not alter DNS during Phase 4. URL-prefix HTML meta method is prepared through the actual `PUBLIC_GOOGLE_SITE_VERIFICATION` build value. Supply only the token value, rebuild the production-root artifact, and confirm it at the exact production URL before clicking Verify. The template escapes the value; it is not a secret or JavaScript snippet. Preview suppresses verification meta even if configured. Do not submit the preview sitemap. After launch, submit production `/sitemap-index.xml` and inspect representative URLs.

## Bing Webmaster Tools

Use authorized site owner account and the actual meta token as `PUBLIC_BING_SITE_VERIFICATION`. The generated root HTML emits msvalidate.01; preview suppresses it. No token is currently configured. Account-level import from Search Console is an alternative if already authorized. No account access or verification result is claimed.

## GA4 proposal — disabled

Create/use a clinic-approved GA4 property only after privacy/consent assessment. No runtime GA code is added now. Medical-service page paths/titles can reveal health interests even without names; default page_view and enhanced measurement must not be enabled blindly. Decide whether a narrowly scoped aggregate counter without third-party user identifiers is preferable.

Allowed prospective event payload: action type (whatsapp/form/phone/service-navigation/journal-engagement) and coarse placement (header/page/floating). Do not transmit medical topic, full route/title, query string, fragment, journal search term, destination telephone, symptom, name, phone, report, note, patient identifier or cross-site identity. Disable outbound-link auto-collection and form interactions unless reviewed. Consent must precede network requests; withdrawing consent stops transmission. Don't use consent-mode cookieless pings as a substitute for a clinic-approved policy.

Actual IDs, retention, authorized access, deletion/contact policy and consent requirements are clinic decisions. Documentation is preparation, not a tracking implementation or legal compliance certification.
