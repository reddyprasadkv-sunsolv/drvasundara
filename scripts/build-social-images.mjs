import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { canPublishArticleRecord } from '../src/utils/publication.mjs';
import { loadEditorial } from './editorial-lib.mjs';
const output = 'public/images/journal';
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const entry of loadEditorial().records) {
  // Only currently published records; publication tests independently guard visitor routes.
  if (
    !canPublishArticleRecord(
      entry.data,
      entry.body,
      entry.author,
      entry.reviewer,
    ) ||
    !entry.data.featuredImage
  )
    continue;
  if (!/^[a-z0-9-]+$/.test(entry.data.slug))
    throw new Error('Invalid image slug');
  const image = path.resolve('src/content/blog', entry.data.featuredImage);
  await sharp(image)
    .resize(1200, 788, { fit: 'contain', background: '#fff9fc' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(output, entry.data.slug + '.png'));
}
console.log(
  'Generated raster social images from existing article illustrations.',
);
