export interface USCity {
  city: string;
  state: string;
  stateName: string;
  population?: number;
}

export interface BusinessNiche {
  id: string;
  name: string;
  category: string; // Geoapify category or fallback tag
  defaultKeywords: string[];
  commonProblems: string[];
}

export interface Lead {
  id: string;
  name: string;
  website: string;
  address?: string;
  city: string;
  state: string;
  phone?: string;
  category: string;
  
  // Scraped contact details
  foundEmail?: string;
  emailSourceUrl?: string;
  emailExtractionStatus: 'pending' | 'found' | 'not_found' | 'error';
  allScrapedEmails?: string[];

  // Screenshot details
  screenshotUrl?: string;
  screenshotStatus: 'pending' | 'captured' | 'failed';

  // AI Audit
  auditScore?: number; // 0-100
  auditStatus: 'pending' | 'auditing' | 'completed' | 'failed';
  auditDetails?: {
    observation: string;
    insight: string;
    gap: string;
    conversionBottlenecks: string[];
    quickWins: string[];
    mobileUsabilityScore: number;
    trustSignalScore: number;
    ctaClarityScore: number;
  };

  // Cold Email Draft
  emailDraft?: {
    toEmail: string;
    subject: string;
    body: string;
    signature: string;
  };
}

export type ProcessingStep = 
  | 'idle'
  | 'scraping'
  | 'extracting_emails'
  | 'capturing_screenshots'
  | 'auditing'
  | 'drafting'
  | 'completed'
  | 'error';

export interface SearchParams {
  city: string;
  state: string;
  nicheId: string;
  limit: number;
}
