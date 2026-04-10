import { getAllCategories } from '@/lib/toolsService';
import { CategoryCard } from '@/components/CategoryCard';

export default function CategoriesPage() {
  const categories = getAllCategories();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Browse by Category</h1>
          <p style={{ fontSize: 17, color: 'var(--text-2)' }}>Explore {categories.length} categories across the tool landscape.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {categories.map(cat => <CategoryCard key={cat} category={cat} />)}
        </div>
      </div>
    </div>
  );
}
