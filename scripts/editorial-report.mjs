import fs from 'node:fs';
import { loadEditorial, editorialReport } from './editorial-lib.mjs';
const report = editorialReport(loadEditorial());
fs.mkdirSync('qa/editorial', { recursive: true });
fs.writeFileSync('qa/editorial/status.json', JSON.stringify(report, null, 2));
fs.writeFileSync(
  'qa/editorial/status.md',
  '# Local editorial status\n\n' +
    Object.entries(report.counts)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n') +
    '\n\n' +
    report.articles
      .map(
        (a) =>
          `## ${a.title}\n\nStatus: ${a.status}\n\n` +
          a.problems.map((p) => '- ' + p).join('\n'),
      )
      .join('\n\n'),
);
console.log(JSON.stringify(report.counts));
if (
  process.argv.includes('--check') &&
  report.articles.some(
    (a) =>
      a.status === 'published' &&
      a.problems.some((p) =>
        /Missing references|Missing verified|Missing explicit|Broken related|absent or unpublished|Publication eligibility/.test(
          p,
        ),
      ),
  )
)
  process.exitCode = 1;
