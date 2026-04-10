'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { getAllTools, calculateMonthlyCost } from '@/lib/toolsService';
import { AITool } from '@/data/tools';

// Compatibility score between two tools based on shared integrations
function getCompatibilityScore(a: AITool, b: AITool): number {
  const aIntegrations = new Set(a.integrations.map(i => i.toolName.toLowerCase()));
  const bIntegrations = new Set(b.integrations.map(i => i.toolName.toLowerCase()));

  // Direct integration check
  const aIntegratesB = a.integrations.some(i =>
    i.toolName.toLowerCase().includes(b.name.toLowerCase()) ||
    b.name.toLowerCase().includes(i.toolName.toLowerCase())
  );
  const bIntegratesA = b.integrations.some(i =>
    i.toolName.toLowerCase().includes(a.name.toLowerCase()) ||
    a.name.toLowerCase().includes(i.toolName.toLowerCase())
  );

  if (aIntegratesB && bIntegratesA) return 100;
  if (aIntegratesB || bIntegratesA) return 80;

  // Category overlap (potential conflict)
  if (a.category === b.category) return 20;

  // Shared integration ecosystem (both integrate with same tools)
  let sharedCount = 0;
  aIntegrations.forEach(name => { if (bIntegrations.has(name)) sharedCount++; });
  if (sharedCount >= 5) return 70;
  if (sharedCount >= 3) return 55;
  if (sharedCount >= 1) return 40;

  return 30; // Unknown/neutral
}

function compatibilityLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Native Integration', color: 'text-green-700', bg: 'bg-green-100' };
  if (score >= 55) return { label: 'Works Together', color: 'text-blue-700', bg: 'bg-blue-100' };
  if (score >= 35) return { label: 'Limited Integration', color: 'text-yellow-700', bg: 'bg-yellow-100' };
  return { label: 'Potential Overlap', color: 'text-red-700', bg: 'bg-red-100' };
}

