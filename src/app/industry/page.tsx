import Link from 'next/link';
import { industries } from '@/data/industries';

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Find Tools for Your Industry
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A 50-person law firm and a 50-person e-commerce company have completely different needs.
            Get recommendations built for your world — including compliance requirements.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <Link key={industry.slug} href={`/industry/${industry.slug}`}>
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-blue-400 hover:shadow-lg transition cursor-pointer h-full">
                <div className="text-4xl mb-3">{industry.emoji}</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{industry.name}</h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{industry.tagline}</p>

                {/* Compliance badges */}
                {industry.complianceRequirements.filter(c => c.critical).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {industry.complianceRequirements
                      .filter(c => c.critical)
                      .slice(0, 3)
                      .map((req) => (
                        <span key={req.name} className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                          {req.name}
                        </span>
                      ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{industry.stacks.length} curated stacks</span>
                  <span className="text-blue-600 font-medium">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Don't see your industry?</h3>
          <p className="text-slate-600 mb-4">
            Use our AI advisor to describe your situation in plain English and get tailored recommendations.
          </p>
          <Link
            href="/chat"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Chat with AI Advisor →
          </Link>
        </div>
      </div>
    </div>
  );
}
