'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { recommendTools } from '@/lib/toolsService';
import { ToolCard } from '@/components/ToolCard';
import { CompanySize } from '@/data/tools';

function RecommendationsContent() {
  const searchParams = useSearchParams();
  
  const size = searchParams.get('size') as CompanySize;
  const role = searchParams.get('role') || '';
  const category = searchParams.get('category') || '';
  const budget = searchParams.get('budget') || '';
  const priority = searchParams.get('priority') || '';

  // Get recommendations based on user profile
  const userProfile = {
    companySize: size,
    role: role,
    budget: 0, // You can map budget strings to numbers
    priorities: [priority] as any[]
  };

  const recommendations = recommendTools(userProfile);

  // Category mapping for context
  const categoryContext: Record<string, string> = {
    project: 'Project Management & Collaboration',
    communication: 'Communication Tools',
    crm: 'CRM & Sales',
    marketing: 'Marketing Automation',
    design: 'Design & Prototyping',
    development: 'Development Tools',
    analytics: 'Business Intelligence & Analytics'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Your Personalized Recommendations
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Based on your situation, here are the tools that will actually work for you.
          </p>
        </div>

        {/* Context Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-3">Your Profile:</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {size === 'small' ? '1-10 people' : size === 'medium' ? '11-100 people' : size === 'large' ? '101-1,000 people' : '1,000+ people'}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              {role.charAt(0).toUpperCase() + role.slice(1)} role
            </span>
            {category !== 'other' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {categoryContext[category] || category}
              </span>
            )}
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
              {budget.charAt(0).toUpperCase() + budget.slice(1)} budget
            </span>
          </div>
        </div>

        {/* Why These Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-2">💡 Why these tools?</h3>
          <p className="text-slate-700">
            We filtered {recommendations.length} tools that match your company size, budget, and priorities. 
            These aren't just "popular" tools—they're the right fit for YOUR situation.
          </p>
        </div>

        {/* Recommendations Grid */}
        {recommendations.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Top Matches ({recommendations.length} tools)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              Hmm, we couldn't find perfect matches with those exact criteria.
            </p>
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Try different answers
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-slate-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Still not sure which one to pick?
          </h3>
          <p className="text-slate-600 mb-6">
            Click into each tool to see detailed breakdowns, real pricing, and when to choose one over another.
          </p>
          <button 
            onClick={() => window.location.href = '/tools'}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse All Tools
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading recommendations...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}
