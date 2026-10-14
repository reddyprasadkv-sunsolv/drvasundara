# Phase 4 GEO and AI search readiness

SEO prepares accessible, useful pages for traditional search; GEO/AIO here describes clarity and attribution for answer systems. Crawl access, index inclusion and actual citation visibility are distinct. Noindex preview traffic cannot establish citation performance. Schema, machine-readable summaries or crawler permissions do not guarantee ranking/citation.

Current readiness: static public HTML includes definitions, summaries, FAQs, named clinician review, truthful dates, references and curated topic links. One canonical doctor identity and explicit editorial publisher reduce identity ambiguity. Clinical shortcomings are queued for renewed review rather than expanded with generic AI-oriented prose.

Official documentation checked 14 October 2026:

- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features): normal SEO practices apply; no special AI markup or machine-readable file required.
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots): OAI-SearchBot concerns search, GPTBot concerns training; user-triggered access is separate. Decisions should distinguish these roles.
- [Bing crawlers](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0): Bingbot crawl policy applies to discoverability; Bing index inclusion is not automatic.
- [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): PerplexityBot is for search discovery, distinct from user-triggered retrieval. Confirm published IP ranges before changing a firewall.

Preview: every HTML page noindex and project robots artifact disallows. The project's robots artifact is below the host root, so it cannot establish host-wide bot policy. No explicit bot allow rules are added. Production remains blocked pending a separate launch. At launch, clinic/owner decides search crawl access versus model-training access; test Cloudflare bot/WAF behavior using authenticated crawler evidence, not only spoofable user-agent strings. Do not blanket whitelist AI crawlers or weaken security to chase citations.

llms.txt is optional agent documentation, not a demonstrated ranking method. Not added: HTML, source attribution and canonical/identity correctness already convey the useful facts. Reconsider only for a concrete consumer requirement.

Measurement after launch: Search Console impressions/clicks and actual query inspection; Bing/Copilot account reporting where available; direct observed citation URLs with timestamps. No invented AI visibility, rankings or regulatory certification.
