'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { recommendTools, calculateMonthlyCost, BudgetRange, UserPriority, ScoredTool } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';
import { CompanySize } from '@/data/tools';
import { EmailCapture } from '@/components/EmailCapture';
import Link from 'next/link';

function RecommendationsContent() {
  const searchParams = useSearchParams();

  const size       = searchParams.get('size')     as CompanySize;
  const role       = searchParams.get('role')     || '';
  const category   = searchParams.get('category') || '';
  const budget     = searchParams.get('budget')   as BudgetRange || 'medium';
  const priority   = searchParams.get('priority') as UserPriority || 'easy';

  const userProfile = {
    companySize:  size,
    role:         role || undefined,
    budgetRange:  budget,
    priorities:   priority ? [priority] : [],
    categoryHint: category || undefined,
  };

  const results: ScoredTool[] = recommendTools(userProfile);

  const categoryContext: Record<string, string> = {
    project:       'Project Management & Collaboration',
    communication: 'Communication Tools',
    crm:           'CRM & Sales',
    marketing:     'Marketing Automation',
    design:        'Design & Prototyping',
    development:   'Development Tools',
    analytics:     'Business Intelligence & Analytics',
  };

  const sizeLabel: Record<CompanySize, string> = {
    small:      '1–10 people',
    medium:     '11–100 people',
    large:      '101–1,000 people',
    enterprise: '1,000+ people',
  };

  // Estimate team size from company size for cost calc
  const teamSizeGuess: Record<CompanySize, number> = {
    small: 5,
    medium: 30,
    large: 200,
    enterprise: 1000,
  };
  const teamSize = teamSizeGuess[size] ?? 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Your Personalized Recommendations
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Scored and ranked for your exact situation — not just popularity.
          </p>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-3">Your Profile:</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {sizeLabel[size] ?? size}
            </span>
            {role && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}
            {category && category !== 'other' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {categoryContext[category] ?? category}
              </span>
            )}
            {budget && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                {budget.charAt(0).toUpperCase() + budget.slice(1)} budget
              </span>
            )}
            {priority && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                Priority: {priority}
              </span>
            )}
          </div>
        </div>

        {/* Why these tools */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-2">💡 How we ranked these</h3>
          <p className="text-slate-700">
            Each tool is scored across company-size fit, role match, budget compatibility,
            category relevance, your stated priority, and verified ratings.
            The top {results.length} are shown below — ranked by fit score, not by who pays us.
          </p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Top Matches ({results.length} tools)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(({ tool, matchReasons }, idx) => {
                const cost = calculateMonthlyCost(tool, teamSize);
                return (
                  <div key={tool.id} className="relative">
                    {idx === 0 && (
                      <div className="absolute -top-3 left-4 z-10">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Best Match
                        </span>
                      </div>
                    )}
                    <div className={`bg-white rounded-xl border-2 p-5 h-full flex flex-col gap-4 transition hover:shadow-lg ${
                      idx === 0 ? 'border-blue-400' : 'border-slate-200'
                    }`}>
                      {/* Tool header */}
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-slate-900 text-lg">{tool.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ml-2 shrink-0 ${
                            tool.pricingTier === 'free'         ? 'bg-green-100 text-green-800' :
                            tool.pricingTier === 'starter'      ? 'bg-blue-100 text-blue-800' :
                            tool.pricingTier === 'professional' ? 'bg-purple-100 text-purple-800' :
                                                                  'bg-slate-100 text-slate-700'
                          }`}>
                            {tool.pricingTier}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm">{tool.description}</p>
                      </div>

                      {/* Match reasons */}
                      {matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {matchReasons.slice(0, 3).map((reason, i) => (
                            <span key={i} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Cost estimate */}
                      <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700">Est. cost ({teamSize} users)</span>
                          <span className="font-semibold text-slate-900">{cost.label}</span>
                        </div>
                        {cost.notes[0] && (
                          <p className="text-slate-700 text-xs mt-1">{cost.notes[0]}</p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs text-slate-700 capitalize">
                          {tool.learningCurve} learning curve
                        </span>
                        <Link
                          href={`/tools/${tool.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          See full breakdown →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-700 mb-4">
              No strong matches for that combination — try adjusting your answers.
            </p>
            <Link href="/quiz" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Retake the quiz
            </Link>
          </div>
        )}

        {/* Email capture */}
        {results.length > 0 && (
          <div className="mt-10">
            <EmailCapture
              intent="recommendations"
              context={`size:${size} role:${role} category:${category}`}
              headline="Save these recommendations"
              subline="We'll email you this list plus updates when better tools come out for your stack."
              compact={false}
            />
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-slate-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Still deciding?
          </h3>
          <p className="text-slate-700 mb-6">
            Click any tool above for a full breakdown: real pricing, when to use it, when to avoid it, and side-by-side comparisons.
          </p>
          <Link
            href="/tools"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-700">Loading your recommendations...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}
