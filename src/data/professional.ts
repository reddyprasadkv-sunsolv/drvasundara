import inventory from './doctor-profile.json';
import { isApprovedClaim } from '../utils/medical-gates.mjs';
export const professionalInventory = inventory;
export function approvedClaim(id: string) {
  return inventory.claims.find((c) => c.id === id && isApprovedClaim(c));
}
function approvedText(id: string) {
  const value = approvedClaim(id)?.value;
  return typeof value === 'string' ? value : '';
}
function approvedList(id: string) {
  const value = approvedClaim(id)?.value;
  return Array.isArray(value) ? value : [];
}
export const publicProfile = {
  title: approvedText('professional-title'),
  qualifications: approvedList('qualifications'),
  experience: approvedText('experience-label'),
  introduction: approvedText('introduction'),
  approach: approvedText('clinical-approach'),
  interests: approvedList('specializations'),
  affiliations: approvedList('hospital-affiliations'),
  education: [
    'education-mbbs',
    'education-postgraduate',
    'robotic-training',
    'menopause-certification',
  ]
    .map(approvedText)
    .filter(Boolean),
  timeline: inventory.experienceTimeline
    .filter((c) => isApprovedClaim(c))
    .map((c) => c.value),
  registration:
    isApprovedClaim(inventory.registration) &&
    inventory.registration.number &&
    inventory.registration.authority
      ? inventory.registration
      : null,
};
