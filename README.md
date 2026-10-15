# Dr. Vasundara Gynec

Static Astro website. Production: https://www.drvasundaragynec.com/ . GitHub repository: https://github.com/reddyprasadkv-sunsolv/drvasundara . Latest GitHub `main` is the integration source of truth.

Development integration, automated validation, artifact creation and deployment run through GitHub feature branches, pull requests and Actions. See [the workflow guide](docs/GITHUB_WORKFLOW.md). No manual deployment from a Mac, terminal, FTP, SSH or GoDaddy is required. Optional local editing/testing is not a deployment prerequisite.

The production workflow validates production and preview builds, Astro/TypeScript, SEO, schema, internal links, publication gates and responsive accessibility before deploying the verified static artifact to the existing GitHub Pages environment. No new hosting, backend, DNS or custom-domain configuration is introduced.

The premium design, self-hosted Playfair Display/Open Sans, 28 services, 12 articles, five educational videos and current URLs remain intact. WhatsApp is the only public clinic contact channel, configured in `src/config/site.ts` and reused through shared components. Five patient-experience videos are withheld under the latest indexing-release instruction; source records remain preserved. The approved release enables production indexing for eligible pages; preview remains noindex and disallows crawling.

Publication records: [clinic decision sheet](docs/CLINIC_PUBLICATION_APPROVAL_CHECKLIST.md), [privacy approval draft](docs/CLINIC_PRIVACY_POLICY_DRAFT.md), [existing clinical approval](docs/PUBLICATION_APPROVAL.md), [scoped Urogynecology approval](docs/UROGYNECOLOGY_PUBLICATION_APPROVAL.md). Do not store sensitive records in this public repository.

The approved 16 October indexing release withholds the five patient videos under the latest instruction and retains intentional page exclusions. See [release preparation](docs/INDEXING_RELEASE_PREPARATION.md).
