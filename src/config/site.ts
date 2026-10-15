import { publicProfile } from '../data/professional';
import { publicPractice } from './local-seo';
// Single verified public contact number; derive URL and readable label together.
const whatsappNumber = '919346825723';
export const site = {
  name: 'Dr. Vasundara Cheepurupalli',
  url: 'https://www.drvasundaragynec.com',
  description:
    'A thoughtful introduction to Dr. Vasundara Cheepurupalli and women’s healthcare. Explore the practice and appointment request information.',
  // Add only clinic-verified information. Empty fields are never rendered.
  doctor: {
    name: 'Dr. Vasundara Cheepurupalli',
    qualifications: publicProfile.qualifications,
    specialization: publicProfile.title,
    experience: publicProfile.experience,
    clinicalApproach: publicProfile.approach,
    portraitApproved: true,
  },
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  whatsappLabel: `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 7)} ${whatsappNumber.slice(7)}`,
  contact: {
    phone: publicPractice?.phone || '',
    email: publicPractice?.email || '',
    // Facility/city display label supplied by the project owner.
    address: 'KIMS Hospital, Secunderabad',
    mapUrl: publicPractice?.mapUrl || '',
  },
  socials: [
    {
      label: 'YouTube',
      url: 'https://www.youtube.com/@DrVasundaraCheepurupalli',
    },
    {
      label: 'Facebook',
      url: 'https://www.facebook.com/DrVasundaraCheepurupalli',
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/dr_vasundara_cheepurupalli',
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/dr-vasundara-cheepurupalli',
    },
  ] as { label: string; url: string }[],
  productionIndexing: false,
};
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About Doctor', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Women’s Health Insights', href: '/blog/' },
  { label: 'FAQs', href: '/faqs/' },
  { label: 'Contact', href: '/contact/' },
];
