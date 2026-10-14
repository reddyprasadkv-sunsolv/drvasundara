import { defineCollection, reference } from 'astro:content';
import { z } from 'zod';
import { editorialDate } from './utils/date-fields';
import { glob } from 'astro/loaders';
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z
    .object({
      name: z.string(),
      role: z.string(),
      verificationRecord: z.url().optional(),
      reviewConfirmationRecord: z.url().optional(),
      medicalRegistration: z
        .object({
          number: z.string().min(1),
          authority: z.string().min(1),
          verified: z.boolean(),
        })
        .optional(),
      verified: z.boolean().default(false),
      canReviewMedicalContent: z.boolean().default(false),
      entityType: z.enum(['Person', 'Organization']).default('Person'),
      qualifications: z.array(z.string()).default([]),
      profileUrl: z.string().optional(),
    })
    .superRefine((author, ctx) => {
      if (author.verified && !author.verificationRecord)
        ctx.addIssue({
          code: 'custom',
          message: 'Verified authors require an identity verification record.',
        });
      if (
        author.canReviewMedicalContent &&
        (!author.verified ||
          author.entityType !== 'Person' ||
          !author.reviewConfirmationRecord)
      )
        ctx.addIssue({
          code: 'custom',
          message:
            'A medical reviewer requires verified identity and a recorded review confirmation.',
        });
    }),
});
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        governanceVersion: z.literal(3).optional(),
        authorId: z.string().optional(),
        reviewerId: z.string().optional(),
        approvedBy: z.string().optional(),
        approvalRecord: z.url().optional(),
        lastUpdated: editorialDate.optional(),
        nextReviewDueAt: editorialDate.optional(),
        editorialAssistance: z.string().optional(),
        editorialStatus: z
          .enum([
            'draft',
            'medical-review',
            'doctor-review',
            'approved',
            'published',
          ])
          .optional(),
        clinicalDisclaimer: z.string().optional(),
        journalCategory: z
          .enum([
            'pregnancy-obstetrics',
            'menstrual-health',
            'pcos-hormonal-health',
            'fertility-reproductive-health',
            'gynecological-surgery',
            'menopause-midlife-health',
            'preventive-healthcare',
          ])
          .optional(),
        featured: z.boolean().default(false),
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        category: z.enum([
          'Pregnancy',
          'PCOS',
          'Menstrual Health',
          'Fertility',
          'Menopause',
          'Preventive Care',
          'Women’s Wellness',
        ]),
        excerpt: z.string(),
        contentType: z.enum(['outline', 'article']).default('outline'),
        authorship: z
          .enum(['doctor-authored', 'staff-authored', 'ai-assisted'])
          .default('staff-authored'),
        authorshipConfirmed: z.boolean().default(false),
        introduction: z.string().default(''),
        keyTakeaways: z.array(z.string()).default([]),
        medicalFaqs: z
          .array(
            z.object({
              id: z.string().optional(),
              kind: z
                .enum([
                  'article',
                  'general-medical',
                  'service',
                  'administrative',
                ])
                .optional(),
              question: z.string(),
              answer: z.string(),
              reviewed: z.boolean().default(false),
            }),
          )
          .default([]),
        relatedServices: z.array(z.string()).default([]),
        featuredImage: image().optional(),
        imageAlt: z.string().optional(),
        imageCredit: z.string().optional(),
        author: reference('authors').optional(),
        reviewer: reference('authors').optional(),
        publishedAt: editorialDate.optional(),
        updatedAt: editorialDate.optional(),
        medicalReviewedAt: editorialDate.optional(),
        approvedAt: editorialDate.optional(),
        sources: z
          .array(z.object({ title: z.string(), url: z.url() }))
          .default([]),
        relatedArticles: z.array(z.string()).default([]),
        seo: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
          })
          .default({}),
        status: z
          .enum([
            'draft',
            'doctor-review',
            'medical-review',
            'approved',
            'published',
          ])
          .default('draft'),
      })
      .superRefine((d, ctx) => {
        if (
          (d.authorId && d.authorId !== d.author?.id) ||
          (d.reviewerId && d.reviewerId !== d.reviewer?.id)
        )
          ctx.addIssue({
            code: 'custom',
            message: 'Identity aliases must match the author/reviewer records.',
          });
        if (d.editorialStatus && d.editorialStatus !== d.status)
          ctx.addIssue({
            code: 'custom',
            message: 'Editorial and publication states must agree.',
          });
        if (d.lastUpdated && d.updatedAt && +d.lastUpdated !== +d.updatedAt)
          ctx.addIssue({
            code: 'custom',
            message: 'Update date aliases must agree.',
          });
        if (
          d.status === 'published' &&
          d.governanceVersion === 3 &&
          (!d.approvedBy ||
            !d.approvalRecord?.startsWith('https://') ||
            !d.clinicalDisclaimer ||
            !d.authorId ||
            !d.reviewerId ||
            !d.seo.title ||
            !d.seo.description)
        )
          ctx.addIssue({
            code: 'custom',
            message:
              'Deliberate publication requires approval evidence, identity aliases, disclaimer and metadata.',
          });
        if (
          d.status === 'published' &&
          (d.contentType !== 'article' ||
            !d.title.trim() ||
            !d.excerpt.trim() ||
            !d.author ||
            !d.publishedAt ||
            !d.authorshipConfirmed ||
            !d.introduction ||
            !d.keyTakeaways.length ||
            !d.medicalFaqs.length ||
            d.medicalFaqs.some((f) => !f.reviewed) ||
            !d.approvedAt ||
            !d.medicalReviewedAt ||
            !d.reviewer ||
            !d.sources.length)
        )
          ctx.addIssue({
            code: 'custom',
            message:
              'Publication requires genuine dates, authorship confirmation, introduction, takeaways, reviewed FAQs, medical reviewer, approval and sources.',
          });
        if (d.featuredImage && !d.imageAlt?.trim())
          ctx.addIssue({
            code: 'custom',
            message:
              'Featured medical images require meaningful alternative text.',
          });
        if (
          d.status === 'published' &&
          d.publishedAt &&
          ((d.approvedAt &&
            d.approvedAt > (d.updatedAt || d.lastUpdated || d.publishedAt)) ||
            (d.medicalReviewedAt &&
              d.medicalReviewedAt >
                (d.updatedAt || d.lastUpdated || d.publishedAt)))
        )
          ctx.addIssue({
            code: 'custom',
            message: 'Initial review and approval must precede publication.',
          });
      }),
});
export const collections = { authors, blog };
