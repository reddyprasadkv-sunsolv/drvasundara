// Existing public videos from the clinic website. Reuse requested by the user.
// Neutral topic labels describe the source titles, without promising outcomes.
export const testimonials = [
  {
    id: 'LQ5VBo9wZhw',
    title: 'Mrs. Vijetha’s experience',
    topic: 'Pregnancy & birth',
    featured: true,
  },
  {
    id: 'ZjGuZZEki4w',
    title: 'Mrs. K. Kanaka Durga’s experience',
    topic: 'A patient’s perspective',
    featured: true,
  },
  {
    id: 'Tn6soQyuW68',
    title: 'A twin delivery experience',
    topic: 'Pregnancy & birth',
    featured: true,
  },
  {
    id: 'FcWkoQz6dko',
    title: 'An experience of fibroid surgery',
    topic: 'Gynecological care',
    featured: false,
  },
  {
    id: 'gyG40rv_UOQ',
    title: 'Travelling for a consultation and surgery',
    topic: 'A patient’s perspective',
    featured: false,
  },
];

// No individual permission evidence has been established. Do not populate this
// allowlist from general publication approval; retain only non-sensitive evidence
// references in the approval record before restoring any video.
const permissionVerifiedIds: ReadonlySet<string> = new Set();
export const publishedTestimonials = testimonials.filter((video) =>
  permissionVerifiedIds.has(video.id),
);
