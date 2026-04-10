'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanySize } from '@/data/tools';

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    companySize: '' as CompanySize | '',
    role: '',
    category: '',
    budget: '',
    priority: ''
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Navigate to results with query params
      const params = new URLSearchParams({
        size: answers.companySize,
        role: answers.role,
        category: answers.category,
        budget: answers.budget,
        priority: answers.priority
      });
      router.push(`/recommendations?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProgress = () => {
    switch(step) {
      case 1: return answers.companySize !== '';
      case 2: return answers.role !== '';
      case 3: return answers.category !== '';
      case 4: return answers.budget !== '';
      case 5: return answers.priority !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Step {step} of 5</span>
            <span>{step * 20}% Complete</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${step * 20}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Step 1: Company Size */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                What's your company size?
              </h2>
              <p className="text-slate-600 mb-8">
                Tools that work for 5 people don't always work for 500. Let's find what fits.
              </p>
              <div className="space-y-3">
                {[
                  { value: 'small', label: 'Solo or Small Team', desc: '1-10 people' },
                  { value: 'medium', label: 'Growing Company', desc: '11-100 people' },
                  { value: 'large', label: 'Large Company', desc: '101-1,000 people' },
                  { value: 'enterprise', label: 'Enterprise', desc: '1,000+ people' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, companySize: option.value as CompanySize })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers.companySize === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Role */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                What's your role?
              </h2>
              <p className="text-slate-600 mb-8">
                Different roles need different tools. What describes you best?
              </p>
              <div className="space-y-3">
                {[
                  { value: 'founder', label: 'Founder / Business Owner', emoji: '🚀' },
                  { value: 'product', label: 'Product Manager', emoji: '🎯' },
                  { value: 'developer', label: 'Software Developer', emoji: '💻' },
                  { value: 'designer', label: 'Designer', emoji: '🎨' },
                  { value: 'marketing', label: 'Marketing / Sales', emoji: '📈' },
                  { value: 'operations', label: 'Operations / Finance', emoji: '⚙️' },
                  { value: 'other', label: 'Other / Multiple Roles', emoji: '👥' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, role: option.value })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers.role === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-semibold text-slate-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Category */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                What are you looking for?
              </h2>
              <p className="text-slate-600 mb-8">
                Let's narrow down to the type of tool you need.
              </p>
              <div className="space-y-3">
                {[
                  { value: 'project', label: 'Project Management', desc: 'Track work, collaborate with team' },
                  { value: 'communication', label: 'Team Communication', desc: 'Chat, video calls, messaging' },
                  { value: 'crm', label: 'CRM / Sales', desc: 'Manage customers and pipeline' },
                  { value: 'marketing', label: 'Marketing Tools', desc: 'Email, social media, automation' },
                  { value: 'design', label: 'Design & Creative', desc: 'Design, prototyping, collaboration' },
                  { value: 'development', label: 'Developer Tools', desc: 'Code, deploy, collaborate' },
                  { value: 'analytics', label: 'Analytics & BI', desc: 'Understand your data' },
                  { value: 'other', label: 'Something Else', desc: 'Show me all recommendations' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, category: option.value })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers.category === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                What's your budget?
              </h2>
              <p className="text-slate-600 mb-8">
                Per user, per month. Be honest—we'll show you what you can actually afford.
              </p>
              <div className="space-y-3">
                {[
                  { value: 'free', label: 'Free Only', desc: '$0/month - Just starting out' },
                  { value: 'low', label: 'Budget-Friendly', desc: '$0-15/user/month' },
                  { value: 'medium', label: 'Standard Budget', desc: '$15-50/user/month' },
                  { value: 'high', label: 'Premium Budget', desc: '$50-100/user/month' },
                  { value: 'enterprise', label: 'Enterprise Budget', desc: '$100+/user/month or custom pricing' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, budget: option.value })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers.budget === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Priority */}
          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                What matters most to you?
              </h2>
              <p className="text-slate-600 mb-8">
                Every tool has trade-offs. What's your top priority?
              </p>
              <div className="space-y-3">
                {[
                  { value: 'easy', label: 'Easy to Use', desc: 'Team can start using it immediately' },
                  { value: 'powerful', label: 'Powerful Features', desc: 'Advanced capabilities worth the learning curve' },
                  { value: 'affordable', label: 'Most Affordable', desc: 'Best bang for buck' },
                  { value: 'integrations', label: 'Great Integrations', desc: 'Works with everything we use' },
                  { value: 'support', label: 'Customer Support', desc: 'Help when we need it' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, priority: option.value })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers.priority === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProgress()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {step === 5 ? 'Get My Recommendations →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
