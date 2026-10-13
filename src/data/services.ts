export type Service = {
  slug: string;
  name: string;
  description: string;
  approved: boolean;
  body: string;
  icon: string;
};
// Proposed categories: these do NOT represent confirmed offerings.
export const services: Service[] = [
  {
    slug: 'general-gynecology',
    name: 'General Gynecology',
    description:
      'Consultations about gynecological health and individual concerns.',
    approved: false,
    body: '',
    icon: 'flower',
  },
  {
    slug: 'pregnancy-antenatal-care',
    name: 'Pregnancy & Antenatal Care',
    description:
      'Consultations during pregnancy, with care planned around individual needs.',
    approved: false,
    body: '',
    icon: 'circle',
  },
  {
    slug: 'menstrual-health',
    name: 'Menstrual Health',
    description: 'Conversations about menstrual patterns and related concerns.',
    approved: false,
    body: '',
    icon: 'flower',
  },
  {
    slug: 'pcos',
    name: 'PCOS',
    description:
      'Individual assessment and discussion of polycystic ovary syndrome.',
    approved: false,
    body: '',
    icon: 'circle',
  },
  {
    slug: 'menopause-care',
    name: 'Menopause Care',
    description: 'Consultations about health during the menopause transition.',
    approved: false,
    body: '',
    icon: 'flower',
  },
  {
    slug: 'fertility-consultation',
    name: 'Fertility Consultation',
    description:
      'A consultation to discuss fertility questions and next steps.',
    approved: false,
    body: '',
    icon: 'circle',
  },
  {
    slug: 'preventive-womens-health',
    name: 'Preventive Women’s Health',
    description:
      'Discussion of appropriate preventive care for individual needs.',
    approved: false,
    body: '',
    icon: 'flower',
  },
];
export const approvedServices = services.filter(
  (s) => s.approved && s.body.trim(),
);
