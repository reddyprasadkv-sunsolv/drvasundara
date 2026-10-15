import { verifyArtifact } from './release-artifact.mjs';
const manifest = verifyArtifact('release/production-readiness');
console.log(
  `Verified ${manifest.files.length} files, ${manifest.pageCount} HTML pages, root URLs and approved indexing policy in the production-readiness artifact.`,
);
