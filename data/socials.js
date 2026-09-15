// Single source of truth for MAI's social accounts, shared by the hero and the
// footer so the two can't drift apart (they previously pointed at different
// Facebook pages and Instagram accounts).
//
// `id`    picks the icon in FooterSection — keep it stable.
// `label` is display text only, safe to reword.
// `brand` is the platform's own colour, used for the footer icons; `gradient`
//         is only set where a flat colour doesn't represent the brand.
export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/mai_eire/',
    brand: '#E4405F',
    gradient:
      'linear-gradient(45deg, #F58529 0%, #DD2A7B 45%, #8134AF 75%, #515BD4 100%)',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Irish-MAI-Endowment/100064844792099/',
    brand: '#1877F2',
  },
  {
    id: 'x',
    label: 'Twitter',
    href: 'https://x.com/MuslimAssodyda',
    brand: '#000000',
  },
];
