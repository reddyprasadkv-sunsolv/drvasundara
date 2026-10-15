import { configuredIndexing } from './indexing-release.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  assertRootReadiness,
  sha256,
  verifyArtifact,
} from './release-artifact.mjs';
if (process.env.PAGES_PREVIEW === 'true')
  throw new Error('Production artifact preparation rejects preview mode');
const { files, pageCount } = assertRootReadiness('dist');
const output = 'release/production-readiness';
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync('dist', path.join(output, 'site'), { recursive: true });
const manifest = {
  formatVersion: 1,
  mode: 'production-readiness',
  deploymentAuthorized: false,
  productionIndexing: configuredIndexing(),
  canonicalOrigin: 'https://www.drvasundaragynec.com',
  basePath: '/',
  sourceCommit:
    process.env.GITHUB_SHA ||
    execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  sourceDirty:
    execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()
      .length > 0,
  builtAt: new Date().toISOString(),
  pageCount,
  files,
};
const content = JSON.stringify(manifest, null, 2) + '\n';
fs.writeFileSync(path.join(output, 'manifest.json'), content);
fs.writeFileSync(
  path.join(output, 'SHA256SUMS'),
  files.map((f) => `${f.sha256}  site/${f.path}`).join('\n') +
    '\n' +
    sha256(content) +
    '  manifest.json\n',
);
verifyArtifact(output);
console.log(
  `Prepared ${files.length} hashed root-build files in ${output}; deployment is not authorized.`,
);
