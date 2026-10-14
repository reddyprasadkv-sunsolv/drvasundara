# Phase 4 internal linking

Generated graph: 57 visitor HTML pages; 0 orphan visitor pages. Footer/navigation explain some inbound links; absence of orphans does not establish useful topic authority. Existing canonical aliases are excluded from public routes and retained in source. All href anchors, routes, local images and generated assets are validated.

Relationships retained: Home ↔ About and Services; 27 services ↔ curated journal reading; Journal/category pages ↔ 12 articles; articles ↔ related articles/services/reviewer profile; About/Reviewer ↔ reviewed articles; Contact/Appointment ↔ clinic conversion. Five educational videos now add curated related service and article links; test checks all relationship slugs resolve to real eligible records. No random cross-linking, keyword anchors or location doorway pages.

Link opportunities requiring content review: cosmetic consultation/vaginoplasty have no genuinely matching article; existing concise article/service pairs would benefit from different patient intents after clinical review. Avoid forcing irrelevant articles into cosmetic pages solely for link counts.

Private audit reproduction: `VERIFY_PAGES_PREVIEW=true pnpm seo:audit` after the preview build; root mode omits that variable. Node audit stores page-level links, schema types and metadata in ignored qa/phase4. Verification is part of `pnpm test` in both CI build modes. No deployment of audit JSON or approval-source inventory.
