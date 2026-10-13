import { z } from 'zod';
import drafts from './services.json';
import categories from './service-categories.json';
import { isPublicService } from '../utils/medical-gates.mjs';
const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string(),
  category: z.string(),
  kind: z.enum(['condition', 'procedure', 'consultation']),
  description: z.string(),
  approved: z.boolean(),
  availabilityConfirmed: z.boolean(),
  contentReviewed: z.boolean(),
  status: z.enum(['draft', 'medical-review', 'approved', 'published']),
  approvedBy: z.string().nullable(),
  approvedAt: z.string().nullable(),
  medicalReviewedBy: z.string().nullable(),
  medicalReviewedAt: z.string().nullable(),
  approvalRecord: z.url().nullable(),
  aliasOf: z.string().nullable(),
  introduction: z.string(),
  understanding: z.string(),
  reasons: z.array(z.string()),
  whenToSeek: z.string(),
  evaluation: z.string(),
  benefitsRisks: z.string(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  sources: z.array(z.object({ title: z.string(), url: z.url() })),
  relatedArticles: z.array(z.string()),
  relatedServices: z.array(z.string()),
  image: z
    .object({
      src: z.string(),
      alt: z.string().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .nullable(),
  seo: z.object({ title: z.string(), description: z.string() }),
  reviewNotes: z.array(z.string()),
});
export type Service = z.infer<typeof serviceSchema>;
export const services = z.array(serviceSchema).parse(drafts);
if (new Set(services.map((s) => s.slug)).size !== services.length)
  throw new Error('Duplicate service slugs');
export const serviceCategories = categories;
export const approvedServices = services.filter((s) => isPublicService(s));
export const approvedServiceGroups = categories
  .map((category) => ({
    ...category,
    services: approvedServices.filter((s) => s.category === category.id),
  }))
  .filter((category) => category.services.length > 0);
