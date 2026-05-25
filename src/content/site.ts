// Single source of truth for editable copy. Update here, redeploy.

export const site = {
  name: 'CLIFFHANGER IC',
  tagline: 'A private residence above the Pacific.',
  description:
    'An architectural statement perched on the bluff — bound by sea, sky, and absolute privacy.',

  hero: {
    eyebrow: 'Private Offering',
    title: 'CLIFFHANGER IC',
    sub: 'A singular residence on the edge of the Pacific.',
    cta: 'Enter the Gallery',
  },

  overview: {
    eyebrow: 'The Residence',
    title: 'Suspended between sky and sea.',
    body: [
      'Cliffhanger IC is a private architectural composition cantilevered above the Pacific — a residence conceived as a single, uninterrupted gesture toward the horizon.',
      'Glass walls dissolve the boundary between interior and ocean. Travertine, oak, and patinated bronze ground the architecture in materiality. Every line, every threshold, every view has been resolved to the smallest detail.',
      'This is not a house. It is a vantage point on the natural world — and a rare opportunity for the most discerning buyer.',
    ],
    stats: [
      { label: 'Living Area', value: '11,400 sf' },
      { label: 'Bedrooms', value: '6' },
      { label: 'Baths', value: '8.5' },
      { label: 'Acreage', value: '1.4 ac' },
      { label: 'Frontage', value: '180 ft' },
    ],
  },

  amenities: {
    eyebrow: 'Curated For Living',
    title: 'Amenities',
    items: [
      { name: 'Infinity Edge Pool', detail: 'Spilling toward the horizon line, heated year-round.' },
      { name: 'Private Spa Suite', detail: 'Steam, sauna, cold plunge, and treatment room.' },
      { name: 'Wellness Pavilion', detail: 'Fully equipped gym with ocean-facing reformer studio.' },
      { name: 'Chef’s Kitchen', detail: 'Dual islands, La Cornue range, dedicated catering kitchen.' },
      { name: 'Wine Gallery', detail: 'Climate-controlled storage for 1,200+ bottles.' },
      { name: 'Cinema', detail: 'Dolby Atmos screening room with custom acoustic treatment.' },
      { name: 'Primary Retreat', detail: 'Dual baths, dressing rooms, and a private oceanfront terrace.' },
      { name: 'Smart Estate', detail: 'Fully integrated Crestron, Lutron, and security infrastructure.' },
      { name: 'Motor Court', detail: 'Five-car gallery garage with EV charging.' },
    ],
  },

  location: {
    eyebrow: 'Setting',
    title: 'A coastline without compromise.',
    body: [
      'Cliffhanger IC sits within one of the most exclusive coastal enclaves on the Pacific — twenty-four-hour guard-gated, fully private, and minutes from the region’s finest dining, golf, and air access.',
      'Address and precise coordinates disclosed upon qualified inquiry.',
    ],
    points: [
      'Guard-gated private community',
      '7 min to Pacific Coast Highway',
      '20 min to John Wayne (SNA)',
      '60 min to LAX private terminal',
    ],
  },

  contact: {
    eyebrow: 'Private Inquiry',
    title: 'Inquiries by appointment only.',
    body: 'Showings are arranged exclusively for qualified buyers and their representation. Please share a brief note and we will respond personally.',
    phone: '',   // optionally fill
    email: '',   // optionally fill
  },

  footer: {
    line: '© Cliffhanger IC. Offered exclusively. All material is confidential and intended for the recipient only.',
  },

  nav: [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/overview', label: 'Overview' },
    { href: '/amenities', label: 'Amenities' },
    { href: '/location', label: 'Location' },
    { href: '/inquiry', label: 'Inquiry' },
  ],
} as const;

export type Site = typeof site;
