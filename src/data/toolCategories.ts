// ============================================
// SHARED TYPES FOR AI TOOL MATCHER
// ============================================

export type ToolCategory =
  | 'AP/AR Automation'
  | 'Accounting & Finance'
  | 'Audit Data Analytics'
  | 'Audit Management'
  | 'Business Intelligence & Analytics'
  | 'Business Intelligence & Reporting'
  | 'CRM & Client Management'
  | 'Communication & Collaboration'
  | 'Contract Management'
  | 'Customer Service & Support'
  | 'Cybersecurity'
  | 'Data Analytics & Visualization'
  | 'Data Governance & Privacy'
  | 'Database & Data Warehousing'
  | 'Document Management'
  | 'Expense Management'
  | 'File Storage & Document Management'
  | 'Financial Close & Reconciliation'
  | 'Fraud Detection & Forensics'
  | 'General Ledger & ERP'
  | 'Generative AI & Automation'
  | 'HR & Talent Management'
  | 'Knowledge Management'
  | 'Learning & Development'
  | 'Marketing Automation'
  | 'Project Management'
  | 'Risk & Compliance'
  | 'Risk Management & Compliance'
  | 'SEO & Digital Marketing'
  | 'Sales Enablement'
  | 'Social Media Management'
  | 'Tax Compliance'
  | 'Tax Provision & Research'
  | 'Time Tracking & Billing'
  | 'Time Tracking & Productivity'
  | 'Video Conferencing & Webinars'
  | 'Website & CMS';

export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise';

export type PricingTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface ToolRating {
  source: string;
  score: number;
  reviewCount: number;
  lastUpdated?: string;
}

export interface CaseStudy {
  company: string;
  industry: string;
  outcome: string;
  roi?: string;
  source?: string;
}

export interface Integration {
  toolName: string;
  integrationType: 'native' | 'api' | 'manual' | 'zapier' | 'webhook';
  complexity: 'easy' | 'medium' | 'complex';
}
