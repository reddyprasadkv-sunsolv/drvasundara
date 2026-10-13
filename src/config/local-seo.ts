import inventory from '../data/local-seo.json';
import { validPastDate } from '../utils/medical-gates.mjs';
export const localSeoInventory = inventory;
const approved =
  inventory.publication.approved &&
  !!inventory.publication.approvedBy &&
  validPastDate(inventory.publication.approvedAt) &&
  /^https:\/\//.test(inventory.publication.verificationRecord || '');
export const publicPractice =
  approved &&
  inventory.approved.practiceName &&
  inventory.approved.city &&
  inventory.approved.phone
    ? inventory.approved
    : null;
