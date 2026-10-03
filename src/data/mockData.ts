import { Worker, Review, ChatMessage, Booking } from '../types';

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'Rajesh Sharma',
    category: 'Electrician',
    rating: 4.9,
    reviewCount: 142,
    hourlyRate: 350,
    experienceYears: 8,
    distanceKm: 1.2,
    locationName: 'Ayyanthole, Thrissur',
    availability: 'Available Today',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80',
    bio: 'Certified master electrician with 8+ years experience in residential wiring, short-circuit troubleshooting, smart home installations, and DB box setups.',
    phone: '+91 98765 43210',
    specializations: ['Full House Rewiring', 'Short Circuit Repair', 'MCB & DB Box', 'EV Charger Install', 'Chandelier & Appliance Fitting'],
    portfolio: [
      {
        id: 'p1',
        title: 'Modern Recessed Ceiling Lighting',
        imageUrl: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80',
        description: 'Installed 24 dimmable ambient LED lights in living room & kitchen modular ceiling.'
      },
      {
        id: 'p2',
        title: 'Smart Home Automation Board',
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
        description: 'Upgraded old fuse box to 12-way Siemens MCB distribution panel with surge protection.'
      },
      {
        id: 'p3',
        title: 'Designer Pendant Light Setup',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        description: 'Hung customized glass pendants over kitchen island with concealed wiring.'
      },
      {
        id: 'p4',
        title: 'Commercial Kitchen Wiring',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        description: 'Heavy duty 3-phase power installation for restaurant kitchen appliances.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Today', dateStr: 'Oct 3', slots: ['11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'] },
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['09:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'] },
      { dayName: 'Sun, Oct 5', dateStr: 'Oct 5', slots: ['10:00 AM', '01:00 PM', '04:00 PM'] },
    ]
  },
  {
    id: 'w2',
    name: 'Suresh Kumar',
    category: 'Plumber',
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 300,
    experienceYears: 10,
    distanceKm: 2.4,
    locationName: 'Round South, Thrissur',
    availability: 'Available Today',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Expert plumber specializing in underground pipe leakage detection, Kohler/Jaquar fixture installations, water heater repairs, and bathroom renovation plumbing.',
    phone: '+91 98123 45678',
    specializations: ['Pipe Leakage Repair', 'Bathroom Renovations', 'Geyser / Heater Service', 'Drain Blockage Removal', 'Water Tank Cleaning'],
    portfolio: [
      {
        id: 'p5',
        title: 'Concealed Bathroom Fitting',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        description: 'Installed rain shower head and concealed thermostat mixer valves.'
      },
      {
        id: 'p6',
        title: 'Modular Kitchen Plumbing',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        description: 'Dual basin sink installation with RO water purifier direct line connection.'
      },
      {
        id: 'p7',
        title: 'Pressure Booster Pump Installation',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        description: 'Installed Grundfos automated pressure booster system for 3-floor villa.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Today', dateStr: 'Oct 3', slots: ['12:30 PM', '03:30 PM', '06:00 PM'] },
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['09:30 AM', '02:00 PM', '05:30 PM'] },
    ]
  },
  {
    id: 'w3',
    name: 'Vikram Singh',
    category: 'Painter',
    rating: 4.9,
    reviewCount: 176,
    hourlyRate: 400,
    experienceYears: 12,
    distanceKm: 3.1,
    locationName: 'Ollur, Thrissur',
    availability: 'Available Today',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Asian Paints certified master painter. Specialist in Italian Stucco finish, metallic accent walls, waterproof exterior coatings, and dust-free machine sanding.',
    phone: '+91 97890 12345',
    specializations: ['Interior Texture Walls', 'Asian Paints Royale Finish', 'Waterproof Exterior', 'PU Wood Polish', 'Stencil Art Wall'],
    portfolio: [
      {
        id: 'p8',
        title: 'Velvet Gold Accent Wall',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        description: 'Created custom metallic texture wall with spotlight highlighting.'
      },
      {
        id: 'p9',
        title: 'Full 3BHK Royale Glitz Painting',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        description: 'Complete apartment repaint with low-VOC eco-friendly washable emulsion.'
      },
      {
        id: 'p10',
        title: 'Teak Wood Door PU Polish',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        description: 'Restored 15-year old main door with high gloss PU protective lacquer.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Today', dateStr: 'Oct 3', slots: ['02:00 PM', '05:00 PM'] },
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['10:00 AM', '01:00 PM', '04:00 PM'] },
    ]
  },
  {
    id: 'w4',
    name: 'Gurpreet Singh',
    category: 'Carpenter',
    rating: 4.95,
    reviewCount: 210,
    hourlyRate: 450,
    experienceYears: 15,
    distanceKm: 0.8,
    locationName: 'Punkunnam, Thrissur',
    availability: 'Available Today',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    bio: 'Precision craftsman with 15+ years creating custom modular wardrobes, kitchen cabinets, hardwood furniture repair, lock replacements, and door alignments.',
    phone: '+91 99000 11223',
    specializations: ['Custom Wardrobes', 'Modular Kitchen Cabinets', 'Furniture Repair & Restoration', 'Yale Digital Lock Install', 'Door Framing & Trim'],
    portfolio: [
      {
        id: 'p11',
        title: 'Floor-to-Ceiling Sliding Wardrobe',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
        description: 'Built custom 10-foot marine plywood wardrobe with mirror slider doors.'
      },
      {
        id: 'p12',
        title: 'Acrylic Modular Kitchen Cabinets',
        imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80',
        description: 'Custom soft-close Blum hardware drawer channels & corner carousel units.'
      },
      {
        id: 'p13',
        title: 'Custom Floating TV Console',
        imageUrl: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=800&q=80',
        description: 'Walnut wood veneer wall-mounted TV console with hidden wire management.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Today', dateStr: 'Oct 3', slots: ['01:00 PM', '03:30 PM', '06:00 PM'] },
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['09:00 AM', '11:30 AM', '02:30 PM'] },
    ]
  },
  {
    id: 'w5',
    name: 'Ananya Verma',
    category: 'Electrician',
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 320,
    experienceYears: 5,
    distanceKm: 4.2,
    locationName: 'Viyyur, Thrissur',
    availability: 'Available Tomorrow',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialized electrical engineer focusing on energy-efficient lighting, solar invertor connections, AC point wiring, and safety earthing tests.',
    phone: '+91 96543 21098',
    specializations: ['Solar Inverter Setup', 'AC Power Points', 'Earthing Installation', 'LED Strip Profiling', 'Safety Audits'],
    portfolio: [
      {
        id: 'p14',
        title: 'Cove LED Profile Lighting',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        description: 'Warm 3000K indirect cove light channels for master bedroom ceiling.'
      },
      {
        id: 'p15',
        title: 'Home Solar Inverter System',
        imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        description: 'Wired 3kVA hybrid inverter setup with battery storage safety isolator.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['10:00 AM', '01:00 PM', '04:00 PM'] },
      { dayName: 'Sun, Oct 5', dateStr: 'Oct 5', slots: ['11:00 AM', '03:00 PM'] },
    ]
  },
  {
    id: 'w6',
    name: 'Mohammed Imran',
    category: 'Plumber',
    rating: 4.85,
    reviewCount: 115,
    hourlyRate: 330,
    experienceYears: 9,
    distanceKm: 1.9,
    locationName: 'Ayyanthole, Thrissur',
    availability: 'Available Today',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    bio: 'Commercial and residential plumber. Master at thermal camera pipe leak tracing, high-pressure jet drain unclogging, and sanitary ware mounting.',
    phone: '+91 94321 87654',
    specializations: ['Thermal Leak Detection', 'Jet Drain Unclogging', 'Wall Hung Closet Fittings', 'Pipeline Overhaul'],
    portfolio: [
      {
        id: 'p16',
        title: 'Wall-Hung Smart Toilet Installation',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        description: 'Installed Geberit concealed cistern frame & wall hung WC.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Today', dateStr: 'Oct 3', slots: ['03:00 PM', '05:30 PM'] },
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['09:00 AM', '12:00 PM', '03:00 PM'] },
    ]
  },
  {
    id: 'w7',
    name: 'Priya Nair',
    category: 'Painter',
    rating: 4.75,
    reviewCount: 52,
    hourlyRate: 380,
    experienceYears: 6,
    distanceKm: 5.0,
    locationName: 'Round South, Thrissur',
    availability: 'Booked',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Creative interior color consultant and decorative wall painting expert. Known for geometric wall murals, dampness proofing treatment, and kid room themes.',
    phone: '+91 91234 56789',
    specializations: ['Geometric Wall Murals', 'Damp Proofing Treatment', 'Chalkboard Accent Walls', 'Waterproofing Coating'],
    portfolio: [
      {
        id: 'p17',
        title: 'Nordic Pastel Bedroom Wall',
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        description: 'Custom geometric color block design in soft sage & warm terracotta.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Mon, Oct 6', dateStr: 'Oct 6', slots: ['10:00 AM', '02:00 PM'] },
    ]
  },
  {
    id: 'w8',
    name: 'Ramesh Patel',
    category: 'Carpenter',
    rating: 4.88,
    reviewCount: 134,
    hourlyRate: 420,
    experienceYears: 11,
    distanceKm: 2.1,
    locationName: 'Punkunnam, Thrissur',
    availability: 'Available Today',
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    bio: 'Plywood & solid wood artisan. Specializes in custom study desks, balcony deck flooring, wooden ceiling beams, and wardrobe hinge repairs.',
    phone: '+91 93456 78901',
    specializations: ['Balcony Decking', 'Custom Study Desks', 'Door Lock Installation', 'Kitchen Drawer Repair'],
    portfolio: [
      {
        id: 'p18',
        title: 'Teak Wood Balcony Deck',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        description: 'Weatherproof treated teak tile deck flooring for high-rise apartment balcony.'
      }
    ],
    availabilitySchedule: [
      { dayName: 'Today', dateStr: 'Oct 3', slots: ['02:00 PM', '04:30 PM'] },
      { dayName: 'Tomorrow', dateStr: 'Oct 4', slots: ['10:30 AM', '01:30 PM', '05:00 PM'] },
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    workerId: 'w1',
    customerName: 'Aravind Menon',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    categoryRatings: { punctuality: 5, quality: 5, cleanliness: 5, behavior: 5 },
    date: '2 days ago',
    serviceType: 'MCB & DB Box Setup',
    comment: 'Rajesh arrived right on time at Ayyanthole! Diagnosed the frequent breaker tripping issue in our villa within 10 minutes and replaced the faulty 32A MCB cleanly. Super polite and professional.'
  },
  {
    id: 'r2',
    workerId: 'w1',
    customerName: 'Sneha Rao',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    categoryRatings: { punctuality: 5, quality: 5, cleanliness: 4.8, behavior: 5 },
    date: '1 week ago',
    serviceType: 'Living Room Chandelier Fitting',
    comment: 'Installed a heavy crystal chandelier on a high false ceiling near Swaraj Round South. Brought proper step ladders and safety equipment.'
  },
  {
    id: 'r3',
    workerId: 'w2',
    customerName: 'Karthik Subbaraj',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    categoryRatings: { punctuality: 5, quality: 5, cleanliness: 5, behavior: 5 },
    date: '3 days ago',
    serviceType: 'Jaquar Shower Mixer Repair',
    comment: 'Suresh is a true professional. Fixed a persistent hot water leak in our master bathroom mixer tap in Ollur. Upfront pricing and zero hidden charges.'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    workerId: 'w1',
    sender: 'worker',
    text: 'Namaskaram! I am Rajesh, certified electrician in Thrissur. How can I help you with your home electrical needs today?',
    timestamp: '10:15 AM',
    read: true
  },
  {
    id: 'm2',
    workerId: 'w1',
    sender: 'customer',
    text: 'Hi Rajesh! My living room MCB keeps tripping whenever I switch on the AC and Geyser together.',
    timestamp: '10:18 AM',
    read: true
  },
  {
    id: 'm3',
    workerId: 'w1',
    sender: 'worker',
    text: 'That sounds like an overload on a single circuit phase. I can visit your home in Ayyanthole with a digital clamp meter. Are you free around 2 PM today?',
    timestamp: '10:20 AM',
    read: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'DC-84920',
    workerId: 'w1',
    workerName: 'Rajesh Sharma',
    workerCategory: 'Electrician',
    workerPhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80',
    workerPhone: '+91 98765 43210',
    serviceCategory: 'Electrician',
    serviceSubtype: 'MCB & Circuit Inspection',
    jobDescription: 'MCB tripping frequently under AC + Geyser load. Needs phase check and breaker replacement.',
    date: 'Oct 3, 2026',
    timeSlot: '02:00 PM - 04:00 PM',
    address: 'Flat 3B, Sobha City, Puzhakkal, Ayyanthole, Thrissur, Kerala - 680003',
    hourlyRate: 350,
    estimatedHours: 2,
    baseAmount: 700,
    inspectionFee: 0,
    platformFee: 29,
    totalAmount: 729,
    status: 'Confirmed',
    paymentMethod: 'Pay Cash / UPI After Service',
    createdAt: 'Oct 3, 10:22 AM',
    reviewSubmitted: false
  }
];
