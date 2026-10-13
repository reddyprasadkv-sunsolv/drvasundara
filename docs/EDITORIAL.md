# Reviewed editorial publication

Use Draft → Medical Review → Approved → Published. Doctor-review remains a legacy accepted status. The 12 current MDX records are AI-assisted articles assembled from the reviewed service prose and published after the user confirmed Dr. Vasundara’s review on 13 October 2026. They are not described as personally doctor-authored. Complete their clinical prose and genuine attribution before changing contentType to article. See MEDICAL_CONTENT_APPROVAL.md for the full handoff and SEO_CONTENT_STRATEGY.md for reference policy.

Create truthful author records under src/content/authors. Verified identity requires verificationRecord. A medical reviewer must be a verified Person, canReviewMedicalContent=true, with a recorded actual review confirmation. Registration details are displayed only if separately supplied and verified. Never mark the AI planning identity as a physician or reviewer.

Article metadata includes title, slug, category, excerpt, author, authorship (doctor-authored/staff-authored/ai-assisted), authorshipConfirmed, contentType (outline/article), introduction, takeaways, medicalFaqs with reviewed flags, references, relatedArticles, relatedServices, SEO, status and optional image/alt. Genuine publishedAt, medicalReviewedAt, approvedAt and reviewer become required only for publication; updatedAt is used for a genuinely updated version. Dates cannot be invented or future-dated. Check src/content.config.ts for exact schema.

Routes, listings, related links and sitemap share the same publication filter. Approved alone does not publish. Reviewed FAQs and complete prose are mandatory. Keep MDX trusted: review imports and scripts; accept changes only from trusted maintainers. An inline article medical disclaimer is part of the future template. No standalone disclaimer page was restored.

Run pnpm check, pnpm build, pnpm test and pnpm review:export. Public-page approval does not authorize production indexing or domain deployment. See the clinic approval checklist before editing a publication flag.
