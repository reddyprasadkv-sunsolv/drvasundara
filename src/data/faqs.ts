import { approvedServices } from './services';
import type { KnowledgeFAQ } from '../utils/faqs';
const source = approvedServices
  .flatMap((s) => s.faqs)
  .find((f) => f.kind === 'administrative');
export const approvedFaqs: KnowledgeFAQ[] = source
  ? [{ ...source, id: 'appointment-confirmation', kind: 'administrative' }]
  : [];
export const faqs = approvedFaqs;
