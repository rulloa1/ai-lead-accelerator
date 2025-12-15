import { Lead, PitchTemplate } from '@/types/lead';

export const mockLeads: Lead[] = [
  {
    id: '1',
    businessName: 'Golden Gate Restaurant Group',
    industry: 'Restaurants',
    location: 'San Francisco, CA',
    size: '50-100 employees',
    website: 'goldengaterestaurants.com',
    qualityScore: 92,
    status: 'new',
    email: 'contact@ggrestaurants.com',
    phone: '(415) 555-0123',
    contactName: 'Michael Chen',
    notes: [],
    contactHistory: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    businessName: 'Sterling Law Partners',
    industry: 'Law Firms',
    location: 'New York, NY',
    size: '20-50 employees',
    website: 'sterlinglawpartners.com',
    qualityScore: 88,
    status: 'contacted',
    email: 'info@sterlinglaw.com',
    phone: '(212) 555-0456',
    contactName: 'Sarah Williams',
    notes: [
      { id: '1', content: 'Expressed interest in AI document review', createdAt: new Date('2024-01-16') }
    ],
    contactHistory: [
      { id: '1', type: 'email', description: 'Initial outreach email sent', createdAt: new Date('2024-01-16') }
    ],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    businessName: 'Sunset Properties',
    industry: 'Real Estate',
    location: 'Los Angeles, CA',
    size: '10-20 employees',
    website: 'sunsetproperties.com',
    qualityScore: 85,
    status: 'interested',
    email: 'hello@sunsetprop.com',
    phone: '(310) 555-0789',
    contactName: 'David Rodriguez',
    notes: [
      { id: '1', content: 'Very interested in AI property valuation tool', createdAt: new Date('2024-01-17') }
    ],
    contactHistory: [
      { id: '1', type: 'email', description: 'Sent product demo link', createdAt: new Date('2024-01-15') },
      { id: '2', type: 'call', description: 'Follow-up call - interested in demo', outcome: 'Scheduled demo for next week', createdAt: new Date('2024-01-17') }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    businessName: 'Metro Dental Care',
    industry: 'Healthcare',
    location: 'Chicago, IL',
    size: '5-10 employees',
    website: 'metrodentalcare.com',
    qualityScore: 78,
    status: 'new',
    email: 'appointments@metrodental.com',
    phone: '(312) 555-0234',
    contactName: 'Dr. Emily Park',
    notes: [],
    contactHistory: [],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '5',
    businessName: 'TechFlow Solutions',
    industry: 'Technology',
    location: 'Austin, TX',
    size: '100-200 employees',
    website: 'techflowsolutions.io',
    qualityScore: 94,
    status: 'contacted',
    email: 'partnerships@techflow.io',
    phone: '(512) 555-0567',
    contactName: 'James Thompson',
    notes: [],
    contactHistory: [
      { id: '1', type: 'linkedin', description: 'Connected on LinkedIn', createdAt: new Date('2024-01-12') }
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '6',
    businessName: 'Artisan Coffee Co',
    industry: 'Restaurants',
    location: 'Seattle, WA',
    size: '20-50 employees',
    website: 'artisancoffeeco.com',
    qualityScore: 81,
    status: 'not-interested',
    email: 'info@artisancoffee.com',
    phone: '(206) 555-0890',
    contactName: 'Lisa Anderson',
    notes: [
      { id: '1', content: 'Not looking for AI solutions at this time', createdAt: new Date('2024-01-14') }
    ],
    contactHistory: [
      { id: '1', type: 'call', description: 'Cold call - not interested', outcome: 'Politely declined', createdAt: new Date('2024-01-14') }
    ],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '7',
    businessName: 'Pacific Northwest Realty',
    industry: 'Real Estate',
    location: 'Portland, OR',
    size: '10-20 employees',
    website: 'pnwrealty.com',
    qualityScore: 89,
    status: 'closed',
    email: 'team@pnwrealty.com',
    phone: '(503) 555-0123',
    contactName: 'Mark Johnson',
    notes: [
      { id: '1', content: 'Signed 1-year contract for AI assistant', createdAt: new Date('2024-01-19') }
    ],
    contactHistory: [
      { id: '1', type: 'email', description: 'Initial outreach', createdAt: new Date('2024-01-05') },
      { id: '2', type: 'meeting', description: 'Product demo', outcome: 'Very positive feedback', createdAt: new Date('2024-01-10') },
      { id: '3', type: 'call', description: 'Pricing discussion', outcome: 'Agreed to terms', createdAt: new Date('2024-01-18') }
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19'),
  },
];

export const pitchTemplates: PitchTemplate[] = [
  {
    id: '1',
    name: 'Restaurant AI Assistant',
    industry: 'Restaurants',
    painPoints: [
      'High staff turnover and training costs',
      'Inconsistent customer service quality',
      'Difficulty managing reservations and orders',
      'Time-consuming inventory management',
    ],
    solutions: [
      'AI-powered chatbot for 24/7 customer inquiries',
      'Automated reservation and waitlist management',
      'Smart inventory forecasting to reduce waste',
      'Staff training assistant with instant answers',
    ],
    emailTemplate: `Dear {{contactName}},

I noticed {{businessName}} has been making waves in the {{location}} restaurant scene. As you scale, I imagine managing customer inquiries, reservations, and operations becomes increasingly complex.

We've helped similar restaurant groups reduce response times by 80% and cut operational costs by 30% with our AI assistant solution.

Would you be open to a 15-minute call to explore how this could work for {{businessName}}?

Best regards`,
  },
  {
    id: '2',
    name: 'Law Firm Document AI',
    industry: 'Law Firms',
    painPoints: [
      'Time-intensive document review processes',
      'Risk of human error in contract analysis',
      'High associate burnout from repetitive tasks',
      'Difficulty scaling with client demands',
    ],
    solutions: [
      'AI-powered document review and analysis',
      'Automated contract clause detection',
      'Legal research assistant with citation tracking',
      'Client communication automation',
    ],
    emailTemplate: `Dear {{contactName}},

Legal teams at firms like {{businessName}} often spend 60%+ of their time on document review. What if you could reclaim that time for higher-value work?

Our AI document analysis platform has helped law firms reduce review time by 70% while improving accuracy.

I'd love to share a brief case study relevant to {{industry}}. Are you available for a quick call this week?

Best regards`,
  },
  {
    id: '3',
    name: 'Real Estate AI Platform',
    industry: 'Real Estate',
    painPoints: [
      'Slow response to property inquiries',
      'Manual property valuation processes',
      'Difficulty qualifying leads efficiently',
      'Time spent on repetitive client questions',
    ],
    solutions: [
      'AI chatbot for instant property inquiries',
      'Automated property valuation estimates',
      'Smart lead scoring and qualification',
      'Virtual tour scheduling automation',
    ],
    emailTemplate: `Dear {{contactName}},

In today's market, the first agent to respond often wins the deal. Is {{businessName}} able to respond to every inquiry within minutes?

Our AI platform helps real estate teams respond instantly, qualify leads automatically, and close 40% more deals.

Would you be interested in seeing how this works for agencies in {{location}}?

Best regards`,
  },
];

export const industries = [
  'All Industries',
  'Restaurants',
  'Law Firms',
  'Real Estate',
  'Healthcare',
  'Technology',
  'Retail',
  'Finance',
  'Manufacturing',
];

export const locations = [
  'All Locations',
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Austin, TX',
  'Seattle, WA',
  'Portland, OR',
  'Boston, MA',
];

export const companySizes = [
  'All Sizes',
  '1-5 employees',
  '5-10 employees',
  '10-20 employees',
  '20-50 employees',
  '50-100 employees',
  '100-200 employees',
  '200+ employees',
];
