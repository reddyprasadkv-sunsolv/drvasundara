import { site } from '../config/site';
import { approvedServices } from './services';
import type { KnowledgeFAQ } from '../utils/faqs';
const source = approvedServices
  .flatMap((s) => s.faqs)
  .find((f) => f.kind === 'administrative');
export const approvedFaqs: KnowledgeFAQ[] = source
  ? [{ ...source, id: 'appointment-confirmation', kind: 'administrative' }]
  : [];
// Administrative facts authorized by the project owner’s local SEO brief;
// these add no medical advice or new clinical review dates.
approvedFaqs.push(
  {
    id: 'consultation-location',
    kind: 'administrative',
    question: 'Where does Dr. Vasundara Cheepurupalli consult?',
    answer: `The confirmed consultation location is ${site.contact.address}. Contact the clinic on its official WhatsApp for appointment arrangements.`,
  },
  {
    id: 'consultation-hours',
    kind: 'administrative',
    question: 'How can I confirm consultation days and hours?',
    answer:
      'Ask the clinic on WhatsApp to confirm current availability before travelling. An enquiry does not confirm an appointment.',
  },
  {
    id: 'clinic-whatsapp',
    kind: 'administrative',
    question: 'How do I contact the clinic about a consultation?',
    answer: `Use the official WhatsApp account: ${site.whatsappLabel}. Share only the details needed to arrange a consultation. WhatsApp is not intended for medical emergencies.`,
  },
);
export const faqs = approvedFaqs;
