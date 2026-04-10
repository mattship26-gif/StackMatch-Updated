// ============================================
// SHARED TYPES FOR STACKMATCH
// ============================================

export type ToolCategory =
  // ── Finance & Accounting ──────────────────
  | 'AP/AR Automation'
  | 'Accounting & Finance'
  | 'Audit Data Analytics'
  | 'Audit Management'
  | 'Expense Management'
  | 'Financial Close & Reconciliation'
  | 'Fraud Detection & Forensics'
  | 'General Ledger & ERP'
  | 'Tax Compliance'
  | 'Tax Provision & Research'
  // ── AI & Automation ───────────────────────
  | 'AI Coding & Developer Tools'
  | 'AI Customer Service & Chatbots'
  | 'AI Data Analysis & Research'
  | 'AI Image & Creative Generation'
  | 'AI Meeting & Productivity'
  | 'AI Sales & Outreach Automation'
  | 'AI Writing & Content Generation'
  | 'Generative AI & Automation'
  | 'No-Code / Low-Code Platforms'
  // ── Sales & Marketing ─────────────────────
  | 'CRM & Client Management'
  | 'Marketing Automation'
  | 'SEO & Digital Marketing'
  | 'Sales Enablement'
  | 'Social Media Management'
  | 'Website & CMS'
  | 'E-Commerce Platforms'
  | 'Product Analytics'
  // ── Engineering & Infrastructure ──────────
  | 'Cloud Infrastructure & DevOps'
  | 'API & Integration Platforms'
  | 'Database & Data Warehousing'
  | 'Cybersecurity'
  | 'Data Governance & Privacy'
  // ── People & Operations ───────────────────
  | 'Communication & Collaboration'
  | 'HR & Talent Management'
  | 'Learning & Development'
  | 'Time Tracking & Billing'
  | 'Time Tracking & Productivity'
  | 'Video Conferencing & Webinars'
  // ── Data & Intelligence ───────────────────
  | 'Business Intelligence & Analytics'
  | 'Business Intelligence & Reporting'
  | 'Data Analytics & Visualization'
  // ── Legal, Risk & Compliance ──────────────
  | 'Contract Management'
  | 'Document Management'
  | 'File Storage & Document Management'
  | 'Knowledge Management'
  | 'Risk & Compliance'
  | 'Risk Management & Compliance'
  // ── Customer Experience ───────────────────
  | 'Customer Service & Support'
  | 'Project Management';

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

export interface AITool {
  id: string;
  name: string;
  category: ToolCategory;
  subCategory?: string;
  description: string;
  detailedDescription: string;
  primaryRoles: string[];
  seniorityLevels: ('staff' | 'senior' | 'manager' | 'director' | 'partner')[];
  bestFor: CompanySize[];
  industries?: string[];
  pricingTier: PricingTier;
  pricingDetails: string;
  ratings: ToolRating[];
  caseStudies?: CaseStudy[];
  integrations: Integration[];
  learningCurve: 'easy' | 'medium' | 'steep';
  implementationTime: string;
  keyFeatures: string[];
  whenToUse: string;
  whenNotToUse: string;
  website: string;
  documentation?: string;
}
