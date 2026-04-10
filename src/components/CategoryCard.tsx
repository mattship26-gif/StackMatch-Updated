import Link from 'next/link';
import { getToolsByCategory } from '@/lib/toolsService';
import { ToolCategory } from '@/data/tools';

const ICONS: Record<string, string> = {
  'Project Management': '📋', 'Communication & Collaboration': '💬',
  'CRM & Client Management': '🤝', 'Business Intelligence & Analytics': '📊',
  'Business Intelligence & Reporting': '📈', 'Accounting & Finance': '💰',
  'HR & Talent Management': '👥', 'Cybersecurity': '🔐',
  'Generative AI & Automation': '🤖', 'Customer Service & Support': '🎧',
  'Marketing Automation': '📣', 'Financial Close & Reconciliation': '🔄',
  'Risk Management & Compliance': '⚠️', 'Risk & Compliance': '⚖️',
  'Data Analytics & Visualization': '🔍', 'Contract Management': '📝',
  'Expense Management': '🧾', 'Sales Enablement': '🚀',
  'Document Management': '📁', 'File Storage & Document Management': '☁️',
  'Website & CMS': '🌐', 'Tax Compliance': '🧮',
  'Time Tracking & Billing': '⏱️', 'SEO & Digital Marketing': '🔎',
  'Social Media Management': '📱', 'General Ledger & ERP': '🏢',
  'AP/AR Automation': '💳', 'Audit Management': '🔍',
  'Audit Data Analytics': '📊', 'Knowledge Management': '🧠',
  'Learning & Development': '🎓', 'Database & Data Warehousing': '🗄️',
  'Data Governance & Privacy': '🔏', 'Fraud Detection & Forensics': '🕵️',
  'Tax Provision & Research': '📖', 'Video Conferencing & Webinars': '📹',
  'Time Tracking & Productivity': '⚡',
};

export function CategoryCard({ category }: { category: ToolCategory }) {
  const count = getToolsByCategory(category).length;
  const icon = ICONS[category] ?? '📦';
  const slug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));
  return (
    <Link href={`/categories/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ padding: '20px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{category}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{count} tool{count !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </Link>
  );
}
