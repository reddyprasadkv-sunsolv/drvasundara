export const faqs: { question: string; answer: string; approved: boolean }[] =
  [];
export const approvedFaqs = faqs.filter((f) => f.approved);
