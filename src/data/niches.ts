import { BusinessNiche } from '../types';

export const BUSINESS_NICHES: BusinessNiche[] = [
  {
    id: 'dentist',
    name: 'Dentists & Dental Care',
    category: 'healthcare.dentist',
    defaultKeywords: ['dentist', 'dental', 'teeth cleaning', 'orthodontics'],
    commonProblems: ['Outdated appointment booking CTA', 'Missing emergency consultation banner', 'Slow mobile page load times']
  },
  {
    id: 'restaurant',
    name: 'Restaurants & Dining',
    category: 'catering.restaurant',
    defaultKeywords: ['restaurant', 'dining', 'bistro', 'grill'],
    commonProblems: ['PDF menu links instead of interactive mobile menu', 'Hard to find table reservation button', 'No direct online ordering CTA']
  },
  {
    id: 'lawyer',
    name: 'Lawyers & Legal Services',
    category: 'service.financial,service.financial.lawyer,office',
    defaultKeywords: ['law firm', 'lawyer', 'attorney', 'legal counsel'],
    commonProblems: ['Vague hero value proposition', 'Missing instant case evaluation form above fold', 'Lack of recent client review badges']
  },
  {
    id: 'plumbing_hvac',
    name: 'Plumbing & HVAC Services',
    category: 'service',
    defaultKeywords: ['plumbing', 'hvac', 'air conditioning', 'heating repair'],
    commonProblems: ['Click-to-call phone number not sticky on mobile', 'Missing 24/7 emergency dispatch notice', 'No instant quote estimator']
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agencies',
    category: 'service.financial.real_estate',
    defaultKeywords: ['realty', 'real estate agent', 'property management'],
    commonProblems: ['Property search filter breaks on mobile screens', 'No instant home valuation lead magnet', 'Slow image carousel loading']
  },
  {
    id: 'roofing',
    name: 'Roofing Contractors',
    category: 'service',
    defaultKeywords: ['roofing contractor', 'roof repair', 'commercial roofing'],
    commonProblems: ['Missing instant inspection request button', 'No before/after roof restoration gallery', 'Lack of storm damage consultation hero widget']
  },
  {
    id: 'marketing_agency',
    name: 'Digital Marketing & Web Agencies',
    category: 'office',
    defaultKeywords: ['marketing agency', 'digital marketing', 'web design firm'],
    commonProblems: ['Generic service list without video case studies', 'Missing interactive ROI calculator', 'Confusing primary action button']
  },
  {
    id: 'auto_repair',
    name: 'Auto Repair & Mechanics',
    category: 'service.vehicle',
    defaultKeywords: ['auto repair', 'mechanic', 'car service', 'brake repair'],
    commonProblems: ['No online service scheduling system', 'Missing warranty guarantee badge', 'Hard to view service list on phone']
  },
  {
    id: 'accounting_cpa',
    name: 'Accounting & CPA Firms',
    category: 'service.financial',
    defaultKeywords: ['cpa', 'accounting firm', 'tax consultant', 'bookkeeping'],
    commonProblems: ['Missing free tax review offer', 'No client portal direct login CTA', 'Overly complex legal jargon on homepage']
  },
  {
    id: 'chiropractic',
    name: 'Chiropractic Clinics',
    category: 'healthcare',
    defaultKeywords: ['chiropractor', 'spine care', 'wellness clinic'],
    commonProblems: ['Missing $29 new patient exam special offer banner', 'No online intake form download', 'Hidden address and parking instructions']
  },
  {
    id: 'medspa',
    name: 'Med Spas & Aesthetic Clinics',
    category: 'healthcare,service',
    defaultKeywords: ['medspa', 'botox', 'laser clinic', 'skincare center'],
    commonProblems: ['Missing virtual consultation booking widget', 'No treatment pricing table or financing options', 'Low resolution result photos']
  },
  {
    id: 'fitness_gym',
    name: 'Fitness & Gym Centers',
    category: 'sport.fitness',
    defaultKeywords: ['gym', 'fitness club', 'crossfit', 'personal trainer'],
    commonProblems: ['Missing 1-Day free pass claim form', 'Class schedule hidden 3 clicks deep', 'No virtual gym tour video']
  }
];
