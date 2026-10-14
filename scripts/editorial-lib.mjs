import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { canPublishArticleRecord } from '../src/utils/publication.mjs';
const require = createRequire(import.meta.url);
// Reuse Astro's installed YAML parser; no additional runtime dependency.
const yaml = createRequire(require.resolve('astro'))('yaml');
export function loadEditorial(root = process.cwd()) {
  const authors = new Map(
    fs
      .readdirSync(path.join(root, 'src/content/authors'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => [
        f.replace(/\.json$/, ''),
        JSON.parse(
          fs.readFileSync(path.join(root, 'src/content/authors', f), 'utf8'),
        ),
      ]),
  );
  const records = fs
    .readdirSync(path.join(root, 'src/content/blog'))
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((file) => {
      const text = fs.readFileSync(
        path.join(root, 'src/content/blog', file),
        'utf8',
      );
      const parts = text.split(/^---\s*$/m);
      const data = yaml.parse(parts[1]);
      return {
        file,
        data,
        body: parts.slice(2).join('---').trim(),
        author: authors.get(data.author),
        reviewer: authors.get(data.reviewer),
      };
    });
  return {
    records,
    authors,
    services: JSON.parse(
      fs.readFileSync(path.join(root, 'src/data/services.json'), 'utf8'),
    ),
    categories: JSON.parse(
      fs.readFileSync(
        path.join(root, 'src/data/journal-categories.json'),
        'utf8',
      ),
    ),
  };
}
export function editorialReport(repository, asOf = new Date()) {
  const { records, services, categories } = repository;
  const allSlugs = new Set(records.map((r) => r.data.slug)),
    publicServices = new Set(
      services
        .filter((s) => s.approved && s.status === 'published' && !s.aliasOf)
        .map((s) => s.slug),
    );
  const counts = {
    total: records.length,
    draft: 0,
    awaitingReview: 0,
    approved: 0,
    published: 0,
    missingReferences: 0,
    missingVerifiedReviewers: 0,
    missingApprovalEvidence: 0,
    dueForReview: 0,
    unscheduledReview: 0,
    brokenRelatedReferences: 0,
  };
  const issues = [];
  for (const r of records) {
    const d = r.data;
    const problems = [];
    if (d.status === 'draft') counts.draft++;
    if (['medical-review', 'doctor-review'].includes(d.status))
      counts.awaitingReview++;
    if (d.status === 'approved') counts.approved++;
    if (canPublishArticleRecord(d, r.body, r.author, r.reviewer, asOf))
      counts.published++;
    if (!d.sources?.length) {
      counts.missingReferences++;
      problems.push('Missing references');
    }
    if (!r.reviewer?.verified || !r.reviewer?.canReviewMedicalContent) {
      counts.missingVerifiedReviewers++;
      problems.push('Missing verified medical reviewer');
    }
    if (!d.approvalRecord || !d.approvedBy) {
      counts.missingApprovalEvidence++;
      problems.push('Missing explicit approval evidence');
    }
    if (d.nextReviewDueAt && new Date(d.nextReviewDueAt) <= asOf) {
      counts.dueForReview++;
      problems.push('Manual review is due');
    }
    if (!d.nextReviewDueAt) {
      counts.unscheduledReview++;
      problems.push('Next manual review not scheduled');
    }
    if (!r.reviewer?.medicalRegistration?.verified)
      problems.push(
        'Medical registration evidence not supplied; review confirmation is not a registry audit',
      );
    for (const slug of d.relatedArticles || [])
      if (!allSlugs.has(slug)) {
        counts.brokenRelatedReferences++;
        problems.push('Broken related article: ' + slug);
      }
    for (const slug of d.relatedServices || [])
      if (!publicServices.has(slug)) {
        counts.brokenRelatedReferences++;
        problems.push('Related service is absent or unpublished: ' + slug);
      }
    if (!categories.some((c) => c.id === d.journalCategory))
      problems.push('Explicit journal category missing');
    if (
      d.status === 'published' &&
      !canPublishArticleRecord(d, r.body, r.author, r.reviewer, asOf)
    )
      problems.push(
        'Publication eligibility failed — fix or explicitly withdraw',
      );
    issues.push({ slug: d.slug, title: d.title, status: d.status, problems });
  }
  return { generatedAt: asOf.toISOString(), counts, articles: issues };
}
