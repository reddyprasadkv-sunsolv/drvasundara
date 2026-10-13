export function isPublicArticle(
  data: {
    status: string;
    contentType?: string;
    updatedAt?: Date;
    approvedAt?: Date;
    medicalReviewedAt?: Date;
    reviewer?: string;
    publishedAt?: Date;
    authorshipConfirmed?: boolean;
  },
  now?: Date,
): boolean;
export function safeFormUrl(value: string): string | null;
