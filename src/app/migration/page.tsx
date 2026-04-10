'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllTools, calculateMonthlyCost } from '@/lib/toolsService';
import { AITool } from '@/data/tools';

// Migration complexity factors
function getMigrationComplexity(from: AITool, to: AITool): {
  dataComplexity: 'low' | 'medium' | 'high';
  trainingDays: number;
  migrationWeeks: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes: string[];
} {
  const notes: string[] = [];
  let migrationWeeks = 2;
  let trainingDays = 3;

  // Category change = harder migration
  const sameCategory = from.category === to.category;
  if (!sameCategory) {
    migrationWeeks += 2;
    notes.push('Different tool categories — expect a longer transition and workflow redesign.');
  }

  // Enterprise tools = harder to leave
  if (from.pricingTier === 'enterprise') {
    migrationWeeks += 4;
    notes.push('Enterprise migrations typically require dedicated project management and phased rollout.');
  }

  // Learning curve
  if (to.learningCurve === 'steep') {
    trainingDays += 5;
    notes.push(`${to.name} has a steep learning curve — budget extra onboarding time.`);
  } else if (to.learningCurve === 'easy') {
    trainingDays = Math.max(1, trainingDays - 1);
  }

  // Direct integration check (easier migration if tools integrate)
  const integrates = from.integrations.some(i =>
    i.toolName.toLowerCase().includes(to.name.toLowerCase())
  ) || to.integrations.some(i =>
    i.toolName.toLowerCase().includes(from.name.toLowerCase())
  );

  if (integrates) {
    notes.push(`${from.name} and ${to.name} have a direct integration — you can run them in parallel during transition.`);
    migrationWeeks = Math.max(2, migrationWeeks - 1);
  }

  const dataComplexity =
    from.pricingTier === 'enterprise' || from.integrations.length > 6 ? 'high'
    : from.integrations.length > 3 ? 'medium'
    : 'low';

  const riskLevel =
    migrationWeeks >= 8 || dataComplexity === 'high' ? 'high'
    : migrationWeeks >= 4 ? 'medium'
    : 'low';

  return { dataComplexity, trainingDays, migrationWeeks, riskLevel, notes };
}

