export type LeadStatus = 'new' | 'contacted' | 'interested' | 'not-interested' | 'closed';

export interface Lead {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  qualityScore: number;
  status: LeadStatus;
  email?: string;
  phone?: string;
  contactName?: string;
  notes: Note[];
  contactHistory: ContactEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

export interface ContactEvent {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'linkedin' | 'other';
  description: string;
  outcome?: string;
  createdAt: Date;
}

export interface PitchTemplate {
  id: string;
  name: string;
  industry: string;
  painPoints: string[];
  solutions: string[];
  emailTemplate: string;
}

export interface SearchFilters {
  industry: string;
  location: string;
  size: string;
  minScore: number;
}