function StackBuilderContent() {
  const searchParams = useSearchParams();
  const preloadIds = searchParams.get('preload')?.split(',') ?? [];

  const allTools = getAllTools();
  const [selectedIds, setSelectedIds] = useState<string[]>(preloadIds);
  const [search, setSearch] = useState('');
  const [teamSize, setTeamSize] = useState(20);

  const selectedTools = useMemo(
    () => selectedIds.map(id => allTools.find(t => t.id === id)).filter(Boolean) as AITool[],
    [selectedIds, allTools]
  );

  const filteredTools = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allTools
      .filter(t =>
        !selectedIds.includes(t.id) &&
        (t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [search, selectedIds, allTools]);

  // Compatibility matrix
  const compatibilityPairs = useMemo(() => {
    const pairs: { a: AITool; b: AITool; score: number }[] = [];
    for (let i = 0; i < selectedTools.length; i++) {
      for (let j = i + 1; j < selectedTools.length; j++) {
        pairs.push({
          a: selectedTools[i],
          b: selectedTools[j],
          score: getCompatibilityScore(selectedTools[i], selectedTools[j]),
        });
      }
    }
    return pairs.sort((a, b) => b.score - a.score);
  }, [selectedTools]);

  // Suggested additions based on integrations
  const suggestions = useMemo(() => {
    if (selectedTools.length === 0) return [];
    const mentionedNames = new Set<string>();
    selectedTools.forEach(t => {
      t.integrations.forEach(i => mentionedNames.add(i.toolName.toLowerCase()));
    });

    return allTools
      .filter(t =>
        !selectedIds.includes(t.id) &&
        mentionedNames.has(t.name.toLowerCase())
      )
      .slice(0, 4);
  }, [selectedTools, selectedIds, allTools]);

  // Total cost
  const totalCostMonthly = selectedTools.reduce((sum, tool) => {
    const est = calculateMonthlyCost(tool, teamSize);
    return sum + est.monthlyLow;
  }, 0);

  const addTool = (id: string) => {
    setSelectedIds(prev => [...prev, id]);
    setSearch('');
  };

  const removeTool = (id: string) => {
    setSelectedIds(prev => prev.filter(x => x !== id));
  };

  // Detect conflicts (same category tools in stack)
  const categoryConflicts = useMemo(() => {
    const categoryCounts: Record<string, AITool[]> = {};
    selectedTools.forEach(t => {
      if (!categoryCounts[t.category]) categoryCounts[t.category] = [];
      categoryCounts[t.category].push(t);
    });
    return Object.entries(categoryCounts)
      .filter(([, tools]) => tools.length > 1)
      .map(([category, tools]) => ({ category, tools }));
  }, [selectedTools]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Stack Builder</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Add your current (or planned) tools. See compatibility scores, detect conflicts,
            and get recommendations for what's missing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Add */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Add Tools to Your Stack</h2>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, category, or use case..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {filteredTools.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 mt-1">
                    {filteredTools.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => addTool(tool.id)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                      >
                        <div className="font-medium text-slate-900 text-sm">{tool.name}</div>
                        <div className="text-xs text-slate-500">{tool.category}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Current Stack */}
            {selectedTools.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Your Stack ({selectedTools.length} tools)</h2>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTools.map(tool => (
                    <div
                      key={tool.id}
                      className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5"
                    >
                      <span className="text-sm font-medium text-blue-800">{tool.name}</span>
                      <button
                        onClick={() => removeTool(tool.id)}
                        className="text-blue-400 hover:text-blue-600 text-sm leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                <div className="text-4xl mb-3">🧩</div>
                <p className="text-slate-500">Search for tools above to start building your stack</p>
                <p className="text-slate-400 text-sm mt-1">Try: "Salesforce", "Project Management", or "HRIS"</p>
              </div>
            )}

            {/* Conflict Warnings */}
            {categoryConflicts.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  ⚠️ Potential Overlap Detected
                </h3>
                {categoryConflicts.map(({ category, tools }) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <span className="text-sm text-orange-800">
                      <strong>{tools.map(t => t.name).join(' & ')}</strong> both cover {category}.
                      Make sure you need both or consider removing one.
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Compatibility Matrix */}
            {compatibilityPairs.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Integration Compatibility</h2>
                <div className="space-y-2">
                  {compatibilityPairs.map(({ a, b, score }) => {
                    const info = compatibilityLabel(score);
                    return (
                      <div key={`${a.id}-${b.id}`} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-slate-800">{a.name}</span>
                          <span className="text-slate-400">↔</span>
                          <span className="font-medium text-slate-800">{b.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${info.bg} ${info.color} font-medium`}>
                          {info.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-1">Recommended Additions</h2>
                <p className="text-sm text-slate-500 mb-4">Tools your stack already integrates with</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {suggestions.map(tool => (
                    <div key={tool.id} className="border border-slate-200 rounded-lg p-3 flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{tool.name}</div>
                        <div className="text-xs text-slate-500">{tool.category}</div>
                      </div>
                      <button
                        onClick={() => addTool(tool.id)}
                        className="shrink-0 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary & Cost */}
          <div className="space-y-6">
            {/* Team Size */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Team Size</h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={500}
                  value={teamSize}
                  onChange={e => setTeamSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-bold text-slate-900 w-12 text-right">{teamSize}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Used for cost estimates</p>
            </div>

            {/* Cost Summary */}
            {selectedTools.length > 0 && (
              <div className="bg-slate-900 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-4">Estimated Stack Cost</h3>
                <div className="space-y-2 mb-4">
                  {selectedTools.map(tool => {
                    const est = calculateMonthlyCost(tool, teamSize);
                    return (
                      <div key={tool.id} className="flex justify-between text-sm">
                        <span className="text-slate-300">{tool.name}</span>
                        <span className="text-white font-medium">{est.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="font-semibold">Total / month</span>
                  <span className="font-bold text-xl">
                    {totalCostMonthly === 0 ? 'Free' : `~$${totalCostMonthly.toLocaleString()}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Estimates based on {teamSize} users. Actual pricing varies — click any tool for details.
                </p>
              </div>
            )}

            {/* Share / Export */}
            {selectedTools.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Save or Compare</h3>
                <div className="space-y-2">
                  <Link
                    href={`/migration?from=${selectedIds[0] ?? ''}`}
                    className="block w-full text-center text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition"
                  >
                    → Run Migration Calculator
                  </Link>
                  <Link
                    href="/chat"
                    className="block w-full text-center text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    → Ask AI About This Stack
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StackBuilderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-600">Loading stack builder...</div>}>
      <StackBuilderContent />
    </Suspense>
  );
}
