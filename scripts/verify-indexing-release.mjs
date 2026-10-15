import {
  verifyIndexingRelease,
  publicationInventorySha256,
} from './indexing-release.mjs';
console.log(
  `Verified controlled production indexing request: ${verifyIndexingRelease() ? 'enabled with recorded approvals' : 'disabled'}; inventory ${publicationInventorySha256()}`,
);
