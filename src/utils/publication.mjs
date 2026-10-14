import { categoryId } from './journal.mjs';
import { isPublicArticle } from './editorial.mjs';
const https = (value) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};
export function canPublishArticleRecord(
  data,
  body,
  author,
  reviewer,
  now = new Date(),
) {
  if (!isPublicArticle(data, now)) return false;
  if (!data.title?.trim() || !data.excerpt?.trim()) return false;
  if (
    !author?.verified ||
    !https(author.verificationRecord) ||
    !reviewer?.verified ||
    reviewer.entityType !== 'Person' ||
    !reviewer.canReviewMedicalContent ||
    !https(reviewer.reviewConfirmationRecord)
  )
    return false;
  if (data.authorship === 'doctor-authored' && !author.canReviewMedicalContent)
    return false;
  if (!(
    data.sources?.length &&
    data.sources.every((s) => s.title?.trim() && https(s.url))
  ))
    return false;
  if (!(
    data.introduction?.trim() &&
    data.keyTakeaways?.length &&
    data.medicalFaqs?.length &&
    data.medicalFaqs.every(
      (f) => f.reviewed && f.question?.trim() && f.answer?.trim(),
    )
  ))
    return false;
  if (
    String(body || '')
      .trim()
      .split(/\s+/).length < 80
  )
    return false;
  if (
    data.governanceVersion === 3 &&
    !(
      data.seo?.title?.trim() &&
      data.seo?.description?.trim() &&
      data.approvedBy?.trim() &&
      https(data.approvalRecord) &&
      data.clinicalDisclaimer?.trim() &&
      data.editorialStatus === data.status &&
      data.authorId &&
      data.reviewerId
    )
  )
    return false;
  return true;
}
export function publishedSearchRecords(
  candidates,
  categories,
  base = '/',
  now = new Date(),
) {
  return candidates
    .filter((c) =>
      canPublishArticleRecord(c.data, c.body, c.author, c.reviewer, now),
    )
    .map((c) => {
      const category = categories.find((cat) => cat.id === categoryId(c.data));
      return {
        slug: c.data.slug,
        title: c.data.title,
        summary: c.data.excerpt,
        categoryId: category?.id || '',
        categoryName: category?.name || c.data.category,
        url: base + 'blog/' + c.data.slug + '/',
      };
    });
}
