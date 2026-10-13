import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const services = JSON.parse(readFileSync('src/data/services.json', 'utf8'));
const profile = JSON.parse(
  readFileSync('src/data/doctor-profile.json', 'utf8'),
);
const dir = 'qa/clinician-review';
mkdirSync(dir + '/services', { recursive: true });
let index =
  '# Clinician review pack\n\nUnpublished drafts. This export does not authorize publication.\n\n';
for (const s of services) {
  const text = `# ${s.name}\n\nStatus: DRAFT — availability and clinical copy unconfirmed.\n\n## Introduction\n\n${s.introduction}\n\n## Understanding\n\n${s.understanding}\n\n## Reasons to consult\n\n${s.reasons.map((v) => '- ' + v).join('\n')}\n\n## When to seek advice\n\n${s.whenToSeek}\n\n## Evaluation\n\n${s.evaluation}\n\n## Benefits, risks and limitations\n\n${s.benefitsRisks}\n\n## Draft FAQs\n\n${s.faqs.map((f) => '### ' + f.question + '\n\n' + f.answer).join('\n\n')}\n\n## References\n\n${s.sources.map((r) => '- [' + r.title + '](' + r.url + ')').join('\n')}\n\n## Approval checks\n\n${s.reviewNotes.map((n) => '- ' + n).join('\n')}\n`;
  writeFileSync(dir + '/services/' + s.slug + '.md', text);
  index +=
    '- [' +
    s.name +
    '](services/' +
    s.slug +
    '.md)' +
    (s.aliasOf ? ' — consolidate into ' + s.aliasOf : '') +
    '\n';
}
writeFileSync(dir + '/profile.json', JSON.stringify(profile, null, 2));
writeFileSync(dir + '/README.md', index);
console.log(
  'Exported 29 service drafts and the profile inventory to ignored qa/clinician-review/.',
);
