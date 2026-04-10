import Link from 'next/link';
import { getAllCategories, getTopRated, getAllTools } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';
import { industries } from '@/data/industries';

export default function HomePage() {
  const categories = getAllCategories();
  const featuredTools = getTopRated(undefined, 6);
  const totalTools = getAllTools().length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            {totalTools} tools reviewed across {categories.length} categories
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find the exact right tool<br />
            <span className="text-blue-400">for your situation</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
            Not "top 10 tools" lists. Not affiliate-driven rankings.
            Context-aware recommendations based on your industry, team size, budget, and stack.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chat" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Ask AI Advisor →
            </Link>
            <Link href="/quiz" className="border border-slate-500 text-white px-6 py-3 rounded-lg font-medium hover:border-slate-300 transition">
              Take the Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Four Power Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
            This isn't another tool directory
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-xl mx-auto">
            Four features that help you actually decide — not just browse.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                href: '/stack-builder',
                emoji: '🧩',
                title: 'Stack Builder',
                desc: 'Add your tools and see compatibility scores, detect conflicts, and find what\'s missing.',
                badge: 'New',
                badgeColor: 'bg-green-100 text-green-800',
              },
              {
                href: '/industry',
                emoji: '🏭',
                title: 'By Industry',
                desc: 'Curated stacks for 10 industries — with compliance requirements and tools to avoid.',
                badge: 'New',
                badgeColor: 'bg-green-100 text-green-800',
              },
              {
                href: '/chat',
                emoji: '🤖',
                title: 'AI Advisor',
                desc: 'Describe your situation in plain English. Get specific, opinionated recommendations.',
                badge: 'AI-Powered',
                badgeColor: 'bg-blue-100 text-blue-800',
              },
              {
                href: '/migration',
                emoji: '⚖️',
                title: 'Should I Switch?',
                desc: 'Calculate the real cost of migrating — training, data migration, integrations, and break-even.',
                badge: 'New',
                badgeColor: 'bg-green-100 text-green-800',
              },
            ].map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{feature.emoji}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Browse by Industry</h2>
              <p className="text-slate-600 mt-1">Compliance-aware stacks built for your world</p>
            </div>
            <Link href="/industry" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View all 10 →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {industries.slice(0, 5).map((industry) => (
              <Link key={industry.slug} href={`/industry/${industry.slug}`}>
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition text-center">
                  <div className="text-3xl mb-2">{industry.emoji}</div>
                  <div className="font-semibold text-slate-900 text-sm">{industry.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{industry.stacks.length} stacks</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
            Built different, on purpose
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🎯',
                title: 'Context-aware',
                desc: 'What works for a 5-person startup isn\'t what works for a 500-person company. We tell you when a tool is right — and when it\'s not.',
              },
              {
                emoji: '💰',
                title: 'Real costs',
                desc: 'Not just "$29/month" but what you\'ll actually pay with your team size, integrations, and implementation. No surprises.',
              },
              {
                emoji: '🚫',
                title: 'Zero affiliate links',
                desc: 'We don\'t get paid when you click. Rankings are based on fit for your situation, not who pays us the most.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Tools */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Top-Rated Tools</h2>
            <Link href="/tools" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Browse all {totalTools} →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
            <Link href="/categories" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              All {categories.length} categories →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 9).map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-3xl font-bold mb-4">Not sure where to start?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Tell our AI advisor about your company and what's not working.
            Get specific, honest recommendations in seconds.
          </p>
          <Link
            href="/chat"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
          >
            Chat with AI Advisor →
          </Link>
        </div>
      </section>
    </div>
  );
}
