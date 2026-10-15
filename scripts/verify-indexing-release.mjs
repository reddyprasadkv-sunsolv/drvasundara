import {
  verifyIndexingRelease,
  publicationInventorySha256,
} from './indexing-release.mjs';
// Print the digest even when readiness blocks activation; this is not approval.
console.log(`Current publication inventory: ${publicationInventorySha256()}`);
console.log(
  `Verified production indexing request: ${verifyIndexingRelease() ? 'enabled with recorded approvals' : 'disabled'}`,
);
