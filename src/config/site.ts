export const site = {
  name: 'Dr. Vasundhara Gynec',
  url: 'https://drvasundaragynec.com',
  description:
    'A thoughtful introduction to Dr. Vasundhara Gynec and women’s healthcare. Explore the practice and appointment request information.',
  // Add only clinic-verified information. Empty fields are never rendered.
  doctor: {
    name: 'Dr. Vasundhara',
    qualifications: [] as string[],
    specialization: '',
    experience: '',
    clinicalApproach: '',
    portraitApproved: true,
  },
  appointmentFormUrl: '',
  contact: { phone: '', email: '', address: '', mapUrl: '' },
  socials: [] as { label: string; url: string }[],
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
