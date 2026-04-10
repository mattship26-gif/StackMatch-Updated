import { notFound } from 'next/navigation';
import { getAllCategories, getToolsByCategory } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';
import { ToolCategory } from '@/data/tools';

interface CategoryPageProps {
  params: { category: string };
}

// Convert URL slug back to category name
function slugToCategory(slug: string): ToolCategory | undefined {
  const categories = getAllCategories();
  return categories.find(
    (cat) => cat.toLowerCase().replace(/\s+/g, '-') === slug
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = slugToCategory(decodeURIComponent(params.category));

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{category}</h1>
          <p className="text-xl text-slate-600">
            {tools.length} tools in this category
          </p>
        </div>

        {tools.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No tools found in this category.</p>
        )}
      </div>
    </div>
  );
}
