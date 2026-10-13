import { defineCollection, reference } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    verified: z.boolean().default(false),
    qualifications: z.array(z.string()).default([]),
    profileUrl: z.string().optional(),
  }),
});
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
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
        featuredImage: image().optional(),
        imageAlt: z.string().optional(),
        author: reference('authors'),
        reviewer: reference('authors').optional(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        medicalReviewedAt: z.coerce.date().optional(),
        approvedAt: z.coerce.date().optional(),
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
          .enum(['draft', 'doctor-review', 'approved', 'published'])
          .default('draft'),
      })
      .superRefine((d, ctx) => {
        if (
          d.status === 'published' &&
          (!d.approvedAt ||
            !d.medicalReviewedAt ||
            !d.reviewer ||
            !d.sources.length)
        )
          ctx.addIssue({
            code: 'custom',
            message:
              'Published medical content requires approval, medical review, reviewer, and sources.',
          });
      }),
});
export const collections = { authors, blog };
