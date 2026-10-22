// ---------------------------------------------------------------------------
// src/data/events.js — ACM VIT-AP Featured Events Data
// ---------------------------------------------------------------------------

export const EVENT_CATEGORIES = [
  'All Events',
  'Workshops',
  'Tech Talks',
  'Hackathons',
  'Competitions',
  'Community',
];

export const EVENTS_DATA = [
  {
    id: 'prompt-battle',
    category: 'Competitions',
    tag: 'Competition · Offline',
    dateBadge: '12 OCT',
    title: 'PROMPT BATTLE',
    subtitle: 'Build. Compete. Innovate.',
    description: 'High-stakes generative AI prompting showdown testing speed, prompt engineering, and visual synthesis.',
    image: '/assets/panels/08-events-section.jpg',
    status: 'Upcoming',
    attendees: '250+ registered',
  },
  {
    id: 'web-dev-workshop',
    category: 'Workshops',
    tag: 'Workshop · Hands-on',
    dateBadge: '22 OCT',
    title: 'WEB DEV WORKSHOP',
    subtitle: 'Hands-on learning.',
    description: 'Master fullstack React, modern 3D WebGL interactions, and production cloud deployments.',
    image: '/assets/panels/08-events-section.jpg',
    status: 'Open',
    attendees: '180+ registered',
  },
  {
    id: 'ai-and-beyond',
    category: 'Tech Talks',
    tag: 'Tech Talk · Hybrid',
    dateBadge: '05 NOV',
    title: 'AI & BEYOND',
    subtitle: 'Learn from industry experts.',
    description: 'Deep dive into large language models, agentic workflows, and the future of autonomous intelligence.',
    image: '/assets/panels/08-events-section.jpg',
    status: 'Upcoming',
    attendees: '320+ registered',
  },
  {
    id: 'acm-quest-hackathon',
    category: 'Hackathons',
    tag: 'Hackathon · 24-Hour',
    dateBadge: '18 NOV',
    title: 'ACM QUEST',
    subtitle: 'Code through the night.',
    description: 'Annual flagship 24-hour hackathon tackling real-world challenges in AI, Web3, and systems architecture.',
    image: '/eventspictures/acmquest.png',
    status: 'Registrations Open',
    attendees: '500+ participants',
  },
];
