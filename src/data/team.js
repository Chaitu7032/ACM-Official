// ---------------------------------------------------------------------------
// src/data/team.js — ACM VIT-AP Student Chapter Team Data
// ---------------------------------------------------------------------------

// ─── 1] ADMIN TEAM ─────────────────────────────────────────────────────────
// Tier 1: Top 2 in a row — President & Vice President
export const ADMIN_PRESIDENCY = [
  {
    id: 'president',
    name: 'Shaik Haaris',
    role: 'President',
    badge: 'EXECUTIVE LEADERSHIP',
    quote: 'Leading the computational frontier and uniting innovators across disciplines.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'vice-president',
    name: 'Dharineesh MR',
    role: 'Vice President',
    badge: 'EXECUTIVE LEADERSHIP',
    quote: 'Empowering student builders to engineer scalable, high-impact systems.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

// Tier 2: 3 in a row — Secretary, Joint Secretary, Treasurer
export const ADMIN_CORE_OFFICERS = [
  {
    id: 'secretary',
    name: 'Siddhartha BVS',
    role: 'Secretary',
    badge: 'CORE OFFICER',
    quote: 'Orchestrating chapter governance, documentation, and structural synergy.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'joint-secretary',
    name: 'Gowtami Kortam',
    role: 'Joint Secretary',
    badge: 'CORE OFFICER',
    quote: 'Streamlining cross-domain communication and student chapter initiatives.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'treasurer',
    name: 'Shreeyansh',
    role: 'Treasurer',
    badge: 'CORE OFFICER',
    quote: 'Managing financial frameworks, budgeting, and sponsorship allocations.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

// Tier 3: 2 in a row — Club Manager & Technical Manager
export const ADMIN_MANAGERS = [
  {
    id: 'club-manager',
    name: 'Angel Pratibha Mukherjee',
    role: 'Club Manager',
    badge: 'OPERATIONS LEAD',
    quote: 'Driving operations, member welfare, and high-energy chapter execution.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'technical-manager',
    name: 'Dhyanesh',
    role: 'Technical Manager',
    badge: 'TECHNICAL LEAD',
    quote: 'Leading technical architectures, hackathons, and development sprints.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

// ─── DOMAINS & DEPARTMENTS ──────────────────────────────────────────────────
// Rules:
// - Lead is separate in middle (1 in row)
// - Remaining Co-leads/Managers grouped below as in Admin team (3 or 2 per row)
// - NO registration numbers or phone numbers

export const DOMAIN_TEAMS = [
  {
    id: 'technical',
    departmentNumber: '01',
    title: 'Technical Team',
    iconName: 'Code2',
    desc: 'Architecting scalable web platforms, core algorithmic frameworks, open-source repositories, and hackathon prototypes.',
    lead: {
      id: 'tech-lead',
      name: 'Krishna Chaitanya Kona',
      role: 'Team Lead',
      photo: '/team-photos/krishna_chaitanya.jpg',
      quote: 'Building foundational technical systems that power the chapter’s computational vision.',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    },
    members: [
      {
        id: 'tech-colead-1',
        name: 'Litheeswar Kakarla',
        role: 'Co-Lead',
        photo: '/team-photos/litheeswar.jpg',
        quote: 'Driving hands-on workshops, technical mentorship, and systems development.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'tech-colead-2',
        name: 'Dipanjana Ghosh',
        role: 'Co-Lead',
        photo: '/team-photos/dipanjana.jpg',
        quote: 'Fostering innovative student engineering and open-source contributions.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'tech-manager',
        name: 'Vishrabdha Chatterjee',
        role: 'Technical Project Manager',
        photo: '/team-photos/vishrabdha.jpg',
        quote: 'Coordinating core technical workflows, code reviews, and developer environments.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
  {
    id: 'events',
    departmentNumber: '02',
    title: 'Event Management Team',
    iconName: 'CalendarCheck',
    desc: 'Executing premier flagship hackathons, high-energy tech speaker summits, workshops, and student engagements.',
    lead: {
      id: 'event-lead',
      name: 'Thottempudi Likhith Raghav',
      role: 'Team Lead',
      photo: '/team-photos/thottempudi_raghav.jpg',
      quote: 'Curating seamless technical experiences and high-impact chapter gatherings.',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    },
    members: [
      {
        id: 'event-colead-1',
        name: 'Valupadasu Taneesh Kumar',
        role: 'Co-Lead',
        photo: '/team-photos/taneesh.jpg',
        quote: 'Coordinating event stages, timing, technical logistics, and crowd logistics.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'event-colead-2',
        name: 'G. Mohana Ramya',
        role: 'Co-Lead',
        quote: 'Managing participant registration flow, venue preparation, and team coordination.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
  {
    id: 'social-media',
    departmentNumber: '03',
    title: 'Social Media Team',
    iconName: 'Share2',
    desc: 'Amplifying chapter achievements, spotlighting members, and driving digital reach across global platforms.',
    lead: {
      id: 'social-lead',
      name: 'Vishwath',
      role: 'Team Lead',
      quote: 'Broadcasting the story of ACM VIT-AP to global student and developer networks.',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    },
    members: [
      {
        id: 'social-colead-1',
        name: 'Rudraraju Sahasra',
        role: 'Co-Lead',
        quote: 'Creating interactive social stories, campaigns, and community engagement posts.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'social-colead-2',
        name: 'Tulasi Ram P',
        role: 'Co-Lead',
        quote: 'Managing community announcements, event recaps, and digital analytics.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
  {
    id: 'creative',
    departmentNumber: '04',
    title: 'Creative and Design Team',
    iconName: 'Palette',
    desc: 'Crafting visually arresting graphic identities, 3D brand assets, user interfaces, and media motion designs.',
    lead: {
      id: 'creative-lead',
      name: 'Akshitha Baby',
      role: 'Team Lead',
      photo: '/team-photos/akshitha.jpg',
      quote: 'Designing the visual language of futuristic computing and interactive art.',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    },
    members: [
      {
        id: 'creative-colead',
        name: 'Prakhar Kumar Pandey',
        role: 'Co-Lead',
        quote: 'Transforming ideas into polished UI/UX aesthetics, posters, and 3D mockups.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
  {
    id: 'marketing',
    departmentNumber: '05',
    title: 'Marketing Team',
    iconName: 'Megaphone',
    desc: 'Forging corporate outreach, expanding sponsorships, public relations, and cross-chapter collaborations.',
    lead: null,
    members: [
      {
        id: 'marketing-lead-1',
        name: 'Geethika Varma Sagiraju',
        role: 'Manager',
        photo: '/team-photos/geethika.jpg',
        quote: 'Strategic positioning and outreach to industry leaders and corporate sponsors.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'marketing-lead-2',
        name: 'G Hansika Reddy',
        role: 'Manager',
        photo: '/team-photos/hansika.jpg',
        quote: 'Driving campaign promotions, brand visibility, and sponsor relations.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
  {
    id: 'project-research',
    departmentNumber: '06',
    title: 'Project and Research Team',
    iconName: 'FlaskConical',
    desc: 'Exploring deep computing paradigms, machine intelligence, papers, and production-grade prototypes.',
    lead: {
      id: 'research-lead',
      name: 'Tanuj R',
      role: 'Team Lead',
      photo: '/team-photos/tanuj.jpg',
      quote: 'Investigating next-generation algorithms and guiding open project explorations.',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    },
    members: [
      {
        id: 'research-colead',
        name: 'Sneha Datta',
        role: 'Co-Lead',
        photo: '/team-photos/sneha.jpg',
        quote: 'Mentoring collaborative development repositories and research tracks.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
  {
    id: 'documentation',
    departmentNumber: '07',
    title: 'Documentation Team',
    iconName: 'FileText',
    desc: 'Maintaining meticulous reports, technical documentation, event retrospectives, and official publications.',
    lead: {
      id: 'doc-lead',
      name: 'Venuturumilli Tejaswini',
      role: 'Team Lead',
      photo: '/team-photos/tejaswini.jpg',
      quote: 'Chronicle of our technical journey, preserving knowledge for future generations.',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    },
    members: [
      {
        id: 'doc-colead',
        name: 'Vudutha Venkata Subash',
        role: 'Co-Lead',
        photo: '/team-photos/subash.jpg',
        quote: 'Drafting structured whitepapers, manuals, and comprehensive event records.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },
];
