import type { PublicArticle } from './articles';
import type { Service } from '../data/services';
import { isPublicService } from './medical-gates.mjs';
export interface KnowledgeFAQ {
  id?: string;
  kind: 'administrative' | 'general-medical' | 'service' | 'article';
  question: string;
  answer: string;
  reviewer?: string;
  reviewedAt?: string;
  sourcePath?: string;
}
export function serviceKnowledge(service: Service): KnowledgeFAQ[] {
  return isPublicService(service)
    ? service.faqs
        .filter((f) => f.kind !== 'administrative')
        .map((f) => ({
          ...f,
          kind: 'service' as const,
          reviewer: service.medicalReviewedBy!,
          reviewedAt: service.medicalReviewedAt!,
        }))
    : [];
}
export function articleKnowledge(article: PublicArticle): KnowledgeFAQ[] {
  return article.data.medicalFaqs
    .filter((f) => f.reviewed)
    .map((f) => ({
      ...f,
      kind: 'article' as const,
      reviewer: article.data.approvedBy,
      reviewedAt: article.data.medicalReviewedAt.toISOString().slice(0, 10),
    }));
}
export const uniqueKnowledge = (items: KnowledgeFAQ[]) => [
  ...new Map(items.map((f) => [f.question.trim().toLowerCase(), f])).values(),
];