const riskColors = {
  low: { text: 'text-green-700', bg: 'bg-green-100', label: 'Low Risk' },
  medium: { text: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Medium Risk' },
  high: { text: 'text-red-700', bg: 'bg-red-100', label: 'High Risk' },
};

function MigrationContent() {
  const searchParams = useSearchParams();
  const preloadFrom = searchParams.get('from') || '';

  const allTools = getAllTools();
  const [fromId, setFromId] = useState(preloadFrom);
  const [toId, setToId] = useState('');
  const [teamSize, setTeamSize] = useState(25);
  const [monthlyRate, setMonthlyRate] = useState(8000);
  const [contractMonthsLeft, setContractMonthsLeft] = useState(6);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  const fromTool = allTools.find(t => t.id === fromId);
  const toTool = allTools.find(t => t.id === toId);

  const fromResults = useMemo(() => {
    if (!fromSearch.trim()) return [];
    const q = fromSearch.toLowerCase();
    return allTools.filter(t =>
      t.id !== toId &&
      (t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [fromSearch, toId, allTools]);

  const toResults = useMemo(() => {
    if (!toSearch.trim()) return [];
    const q = toSearch.toLowerCase();
    return allTools.filter(t =>
      t.id !== fromId &&
      (t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [toSearch, fromId, allTools]);

  const analysis = useMemo(() => {
    if (!fromTool || !toTool) return null;

    const complexity = getMigrationComplexity(fromTool, toTool);
    const currentCost = calculateMonthlyCost(fromTool, teamSize);
    const newCost = calculateMonthlyCost(toTool, teamSize);

    // Migration cost factors
    const hourlyRate = 150; // developer/consultant rate
    const dataMigrationHours = complexity.dataComplexity === 'high' ? 80 : complexity.dataComplexity === 'medium' ? 40 : 16;
    const trainingCostPerPerson = complexity.trainingDays * 400; // lost productivity
    const integrationRebuildCost = fromTool.integrations.length * 800; // each integration ~$800 to rebuild
    const parallelRunCost = currentCost.monthlyLow * (complexity.migrationWeeks / 4); // running both tools

    const totalMigrationCost = Math.round(
      (dataMigrationHours * hourlyRate) +
      (trainingCostPerPerson * teamSize) +
      integrationRebuildCost +
      parallelRunCost
    );

    const monthlySavings = currentCost.monthlyLow - newCost.monthlyLow;
    const monthsToBreakEven = monthlySavings > 0
      ? Math.ceil(totalMigrationCost / monthlySavings)
      : null;

    const earlyTerminationCost = contractMonthsLeft * currentCost.monthlyLow;
    const totalCostOfSwitch = totalMigrationCost + Math.max(0, earlyTerminationCost);

    return {
      complexity,
      currentCost,
      newCost,
      dataMigrationCost: dataMigrationHours * hourlyRate,
      trainingCost: trainingCostPerPerson * teamSize,
      integrationCost: integrationRebuildCost,
      parallelRunCost: Math.round(parallelRunCost),
      earlyTerminationCost: Math.round(earlyTerminationCost),
      totalMigrationCost,
      totalCostOfSwitch: Math.round(totalCostOfSwitch),
      monthlySavings,
      monthsToBreakEven,
    };
  }, [fromTool, toTool, teamSize, contractMonthsLeft]);

  const verdict = useMemo(() => {
    if (!analysis) return null;
    if (analysis.monthsToBreakEven === null) {
      return {
        emoji: '⚠️',
        label: 'Probably Not Worth It',
        color: 'text-orange-700',
        bg: 'bg-orange-50 border-orange-200',
        reason: `The new tool doesn't appear cheaper than your current one. Switching costs won't be recovered from pricing savings alone — only switch if there's a strong capability reason.`,
      };
    }
    if (analysis.monthsToBreakEven <= 6) {
      return {
        emoji: '✅',
        label: 'Strong Case to Switch',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        reason: `You'll break even in ${analysis.monthsToBreakEven} months and save $${(analysis.monthlySavings * 12).toLocaleString()}/year after that. Switch when your contract expires.`,
      };
    }
    if (analysis.monthsToBreakEven <= 18) {
      return {
        emoji: '🤔',
        label: 'Reasonable Case to Switch',
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        reason: `Break-even at ${analysis.monthsToBreakEven} months. Worth it if the new tool solves real pain beyond just cost savings.`,
      };
    }
    return {
      emoji: '❌',
      label: 'Hard to Justify on Cost Alone',
      color: 'text-red-700',
      bg: 'bg-red-50 border-red-200',
      reason: `Break-even at ${analysis.monthsToBreakEven} months is a long time. Only switch if there are critical capability gaps or compliance issues your current tool can't solve.`,
    };
  }, [analysis]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Should I Switch?</h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Calculate the real cost of migrating — including data migration, retraining,
            integration rebuilds, and lost productivity.
          </p>
        </div>

        {/* Tool Selectors */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* From */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-1">Current Tool</h3>
            <p className="text-sm text-slate-700 mb-3">What you're migrating away from</p>
            {fromTool ? (
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div>
                  <div className="font-semibold text-slate-900">{fromTool.name}</div>
                  <div className="text-xs text-slate-700">{fromTool.category}</div>
                </div>
                <button onClick={() => setFromId('')} className="text-slate-600 hover:text-red-500 text-lg">×</button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={fromSearch}
                  onChange={e => setFromSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fromResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 mt-1">
                    {fromResults.map(t => (
                      <button key={t.id} onClick={() => { setFromId(t.id); setFromSearch(''); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-0">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-slate-600">{t.category}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* To */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-1">Target Tool</h3>
            <p className="text-sm text-slate-700 mb-3">What you're considering switching to</p>
            {toTool ? (
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div>
                  <div className="font-semibold text-slate-900">{toTool.name}</div>
                  <div className="text-xs text-slate-700">{toTool.category}</div>
                </div>
                <button onClick={() => setToId('')} className="text-slate-600 hover:text-red-500 text-lg">×</button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={toSearch}
                  onChange={e => setToSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {toResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 mt-1">
                    {toResults.map(t => (
                      <button key={t.id} onClick={() => { setToId(t.id); setToSearch(''); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-0">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-slate-600">{t.category}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">Your Situation</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Team Size</label>
              <input type="number" value={teamSize} onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Current Monthly Cost ($)</label>
              <input type="number" value={monthlyRate} onChange={e => setMonthlyRate(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Contract Months Remaining</label>
              <input type="number" value={contractMonthsLeft} onChange={e => setContractMonthsLeft(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Results */}
        {analysis && verdict && fromTool && toTool && (
          <div className="space-y-6">
            {/* Verdict */}
            <div className={`rounded-xl border-2 p-6 ${verdict.bg}`}>
              <div className={`flex items-center gap-3 mb-2`}>
                <span className="text-3xl">{verdict.emoji}</span>
                <h2 className={`text-2xl font-bold ${verdict.color}`}>{verdict.label}</h2>
              </div>
              <p className="text-slate-700">{verdict.reason}</p>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Full Cost Breakdown</h3>
              <div className="space-y-3 mb-4">
                {[
                  { label: 'Data migration (developer time)', value: analysis.dataMigrationCost },
                  { label: `Staff retraining (${teamSize} people)`, value: analysis.trainingCost },
                  { label: `Integration rebuilds (${fromTool.integrations.length} integrations)`, value: analysis.integrationCost },
                  { label: `Parallel run cost (~${analysis.complexity.migrationWeeks} weeks)`, value: analysis.parallelRunCost },
                  { label: `Early termination (${contractMonthsLeft} months left)`, value: analysis.earlyTerminationCost },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span className="text-slate-700">{label}</span>
                    <span className="font-medium text-slate-900">${value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Total Cost of Switching</span>
                  <span className="text-red-600">${analysis.totalCostOfSwitch.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Savings Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 text-sm mb-3">CURRENT COST</h3>
                <div className="text-3xl font-bold text-slate-900 mb-1">{analysis.currentCost.label}</div>
                <div className="text-sm text-slate-700">{fromTool.name} · {teamSize} users</div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 text-sm mb-3">NEW COST</h3>
                <div className="text-3xl font-bold text-slate-900 mb-1">{analysis.newCost.label}</div>
                <div className="text-sm text-slate-700">{toTool.name} · {teamSize} users</div>
              </div>
            </div>

            {/* Break-even */}
            {analysis.monthsToBreakEven !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Break-Even Analysis</h3>
                <p className="text-slate-700">
                  At <strong>${analysis.monthlySavings.toLocaleString()}/month savings</strong>, you'll recover the
                  ${analysis.totalCostOfSwitch.toLocaleString()} migration cost in{' '}
                  <strong>{analysis.monthsToBreakEven} months</strong>.
                  After that, you'll save <strong>${(analysis.monthlySavings * 12).toLocaleString()}/year</strong>.
                </p>
              </div>
            )}

            {/* Complexity Notes */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-semibold text-slate-900">Migration Complexity</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${riskColors[analysis.complexity.riskLevel].bg} ${riskColors[analysis.complexity.riskLevel].text}`}>
                  {riskColors[analysis.complexity.riskLevel].label}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-700 mb-1">Est. Timeline</div>
                  <div className="font-bold text-slate-900">{analysis.complexity.migrationWeeks} weeks</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-700 mb-1">Training Time</div>
                  <div className="font-bold text-slate-900">{analysis.complexity.trainingDays} days/person</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-700 mb-1">Data Complexity</div>
                  <div className="font-bold text-slate-900 capitalize">{analysis.complexity.dataComplexity}</div>
                </div>
              </div>
              {analysis.complexity.notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700 mb-2">
                  <span className="text-blue-500 shrink-0 mt-0.5">→</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>

            {/* Ask AI */}
            <div className="bg-slate-900 rounded-xl p-6 text-center text-white">
              <h3 className="text-xl font-bold mb-2">Want a second opinion?</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Ask our AI advisor about the {fromTool.name} → {toTool.name} migration for your specific situation.
              </p>
              <Link
                href={`/chat?context=${encodeURIComponent(`I'm considering migrating from ${fromTool.name} to ${toTool.name} with a team of ${teamSize} people.`)}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Chat with AI Advisor →
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!fromTool || !toTool) && (
          <div className="text-center py-12 text-slate-600">
            <div className="text-5xl mb-4">⚖️</div>
            <p>Select a current tool and a target tool above to see the full migration analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MigrationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading calculator...</div>}>
      <MigrationContent />
    </Suspense>
  );
}
