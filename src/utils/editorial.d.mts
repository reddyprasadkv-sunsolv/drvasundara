export function isPublicArticle(
  data: {
    status: string;
    approvedAt?: Date;
    medicalReviewedAt?: Date;
    reviewer?: string;
    publishedAt: Date;
  },
  now?: Date,
): boolean;
export function safeFormUrl(value: string): string | null;
