import { getAllCategories } from '@/lib/toolsService';
import { CategoryCard } from '@/components/CategoryCard';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Browse by Category</h1>
        <p className="text-xl text-slate-600 mb-12">
          Explore {categories.length} categories of tools to find what you need.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
