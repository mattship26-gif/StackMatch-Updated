import Link from 'next/link';
import { getAllCategories, getTopRated, getAllTools } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';

export default function HomePage() {
  const categories = getAllCategories();
  const featuredTools = getTopRated(undefined, 6);
  const totalTools = getAllTools().length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Find the Right Tools for{' '}
            <span className="text-blue-600">Your Situation</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto">
            No BS affiliate links. No outdated listicles. Just honest guidance 
            on {totalTools} tools to help you make the right decision.
          </p>
          <p className="text-lg text-slate-500 mb-12">
            Whether you're a solo freelancer or scaling a startup, 
            we'll help you find what actually works.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-sm text-slate-600">
            <div>
              <span className="font-bold text-2xl text-slate-900">{totalTools}</span>
              <span className="block">Tools Reviewed</span>
            </div>
            <div>
              <span className="font-bold text-2xl text-slate-900">25+</span>
              <span className="block">Categories</span>
            </div>
            <div>
              <span className="font-bold text-2xl text-slate-900">$0-100K+</span>
              <span className="block">Budget Range</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why We're Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Context Matters</h3>
              <p className="text-slate-600">
                What works for a 5-person startup isn't what works for a 500-person company. 
                We tell you when a tool is right—and when it's not.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Real Costs</h3>
              <p className="text-slate-600">
                Not just "$29/month" but what you'll actually pay with your team size, 
                add-ons, and implementation. No surprises.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">No Affiliate BS</h3>
              <p className="text-slate-600">
                We don't get paid when you click. Our recommendations are based on what 
                actually works, not who pays us the most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.slice(0, 9).map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            href="/categories" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all {categories.length} categories →
          </Link>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Top-Rated Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/tools" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Not sure where to start?
        </h2>
        <p className="text-xl text-slate-600 mb-8">
          Take our 2-minute quiz and get personalized tool recommendations for your exact situation.
        </p>
        <Link 
          href="/quiz" 
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
        >
          Get Personalized Recommendations →
        </Link>
      </section>
    </div>
  );
}
