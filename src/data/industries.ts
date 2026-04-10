// ============================================
// INDUSTRY DEFINITIONS
// Each industry has: metadata, compliance needs,
// recommended tool categories, curated stacks,
// and key pain points.
// ============================================

export type IndustrySlug =
  | 'accounting-finance'
  | 'legal'
  | 'healthcare'
  | 'saas-tech'
  | 'ecommerce-retail'
  | 'marketing-agency'
  | 'manufacturing'
  | 'real-estate'
  | 'education'
  | 'construction';

export interface IndustryStack {
  label: string;       // e.g. "Starter Stack"
  companySize: string; // e.g. "1-20 people"
  toolIds: string[];
  description: string;
}

export interface ComplianceRequirement {
  name: string;        // e.g. "HIPAA"
  description: string;
  critical: boolean;
}

export interface Industry {
  slug: IndustrySlug;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  painPoints: string[];
  complianceRequirements: ComplianceRequirement[];
  priorityCategories: string[];
  stacks: IndustryStack[];
  avoidTools: { toolId: string; reason: string }[];
}

export const industries: Industry[] = [
  // ============================================
  // ACCOUNTING & FINANCE
  // ============================================
  {
    slug: 'accounting-finance',
    name: 'Accounting & Finance',
    emoji: '📊',
    tagline: 'From close to compliance, tools built for numbers people.',
    description: 'Accounting and finance teams need tools that handle auditability, multi-entity reporting, and regulatory compliance. The right stack reduces manual reconciliation and close time dramatically.',
    painPoints: [
      'Month-end close takes too long',
      'Manual reconciliation across multiple systems',
      'Audit prep is a fire drill every year',
      'Expense reports are a black hole',
      'Tax compliance across multiple states/jurisdictions',
    ],
    complianceRequirements: [
      { name: 'SOX', description: 'Sarbanes-Oxley requires audit trails, access controls, and financial reporting accuracy for public companies.', critical: true },
      { name: 'GAAP/IFRS', description: 'Accounting standards require specific reporting formats and revenue recognition rules.', critical: true },
      { name: 'SOC 2', description: 'Service providers handling financial data need SOC 2 Type II certification.', critical: false },
    ],
    priorityCategories: [
      'General Ledger & ERP',
      'Financial Close & Reconciliation',
      'Audit Management',
      'Tax Compliance',
      'Expense Management',
      'AP/AR Automation',
    ],
    stacks: [
      {
        label: 'Small Firm Starter',
        companySize: '1–20 people',
        toolIds: ['quickbooks-online', 'expensify', 'docusign', 'toggl-track', 'google-drive'],
        description: 'Lightweight, affordable stack for small practices or startups. QuickBooks handles the core accounting; everything else plugs in natively.',
      },
      {
        label: 'Mid-Market Power Stack',
        companySize: '20–200 people',
        toolIds: ['sage-intacct', 'floqast', 'expensify', 'avalara', 'docusign', 'tableau'],
        description: 'Sage Intacct handles multi-entity accounting; FloQast cuts close time by 30-40%; Avalara automates sales tax. A proven combination.',
      },
      {
        label: 'Enterprise Close Stack',
        companySize: '200+ people',
        toolIds: ['netsuite', 'blackline', 'coupa', 'onesource', 'auditboard', 'workday-financial-management'],
        description: 'Enterprise-grade close and compliance. BlackLine + NetSuite is the gold standard for teams that need SOX compliance and zero tolerance for reconciliation errors.',
      },
    ],
    avoidTools: [
      { toolId: 'quickbooks-online', reason: 'Outgrows fast above ~50 employees or with multi-entity needs — migrate before you're forced to.' },
      { toolId: 'freshbooks', reason: 'Built for freelancers, not accounting teams. Lacks audit trails and multi-entity support.' },
    ],
  },

  // ============================================
  // LEGAL
  // ============================================
  {
    slug: 'legal',
    name: 'Legal',
    emoji: '⚖️',
    tagline: 'Reduce risk, accelerate deals, and keep the paper trail clean.',
    description: 'Legal teams are drowning in contracts, deadlines, and compliance obligations. The right stack replaces email chains with auditable workflows and cuts contract cycle times in half.',
    painPoints: [
      'Contract review is a bottleneck for every deal',
      'No visibility into contract status or obligations',
      'Document versioning and storage is a mess',
      'Billing and time tracking is manual',
      'Matter management happens in spreadsheets',
    ],
    complianceRequirements: [
      { name: 'Attorney-Client Privilege', description: 'Document management systems must support privilege logs and confidentiality controls.', critical: true },
      { name: 'Data Residency', description: 'Certain matters require data to stay within specific jurisdictions.', critical: true },
      { name: 'SOC 2 Type II', description: 'Any cloud platform handling client data should have SOC 2 Type II certification.', critical: true },
      { name: 'GDPR/CCPA', description: 'Client data handling must comply with applicable privacy regulations.', critical: false },
    ],
    priorityCategories: [
      'Contract Management',
      'Document Management',
      'Time Tracking & Billing',
      'Project Management',
      'CRM & Client Management',
    ],
    stacks: [
      {
        label: 'Solo / Small Firm',
        companySize: '1–10 people',
        toolIds: ['clio', 'docusign', 'google-drive', 'toggl-track', 'notion'],
        description: 'Clio is the go-to for small law firms — it handles matter management, billing, and client portal in one place. Notion for internal knowledge.',
      },
      {
        label: 'Mid-Size Firm',
        companySize: '10–100 people',
        toolIds: ['ironclad', 'netdocuments', 'harvest', 'salesforce', 'docusign', 'sharepoint'],
        description: 'Ironclad for contract lifecycle management; NetDocuments for secure document management with privilege controls; Salesforce for client relationships.',
      },
      {
        label: 'In-House Legal Team',
        companySize: 'Corporate legal department',
        toolIds: ['ironclad', 'contractworks', 'docusign', 'sharepoint', 'microsoft-project', 'tableau'],
        description: 'In-house teams prioritize contract visibility and cross-functional workflow. Ironclad connects legal to the business; SharePoint keeps documents in the Microsoft ecosystem most companies already use.',
      },
    ],
    avoidTools: [
      { toolId: 'google-drive', reason: 'Lacks version control, permission audit trails, and matter-level organization needed for legal work at scale.' },
      { toolId: 'trello', reason: 'Not built for matter management — no time tracking, billing, or client portal.' },
    ],
  },

  // ============================================
  // HEALTHCARE
  // ============================================
  {
    slug: 'healthcare',
    name: 'Healthcare',
    emoji: '🏥',
    tagline: 'HIPAA-compliant tools that actually work for clinical and admin teams.',
    description: 'Healthcare organizations face the strictest compliance requirements of any industry. Every tool must be HIPAA-compliant, and the wrong choice can result in six-figure fines. We only surface tools with verified Business Associate Agreements.',
    painPoints: [
      'HIPAA compliance is non-negotiable but confusing to verify',
      'Clinical and admin teams use completely different tools',
      'Patient data is siloed across dozens of systems',
      'Staff scheduling and HR is a logistical nightmare',
      'Billing and revenue cycle is a constant fire',
    ],
    complianceRequirements: [
      { name: 'HIPAA BAA', description: 'Any tool handling PHI (Protected Health Information) must sign a Business Associate Agreement. Non-negotiable.', critical: true },
      { name: 'HITECH', description: 'Enhanced HIPAA enforcement — requires breach notification and stricter security controls.', critical: true },
      { name: 'SOC 2 Type II', description: 'Required for cloud-based tools handling patient data.', critical: true },
      { name: 'FedRAMP', description: 'Required for tools used in government healthcare programs (VA, CMS, etc.).', critical: false },
    ],
    priorityCategories: [
      'HR & Talent Management',
      'Communication & Collaboration',
      'Document Management',
      'Project Management',
      'Data Analytics & Visualization',
      'Cybersecurity',
    ],
    stacks: [
      {
        label: 'Small Practice',
        companySize: '1–25 staff',
        toolIds: ['microsoft-copilot', 'onedrive-sharepoint', 'bamboohr', 'power-bi', 'okta'],
        description: 'Microsoft 365 ecosystem is HIPAA-compliant out of the box with a BAA. SharePoint for documents, Teams for communication, Power BI for reporting.',
      },
      {
        label: 'Mid-Size Health System',
        companySize: '25–500 staff',
        toolIds: ['workday', 'onedrive-sharepoint', 'okta', 'crowdstrike', 'tableau', 'servicenow'],
        description: 'Workday for HR with healthcare-specific modules; Okta for identity and access management; CrowdStrike for endpoint protection. A defensible security posture.',
      },
      {
        label: 'Large Health System',
        companySize: '500+ staff',
        toolIds: ['workday', 'servicenow', 'crowdstrike', 'okta', 'splunk', 'tableau', 'blackline'],
        description: 'Enterprise-grade stack with full audit trails. Splunk for security monitoring; ServiceNow for IT and facilities management; BlackLine for finance close.',
      },
    ],
    avoidTools: [
      { toolId: 'slack', reason: 'Standard Slack does not sign a HIPAA BAA. Slack for Enterprise Grid does — but confirm before any PHI is sent.' },
      { toolId: 'google-drive', reason: 'Google does offer a HIPAA BAA, but requires specific configuration. Default consumer accounts are NOT HIPAA compliant.' },
      { toolId: 'dropbox-business', reason: 'Dropbox Business Plus and above offer a BAA — but verify your plan before using for PHI.' },
    ],
  },

  // ============================================
  // SAAS & TECH
  // ============================================
  {
    slug: 'saas-tech',
    name: 'SaaS & Technology',
    emoji: '💻',
    tagline: 'Move fast without breaking things — or your team.',
    description: 'Tech companies need tools that integrate deeply, have strong APIs, and scale from 5 to 500 without forcing a migration. The best SaaS stacks are opinionated but flexible.',
    painPoints: [
      'Too many tools, not enough integration',
      'Engineering velocity slows as the team grows',
      'Sales and product don\'t have a shared view of the customer',
      'Onboarding new hires takes too long',
      'Data is everywhere but insights are hard to get',
    ],
    complianceRequirements: [
      { name: 'SOC 2 Type II', description: 'Most enterprise customers will require your vendors to have SOC 2. Use tools that can help you achieve it.', critical: true },
      { name: 'GDPR', description: 'If you have EU customers, every tool handling their data needs to comply.', critical: true },
      { name: 'ISO 27001', description: 'Required for some enterprise contracts, especially in Europe.', critical: false },
    ],
    priorityCategories: [
      'Project Management',
      'CRM & Client Management',
      'Communication & Collaboration',
      'Generative AI & Automation',
      'Data Analytics & Visualization',
      'HR & Talent Management',
    ],
    stacks: [
      {
        label: 'Early Stage (Seed)',
        companySize: '1–15 people',
        toolIds: ['notion', 'hubspot-crm', 'github-copilot', 'zapier', 'google-analytics', 'toggl-track'],
        description: 'Notion for everything. HubSpot free CRM. GitHub Copilot to ship faster. Zapier to avoid building integrations. Keep it lean — you\'ll change this stack at Series A anyway.',
      },
      {
        label: 'Growth Stage (Series A/B)',
        companySize: '15–100 people',
        toolIds: ['jira', 'salesforce', 'notion', 'github-copilot', 'looker', 'rippling', 'intercom'],
        description: 'Jira for engineering; Salesforce when you have a real sales team; Looker for data; Rippling for fast hiring. This is the most common growth-stage SaaS stack.',
      },
      {
        label: 'Scale Stage (Series C+)',
        companySize: '100+ people',
        toolIds: ['jira', 'salesforce', 'workday', 'tableau', 'servicenow', 'okta', 'crowdstrike', 'drata'],
        description: 'Formalize everything. Workday for HR; Okta for SSO; Drata for SOC 2 automation; ServiceNow for IT. This is the stack that enterprise customers want to see.',
      },
    ],
    avoidTools: [
      { toolId: 'monday', reason: 'Great for non-technical teams, but engineers will fight it. Jira or Linear are better for product/eng.' },
      { toolId: 'freshbooks', reason: 'Not built for SaaS billing models, subscriptions, or multi-currency. Use Stripe Billing or Recurly instead.' },
    ],
  },

  // ============================================
  // E-COMMERCE & RETAIL
  // ============================================
  {
    slug: 'ecommerce-retail',
    name: 'E-Commerce & Retail',
    emoji: '🛍️',
    tagline: 'Tools that turn browsers into buyers and buyers into fans.',
    description: 'E-commerce teams need a tight loop between marketing, operations, and customer service. The best retail stacks are obsessed with the customer journey from first click to repeat purchase.',
    painPoints: [
      'Customer acquisition costs are rising — retention is the new growth',
      'Inventory and fulfillment visibility is lagging',
      'Marketing and ops don\'t share data',
      'Customer service is reactive, not proactive',
      'Reporting is spreadsheet-based and always out of date',
    ],
    complianceRequirements: [
      { name: 'PCI DSS', description: 'Any system handling payment card data must be PCI compliant. Use platforms that abstract this away.', critical: true },
      { name: 'GDPR/CCPA', description: 'Customer data collection and marketing consent must comply with privacy laws.', critical: true },
      { name: 'ADA/WCAG', description: 'Website accessibility requirements increasingly enforced via litigation.', critical: false },
    ],
    priorityCategories: [
      'CRM & Client Management',
      'Marketing Automation',
      'Customer Service & Support',
      'Data Analytics & Visualization',
      'Social Media Management',
      'Website & CMS',
    ],
    stacks: [
      {
        label: 'DTC Startup',
        companySize: '1–20 people',
        toolIds: ['shopify', 'mailchimp', 'hubspot-crm', 'hootsuite', 'google-analytics', 'zendesk'],
        description: 'Shopify for the store; Mailchimp for email; HubSpot for customer data; Zendesk for support. This stack gets you to $5M ARR without major changes.',
      },
      {
        label: 'Mid-Market Retailer',
        companySize: '20–200 people',
        toolIds: ['shopify', 'klaviyo', 'salesforce', 'zendesk', 'sprout-social', 'tableau', 'google-analytics'],
        description: 'Klaviyo replaces Mailchimp for serious email/SMS marketing. Salesforce for customer data at scale. Tableau to understand your cohorts.',
      },
      {
        label: 'Omnichannel Enterprise',
        companySize: '200+ people',
        toolIds: ['salesforce', 'marketo', 'zendesk', 'tableau', 'sprout-social', 'semrush', 'workday'],
        description: 'Full-stack enterprise retail. Marketo for marketing automation at scale; Salesforce Service Cloud for customer service; Tableau for unified retail analytics.',
      },
    ],
    avoidTools: [
      { toolId: 'wix', reason: 'Not built for e-commerce at any meaningful scale. Move to Shopify or Salesforce Commerce Cloud early.' },
      { toolId: 'mailchimp', reason: 'Fine for newsletters, but Klaviyo is purpose-built for e-commerce with far better segmentation and attribution.' },
    ],
  },

  // ============================================
  // MARKETING & CREATIVE AGENCY
  // ============================================
  {
    slug: 'marketing-agency',
    name: 'Marketing & Creative Agency',
    emoji: '🎨',
    tagline: 'Win more clients. Deliver better work. Keep your team sane.',
    description: 'Agencies live and die by utilization, client satisfaction, and on-time delivery. The right stack makes client reporting automatic, project management effortless, and creative work faster.',
    painPoints: [
      'Time tracking is inconsistent — billing accuracy suffers',
      'Client reporting takes hours every week',
      'Project scope creep is constant',
      'Creative approvals and feedback loops are chaotic',
      'New business pipeline is managed in spreadsheets',
    ],
    complianceRequirements: [
      { name: 'GDPR/CCPA', description: 'Campaign data and customer lists require proper consent management.', critical: true },
      { name: 'Brand Safety', description: 'Ad placements and content need brand safety controls for client work.', critical: false },
    ],
    priorityCategories: [
      'Project Management',
      'Time Tracking & Billing',
      'CRM & Client Management',
      'Marketing Automation',
      'Social Media Management',
      'SEO & Digital Marketing',
    ],
    stacks: [
      {
        label: 'Boutique Agency',
        companySize: '1–15 people',
        toolIds: ['asana', 'harvest', 'hubspot-crm', 'hootsuite', 'semrush', 'notion'],
        description: 'Asana for project management with client portals; Harvest for time and billing; HubSpot for new business. Lean and effective for small teams.',
      },
      {
        label: 'Mid-Size Agency',
        companySize: '15–100 people',
        toolIds: ['monday', 'kantata', 'salesforce', 'marketo', 'sprout-social', 'tableau', 'semrush'],
        description: 'Kantata (formerly Mavenlink) is purpose-built for agencies — resource management, project financials, and client billing in one. Monday for team-level work.',
      },
      {
        label: 'Large Agency / Holding Co',
        companySize: '100+ people',
        toolIds: ['salesforce', 'workday', 'tableau', 'marketo', 'sprout-social', 'smartsheet', 'kantata'],
        description: 'Enterprise stack focused on utilization and profitability visibility. Smartsheet for large client projects; Tableau for agency-wide performance dashboards.',
      },
    ],
    avoidTools: [
      { toolId: 'trello', reason: 'Too simple for agency work — no resource management, time tracking, or client billing.' },
      { toolId: 'quickbooks-online', reason: 'Doesn\'t handle project-based billing well. Use Kantata or Harvest + Xero for proper agency financials.' },
    ],
  },

  // ============================================
  // MANUFACTURING
  // ============================================
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    emoji: '🏭',
    tagline: 'Connect the shop floor to the back office.',
    description: 'Manufacturers need tools that bridge operational technology (OT) and information technology (IT). The right stack gives real-time visibility into production, quality, and supply chain without requiring a PhD to use.',
    painPoints: [
      'No real-time visibility into production status',
      'Quality issues are found too late in the process',
      'Supply chain disruptions cause costly downtime',
      'Maintenance is reactive, not preventive',
      'HR struggles to manage shift workers at scale',
    ],
    complianceRequirements: [
      { name: 'ISO 9001', description: 'Quality management system requirements — most manufacturers need documented processes.', critical: true },
      { name: 'OSHA', description: 'Safety data and incident tracking must be maintained and accessible.', critical: true },
      { name: 'FDA 21 CFR Part 11', description: 'Electronic records requirements for food, pharma, and medical device manufacturers.', critical: false },
      { name: 'ITAR', description: 'Defense contractors must use ITAR-compliant tools for controlled technical data.', critical: false },
    ],
    priorityCategories: [
      'General Ledger & ERP',
      'Project Management',
      'HR & Talent Management',
      'Data Analytics & Visualization',
      'Document Management',
      'Risk & Compliance',
    ],
    stacks: [
      {
        label: 'Small Manufacturer',
        companySize: '10–50 people',
        toolIds: ['quickbooks-online', 'smartsheet', 'bamboohr', 'google-drive', 'tableau'],
        description: 'Simple, affordable starting stack. Smartsheet for production scheduling and project tracking; BambooHR for shift worker management; QuickBooks for accounting.',
      },
      {
        label: 'Mid-Size Manufacturer',
        companySize: '50–500 people',
        toolIds: ['netsuite', 'smartsheet', 'bamboohr', 'tableau', 'docusign', 'servicenow-grc'],
        description: 'NetSuite handles ERP, inventory, and financials in one platform. Smartsheet for project management; Tableau for operational dashboards.',
      },
      {
        label: 'Large Manufacturer',
        companySize: '500+ people',
        toolIds: ['sap-s4hana', 'workday', 'tableau', 'servicenow', 'okta', 'crowdstrike', 'auditboard'],
        description: 'SAP S/4HANA is the industry standard for large manufacturers. Workday for global HR; Tableau for supply chain analytics; ServiceNow for IT and asset management.',
      },
    ],
    avoidTools: [
      { toolId: 'notion', reason: 'Excellent knowledge tool but not built for manufacturing operations, compliance docs, or QMS requirements.' },
      { toolId: 'asana', reason: 'Solid project management but lacks the ERP integration and production scheduling features manufacturers need.' },
    ],
  },

  // ============================================
  // REAL ESTATE
  // ============================================
  {
    slug: 'real-estate',
    name: 'Real Estate',
    emoji: '🏢',
    tagline: 'Close more deals, manage more properties, with less chaos.',
    description: 'Real estate professionals need tools for deal tracking, property management, client communication, and marketing — often all at once. The right stack gives a single view of your pipeline and portfolio.',
    painPoints: [
      'Deal pipeline is tracked in spreadsheets or sticky notes',
      'Client communication is scattered across email, text, and phone',
      'Property documents are disorganized and hard to find',
      'Marketing properties across channels is time-consuming',
      'Transaction coordination is chaotic near close',
    ],
    complianceRequirements: [
      { name: 'RESPA', description: 'Real Estate Settlement Procedures Act — requires disclosure of settlement costs.', critical: true },
      { name: 'Fair Housing', description: 'Marketing tools must comply with fair housing laws — avoid discriminatory targeting.', critical: true },
      { name: 'E-Sign Act', description: 'Electronic signatures for real estate contracts must comply with ESIGN/UETA.', critical: true },
      { name: 'State Licensing', description: 'Document management must support state-specific disclosure and record-keeping requirements.', critical: false },
    ],
    priorityCategories: [
      'CRM & Client Management',
      'Document Management',
      'Marketing Automation',
      'Project Management',
      'Communication & Collaboration',
    ],
    stacks: [
      {
        label: 'Individual Agent / Small Team',
        companySize: '1–5 people',
        toolIds: ['hubspot-crm', 'docusign', 'google-drive', 'mailchimp', 'hootsuite'],
        description: 'HubSpot free CRM for pipeline; DocuSign for e-signatures; Google Drive for documents. Simple and effective for solo agents and small teams.',
      },
      {
        label: 'Mid-Size Brokerage',
        companySize: '5–50 people',
        toolIds: ['salesforce', 'docusign', 'sharepoint', 'mailchimp', 'monday', 'tableau'],
        description: 'Salesforce with real estate CRM customizations; SharePoint for document management; Monday for transaction coordination timelines.',
      },
      {
        label: 'Commercial / Enterprise',
        companySize: '50+ people',
        toolIds: ['salesforce', 'ironclad', 'sharepoint', 'tableau', 'marketo', 'workday'],
        description: 'Commercial real estate at scale. Ironclad for complex lease contracts; Salesforce for investor and tenant relationships; Tableau for portfolio analytics.',
      },
    ],
    avoidTools: [
      { toolId: 'trello', reason: 'Too simple for transaction coordination — lacks e-signature integration and compliance document management.' },
      { toolId: 'wix', reason: 'Real estate websites need MLS integration and lead capture that Wix doesn\'t handle well. Use dedicated real estate platforms.' },
    ],
  },

  // ============================================
  // EDUCATION
  // ============================================
  {
    slug: 'education',
    name: 'Education',
    emoji: '🎓',
    tagline: 'Better tools for educators, administrators, and learners.',
    description: 'Educational institutions face unique challenges: student data privacy, diverse user technical abilities, and tight budgets. The best education stacks prioritize ease of use and FERPA compliance.',
    painPoints: [
      'Student data privacy compliance (FERPA) is complex',
      'Faculty adoption of new tools is slow',
      'Administrative workflows are paper-heavy',
      'Learning outcomes are hard to measure',
      'Budget constraints limit tool choices',
    ],
    complianceRequirements: [
      { name: 'FERPA', description: 'Family Educational Rights and Privacy Act — student records must be protected. Any tool handling student data must comply.', critical: true },
      { name: 'COPPA', description: 'For K-12: tools used by children under 13 must comply with COPPA parental consent requirements.', critical: true },
      { name: 'ADA Section 508', description: 'Accessibility requirements for educational technology used with federal funding.', critical: true },
      { name: 'CIPA', description: 'Children\'s Internet Protection Act — filtering requirements for schools receiving E-rate funding.', critical: false },
    ],
    priorityCategories: [
      'Learning & Development',
      'Communication & Collaboration',
      'HR & Talent Management',
      'Project Management',
      'Document Management',
      'Data Analytics & Visualization',
    ],
    stacks: [
      {
        label: 'K-12 School',
        companySize: 'Single school',
        toolIds: ['google-drive', 'microsoft-copilot', 'bamboohr', 'zoom', 'notion'],
        description: 'Google Workspace for Education is FERPA-compliant and free for schools. Microsoft 365 Education is an equally strong alternative. Both handle most needs out of the box.',
      },
      {
        label: 'Higher Education',
        companySize: 'College / University',
        toolIds: ['onedrive-sharepoint', 'workday', 'tableau', 'zoom', 'servicenow', 'cornerstone-ondemand'],
        description: 'Microsoft 365 ecosystem is dominant in higher ed. Workday for HR and student services; Tableau for institutional research; ServiceNow for IT help desk.',
      },
      {
        label: 'EdTech / Online Learning',
        companySize: 'EdTech company',
        toolIds: ['docebo', 'talentlms', 'hubspot-crm', 'intercom', 'looker', 'rippling'],
        description: 'Docebo or TalentLMS for the learning platform; HubSpot for student/customer acquisition; Intercom for in-app support; Looker for learning analytics.',
      },
    ],
    avoidTools: [
      { toolId: 'slack', reason: 'Not FERPA-compliant by default. Requires specific configuration and BAA for student data. Consider Microsoft Teams as a safer default.' },
      { toolId: 'google-drive', reason: 'Free consumer Google Drive is NOT FERPA-compliant. Only Google Workspace for Education with proper setup complies.' },
    ],
  },

  // ============================================
  // CONSTRUCTION
  // ============================================
  {
    slug: 'construction',
    name: 'Construction',
    emoji: '🏗️',
    tagline: 'Keep projects on time, on budget, and out of court.',
    description: 'Construction projects live or die on communication, documentation, and schedule management. The right stack gives every stakeholder — owner, GC, sub, architect — the information they need without drowning in emails.',
    painPoints: [
      'RFIs and submittals get lost in email chains',
      'Change orders aren\'t tracked until they\'re disputes',
      'Subcontractor coordination is a daily struggle',
      'Safety incident documentation is reactive',
      'Job cost reporting is always a week behind',
    ],
    complianceRequirements: [
      { name: 'OSHA', description: 'Safety documentation, incident reporting, and training records must be maintained.', critical: true },
      { name: 'Lien Laws', description: 'Contract and payment documentation must comply with state-specific lien requirements.', critical: true },
      { name: 'AIA Contract Standards', description: 'Document management should support AIA contract formats and change order documentation.', critical: false },
      { name: 'Prevailing Wage', description: 'Public projects require certified payroll records — ensure your HR/payroll tools support this.', critical: false },
    ],
    priorityCategories: [
      'Project Management',
      'Document Management',
      'HR & Talent Management',
      'Time Tracking & Billing',
      'General Ledger & ERP',
      'Risk & Compliance',
    ],
    stacks: [
      {
        label: 'Small Contractor',
        companySize: '1–20 people',
        toolIds: ['quickbooks-online', 'smartsheet', 'docusign', 'google-drive', 'harvest'],
        description: 'QuickBooks for job costing and billing; Smartsheet for scheduling and RFI tracking; DocuSign for contracts and change orders. Gets the job done without breaking the bank.',
      },
      {
        label: 'Mid-Size GC',
        companySize: '20–200 people',
        toolIds: ['netsuite', 'smartsheet', 'docusign', 'sharepoint', 'bamboohr', 'servicenow-grc'],
        description: 'NetSuite for job cost accounting and financials; Smartsheet for project scheduling with Gantt views; SharePoint for project document management.',
      },
      {
        label: 'Large GC / Developer',
        companySize: '200+ people',
        toolIds: ['sap-s4hana', 'smartsheet', 'workday', 'sharepoint', 'tableau', 'docusign', 'auditboard'],
        description: 'SAP for enterprise financials and procurement; Smartsheet for project portfolio management; Workday for multi-state HR and certified payroll.',
      },
    ],
    avoidTools: [
      { toolId: 'asana', reason: 'Not built for construction workflows — no RFI management, submittals, or job costing. Use purpose-built construction PM tools.' },
      { toolId: 'notion', reason: 'Great for internal knowledge but not suitable for construction document management, which requires version control and approval workflows.' },
    ],
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find(i => i.slug === slug);
}

export function getAllIndustrySlugs(): IndustrySlug[] {
  return industries.map(i => i.slug);
}
