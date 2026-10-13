export function validPastDate(value, now = new Date()) {
  if (!value || (!(value instanceof Date) && typeof value !== 'string'))
    return false;
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.valueOf())) return false;
  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    date.toISOString().slice(0, 10) !== value
  )
    return false;
  return date <= now;
}
export function isApprovedClaim(claim, now = new Date()) {
  return (
    !!claim &&
    claim.approvedForPublication === true &&
    claim.doctorApprovalStatus === 'approved' &&
    !!claim.approvedBy &&
    validPastDate(claim.approvedAt, now) &&
    claim.sources?.length > 0 &&
    ['corroborated', 'document-verified'].includes(claim.verificationStatus)
  );
}
export function isPublicService(service, now = new Date()) {
  return (
    !!service &&
    service.approved === true &&
    service.status === 'published' &&
    service.availabilityConfirmed === true &&
    service.contentReviewed === true &&
    !service.aliasOf &&
    !!service.approvedBy &&
    !!service.medicalReviewedBy &&
    validPastDate(service.approvedAt, now) &&
    validPastDate(service.medicalReviewedAt, now) &&
    /^https:\/\//.test(service.approvalRecord || '') &&
    service.sources?.length > 0 &&
    [
      'name',
      'description',
      'introduction',
      'understanding',
      'whenToSeek',
      'evaluation',
      'benefitsRisks',
    ].every((key) => typeof service[key] === 'string' && service[key].trim()) &&
    service.reasons?.length > 0 &&
    service.reasons.every(
      (reason) => typeof reason === 'string' && reason.trim(),
    ) &&
    service.faqs?.length > 0 &&
    service.faqs.every((faq) => faq.question?.trim() && faq.answer?.trim()) &&
    new Date(service.medicalReviewedAt) <= new Date(service.approvedAt)
  );
}
