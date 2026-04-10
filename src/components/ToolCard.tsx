import Link from 'next/link';
 
interface ToolRating {
  source: string;
  reviewCount: number;
  score: number;
}
 
interface ToolData {
  id: string;
  name: string;
  description: string;
  category: string;
  pricingTier: 'free' | 'starter' | 'professional' | 'enterprise';
  bestFor: string[];
  ratings: ToolRating[];
}
 
interface ToolCardProps {
  tool: ToolData;
}
 
export function ToolCard({ tool }: ToolCardProps) {
  const avgRating = tool.ratings.length > 0
    ? (tool.ratings.reduce((sum: number, r: ToolRating) => sum + r.score, 0) / tool.ratings.length).toFixed(1)
    : null;
 
  const pricingColor = {
    free: 'bg-green-100 text-green-800',
    starter: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-slate-100 text-slate-800',
  }[tool.pricingTier];
 
  return (
<Link href={`/tools/${tool.id}`}>
<div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition cursor-pointer h-full">
<div className="flex items-start justify-between mb-3">
<h3 className="text-xl font-bold text-slate-900">{tool.name}</h3>
 
          {avgRating && (
<div className="flex items-center gap-1 text-sm">
<span className="text-yellow-500">⭐</span>
<span className="font-semibold">{avgRating}</span>
</div>
          )}
</div>
 
        <div className="flex gap-2 mb-3 flex-wrap">
<span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
            {tool.category}
</span>
<span className={`text-xs px-2 py-1 rounded ${pricingColor}`}>
            {tool.pricingTier}
</span>
</div>
 
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {tool.description}
</p>
 
        <div className="text-xs text-slate-500">
          Best for: {tool.bestFor.join(', ')}
</div>
 
        <div className="mt-4 pt-4 border-t border-slate-100">
<span className="text-blue-600 text-sm font-medium">
            View details →
</span>
</div>
</div>
</Link>
  );
}
