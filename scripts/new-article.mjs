import fs from 'node:fs';
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  throw new Error(
    'Provide a unique lowercase slug: pnpm journal:new my-article',
  );
const path = `src/content/blog/${slug}.mdx`;
if (fs.existsSync(path))
  throw new Error('This article already exists; no file was changed.');
const fields = {
  title: process.argv[3] || 'Working title',
  slug,
  excerpt: '',
  category: 'Preventive Care',
  journalCategory: 'preventive-healthcare',
  governanceVersion: 3,
  contentType: 'article',
  authorship: 'staff-authored',
  authorshipConfirmed: false,
  status: 'draft',
  editorialStatus: 'draft',
  introduction: '',
  keyTakeaways: [],
  medicalFaqs: [],
  sources: [],
  relatedArticles: [],
  relatedServices: [],
  seo: {},
};
fs.writeFileSync(
  path,
  '---\n' +
    Object.entries(fields)
      .map(([k, v]) => k + ': ' + JSON.stringify(v))
      .join('\n') +
    '\n---\n\n## Draft for medical review\n\nPrepare the clinical explanation and supporting references. No author, review or publication date has been assigned.\n',
);
console.log('Created unpublished draft: ' + path);
