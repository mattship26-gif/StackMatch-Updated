import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolById, getSimilarTools } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const tool = getToolById(params.id);
  
  if (!tool) {
    notFound();
  }

  const similarTools = getSimilarTools(params.id, 3);
  const avgRating = tool.ratings.length > 0
    ? (tool.ratings.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / tool.ratings.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{tool.name}</h1>
              <p className="text-xl text-slate-600">{tool.description}</p>
            </div>
            {avgRating && (
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-2xl font-bold">{avgRating}</div>
                  <div className="text-xs text-slate-600">Average</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
              {tool.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              tool.pricingTier === 'free' ? 'bg-green-100 text-green-800' :
              tool.pricingTier === 'starter' ? 'bg-blue-100 text-blue-800' :
              tool.pricingTier === 'professional' ? 'bg-purple-100 text-purple-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {tool.pricingTier}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              {tool.learningCurve} learning curve
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Visit Website →
            </a>
            {tool.documentation && (
              <a
                href={tool.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-slate-400 transition"
              >
                View Docs
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* The Decision Makers - THIS IS THE DIFFERENTIATOR */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Should You Use {tool.name}?
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">✅</span> When to use {tool.name}
                  </h3>
                  <p className="text-green-800">{tool.whenToUse}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">❌</span> When NOT to use {tool.name}
                  </h3>
                  <p className="text-red-800">{tool.whenNotToUse}</p>
                </div>
              </div>
            </section>

            {/* Detailed Description */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What is {tool.name}?</h2>
              <p className="text-slate-700 leading-relaxed">{tool.detailedDescription}</p>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {tool.keyFeatures.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Integrations */}
            {tool.integrations.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Integrations</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((integration: { toolName: string }, index: number) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      {integration.toolName}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Ratings */}
            {tool.ratings.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ratings & Reviews</h2>
                <div className="space-y-3">
                  {tool.ratings.map((rating: { source: string; reviewCount: number; score: number }, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">{rating.source}</span>
                        <span className="text-slate-600">
                          {rating.reviewCount.toLocaleString()} reviews
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-xl font-bold">{rating.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-600">Pricing</dt>
                  <dd className="font-medium text-slate-900">{tool.pricingDetails}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Best for</dt>
                  <dd className="font-medium text-slate-900">{tool.bestFor.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Learning curve</dt>
                  <dd className="font-medium text-slate-900 capitalize">{tool.learningCurve}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Implementation</dt>
                  <dd className="font-medium text-slate-900">{tool.implementationTime}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Primary roles</dt>
                  <dd className="font-medium text-slate-900">{tool.primaryRoles.slice(0, 3).join(', ')}</dd>
                </div>
              </dl>
            </div>

            {/* Similar Tools */}
            {similarTools.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Similar Tools</h3>
                <div className="space-y-3">
                  {similarTools.map((similar: { id: string; name: string; description: string }) => (
                    <Link key={similar.id} href={`/tools/${similar.id}`}>
                      <div className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition">
                        <div className="font-semibold text-slate-900 mb-1">{similar.name}</div>
                        <div className="text-sm text-slate-600 line-clamp-2">{similar.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
