import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIndustryBySlug, getAllIndustrySlugs } from '@/data/industries';
import { getToolById } from '@/lib/toolsService';

export function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ industry: slug }));
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const industry = getIndustryBySlug(params.industry);
  if (!industry) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/industry" className="text-sm text-slate-500 hover:text-slate-700 mb-4 block">
            ← All Industries
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{industry.emoji}</span>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{industry.name}</h1>
              <p className="text-xl text-slate-600 mt-1">{industry.tagline}</p>
            </div>
          </div>
          <p className="text-slate-700 max-w-3xl">{industry.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Compliance Requirements */}
        {industry.complianceRequirements.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Compliance Requirements</h2>
            <p className="text-slate-600 mb-6">
              Every tool in your stack must support these. We've pre-filtered recommendations accordingly.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {industry.complianceRequirements.map((req) => (
                <div
                  key={req.name}
                  className={`rounded-lg p-4 border ${
                    req.critical
                      ? 'bg-red-50 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      req.critical ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {req.critical ? 'REQUIRED' : 'RECOMMENDED'}
                    </span>
                    <span className="font-semibold text-slate-900">{req.name}</span>
                  </div>
                  <p className="text-sm text-slate-600">{req.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pain Points */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Pain Points</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {industry.painPoints.map((pain, i) => (
              <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
                <span className="text-slate-700 text-sm">{pain}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Curated Stacks */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Recommended Stacks</h2>
          <p className="text-slate-600 mb-6">
            Curated combinations that work well together — not just a list of popular tools.
          </p>
          <div className="space-y-6">
            {industry.stacks.map((stack) => {
              const stackTools = stack.toolIds
                .map(id => getToolById(id))
                .filter(Boolean);

              return (
                <div key={stack.label} className="bg-white border-2 border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{stack.label}</h3>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stack.companySize}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{stack.description}</p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stackTools.map((tool) => {
                      if (!tool) return null;
                      const pricingColor = {
                        free: 'bg-green-100 text-green-800',
                        starter: 'bg-blue-100 text-blue-800',
                        professional: 'bg-purple-100 text-purple-800',
                        enterprise: 'bg-slate-100 text-slate-800',
                      }[tool.pricingTier];

                      return (
                        <Link key={tool.id} href={`/tools/${tool.id}`}>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-900 text-sm">{tool.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${pricingColor}`}>{tool.pricingTier}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/stack-builder?preload=${stack.toolIds.join(',')}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Build on this stack →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tools to Avoid */}
        {industry.avoidTools.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tools to Approach with Caution</h2>
            <p className="text-slate-600 mb-4">
              Popular tools that often disappoint {industry.name.toLowerCase()} teams — and why.
            </p>
            <div className="space-y-3">
              {industry.avoidTools.map(({ toolId, reason }) => {
                const tool = getToolById(toolId);
                if (!tool) return null;
                return (
                  <div key={toolId} className="flex items-start gap-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <span className="text-orange-500 shrink-0">⚠️</span>
                    <div>
                      <span className="font-semibold text-slate-900">{tool.name}: </span>
                      <span className="text-slate-700 text-sm">{reason}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Need a personalized recommendation?</h3>
          <p className="text-slate-600 mb-6">
            Describe your exact situation and our AI advisor will recommend the right stack for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/chat?context=${encodeURIComponent(`I work in ${industry.name}`)}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Chat with AI Advisor →
            </Link>
            <Link
              href="/quiz"
              className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-slate-400 transition"
            >
              Take the Quiz Instead
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
