// Website publication requires an explicit, dated, scoped approval reference.
// This checks the recorded attestation, not the underlying private releases.
export function approvedPatientVideoIds(
  approval,
  today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()),
) {
  if (approval?.approved !== true || approval.websitePublication !== true)
    return [];
  if (
    typeof approval.approvedBy !== 'string' ||
    !approval.approvedBy.trim() ||
    typeof approval.evidenceRef !== 'string' ||
    !approval.evidenceRef.trim()
  )
    return [];
  const date = approval.approvedAt;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date || '') ||
    Number.isNaN(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date ||
    date > today
  )
    return [];
  const ids = approval.videoIds;
  if (
    !Array.isArray(ids) ||
    !ids.length ||
    new Set(ids).size !== ids.length ||
    ids.some((id) => typeof id !== 'string' || !/^[\w-]{11}$/.test(id))
  )
    return [];
  return ids;
}
