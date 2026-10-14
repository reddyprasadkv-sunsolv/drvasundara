# Phase 4 structured data

Generated JSON-LD parses on all 58 HTML files in both build modes. This is syntax and repository-contract validation, not a Google Rich Results certificate.

| Entity         | Policy                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| WebSite        | Root `/#website`, en-IN, publisher Organization and about Person                                                                      |
| Person         | Single `https://drvasundaragynec.com/#doctor`, actual approved name/title/affiliations, /about/ profile                               |
| ProfilePage    | About and medical-reviewer profile reference that same Person                                                                         |
| Organization   | `/#publisher`, website editorial name; distinct from doctor and hospitals                                                             |
| MedicalWebPage | Per-route #webpage ID; actual review date, same reviewer identity, retained references                                                |
| BlogPosting    | Editorial Organization author, publisher ID, real 2026-10-13 publication/modification dates, image PNG, category, MedicalWebPage link |
| BreadcrumbList | Sequential positions and production-root URLs, not project paths                                                                      |
| Physician      | Builder retained for future verified practice modeling; not emitted as a substitute for the individual doctor                         |
| MedicalClinic  | Not emitted with blank street address/postcode; builder assigns stable #clinic when verified                                          |
| VideoObject    | Withheld: upload dates/verified thumbnail metadata are unavailable                                                                    |

[Physician](https://schema.org/Physician) inherits Organization/MedicalBusiness semantics; using Person for the doctor's identity avoids conflating an individual with an unverified office. No registration, ratings, awards, aggregateRating, US NPI, map coordinates or new medical credentials invented.

[Google article guidance](https://developers.google.com/search/docs/appearance/structured-data/article) describes useful author/date/image properties. The website Organization is retained as the editorial author; a medical reviewer is not promoted to personal author. [Video guidelines](https://developers.google.com/search/docs/appearance/structured-data/video) require accurate supported video facts; a YouTube link alone does not justify fabricated upload metadata. Public video transcripts not supplied.

The automated checks verify IDs, author type, source-backed dates, canonical-path identity and raster image file availability. External Google validation and Search Console URL Inspection remain Phase 5 tasks because this preview is deliberately blocked/noindex. No rich-result guarantee.
