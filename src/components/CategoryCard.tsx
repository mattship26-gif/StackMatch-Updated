import Link from 'next/link';
import { getToolsByCategory } from '@/lib/toolsService';
import { ToolCategory } from '@/data/tools';

interface CategoryCardProps {
  category: ToolCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const toolCount = getToolsByCategory(category).length;

  // Category icons (you can customize these)
  const categoryIcons: Record<string, string> = {
    'Project Management & Collaboration': '📊',
    'Communication Tools': '💬',
    'CRM & Sales': '🤝',
    'Product Management': '🎯',
    'Design & Prototyping': '🎨',
    'Development Tools': '⚙️',
    'Data & Analytics': '📈',
    'Marketing Automation': '📧',
    'Business Intelligence & Analytics': '📊',
    'Accounting & Finance': '💰',
    // Add more as needed...
  };

  const icon = categoryIcons[category] || '📁';

  return (
    <Link href={`/categories/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}>
      <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition cursor-pointer">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{category}</h3>
        <p className="text-sm text-slate-600">{toolCount} tools</p>
      </div>
    </Link>
  );
}
