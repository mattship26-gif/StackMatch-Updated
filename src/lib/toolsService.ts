import toolsData, {
  AITool,
  ToolCategory,
  PricingTier,
  CompanySize,
} from '@/data/tools';

// ============================================
// BASIC QUERIES
// ============================================

export function getAllTools(): AITool[] {
  return toolsData;
}

export function getToolById(id: string): AITool | undefined {
  return toolsData.find(tool => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): AITool[] {
  return toolsData.filter(tool => tool.category === category);
}

export function getAllCategories(): ToolCategory[] {
  return Array.from(new Set(toolsData.map(tool => tool.category)));
}

// ============================================
// FILTERING
// ============================================

interface FilterCriteria {
  category?: ToolCategory;
  priceTier?: PricingTier | PricingTier[];
  companySize?: CompanySize | CompanySize[];
  role?: string;
  learningCurve?: 'easy' | 'medium' | 'steep';
}

export function filterTools(criteria: FilterCriteria): AITool[] {
  let filtered = toolsData;

  if (criteria.category) {
    filtered = filtered.filter(tool => tool.category === criteria.category);
  }

  if (criteria.priceTier) {
    const tiers = Array.isArray(criteria.priceTier)
      ? criteria.priceTier
      : [criteria.priceTier];
    filtered = filtered.filter(tool => tiers.includes(tool.priceTier));
  }

  if (criteria.companySize) {
    const sizes = Array.isArray(criteria.companySize)
      ? criteria.companySize
      : [criteria.companySize];
    filtered = filtered.filter(tool =>
      tool.bestFor.some(size => sizes.includes(size))
    );
  }

  if (criteria.role) {
    filtered = filtered.filter(tool =>
      tool.primaryRoles.some(role =>
        role.toLowerCase().includes(criteria.role!.toLowerCase())
      )
    );
  }

  if (criteria.learningCurve) {
    filtered = filtered.filter(
      tool => tool.learningCurve === criteria.learningCurve
    );
  }

  return filtered;
}

// ============================================
// SEARCH
// ============================================

export function searchTools(query: string): AITool[] {
  const lowerQuery = query.toLowerCase();

  return toolsData.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.detailedDescription.toLowerCase().includes(lowerQuery) ||
    tool.keyFeatures.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
    tool.category.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// COMPARISONS
// ============================================

export function compareTools(toolIds: string[]): AITool[] {
  return toolsData.filter(tool => toolIds.includes(tool.id));
}

export function getSimilarTools(toolId: string, limit: number = 5): AITool[] {
  const tool = getToolById(toolId);
  if (!tool) return [];

  return toolsData
    .filter(
      t =>
        t.id !== toolId &&
        t.category === tool.category &&
        t.bestFor.some(size => tool.bestFor.includes(size))
    )
    .slice(0, limit);
}

// ============================================
// RECOMMENDATION ENGINE
// ============================================

export type BudgetRange = 'free' | 'low' | 'medium' | 'high' | 'enterprise';
export type UserPriority = 'easy' | 'powerful' | 'affordable' | 'integrations' | 'support';

export interface UserProfile {
  companySize: CompanySize;
  role?: string;
  budgetRange?: BudgetRange;
  teamSize?: number;
  priorities?: UserPriority[];
  categoryHint?: string;
}

export interface ScoredTool {
  tool: AITool;
  score: number;
  matchReasons: string[];
}

// Maps quiz budget strings to acceptable pricing tiers
const BUDGET_TO_TIERS: Record<BudgetRange, PricingTier[]> = {
  free:       ['free'],
  low:        ['free', 'starter'],
  medium:     ['free', 'starter', 'professional'],
  high:       ['free', 'starter', 'professional', 'enterprise'],
  enterprise: ['free', 'starter', 'professional', 'enterprise'],
};

// Maps quiz category strings to ToolCategory substrings
const CATEGORY_HINT_MAP: Record<string, string[]> = {
  project:       ['Project Management', 'Collaboration'],
  communication: ['Communication', 'Video', 'Messaging'],
  crm:           ['CRM', 'Sales'],
  marketing:     ['Marketing', 'Email', 'Automation'],
  design:        ['Design', 'Prototyping', 'Creative'],
  development:   ['Development', 'Code', 'DevOps', 'Deployment'],
  analytics:     ['Analytics', 'Business Intelligence', 'Data'],
};

function getAvgRating(tool: AITool): number {
  if (!tool.ratings.length) return 3.5;
  return tool.ratings.reduce((sum, r) => sum + r.score, 0) / tool.ratings.length;
}

function scoreToolForProfile(tool: AITool, profile: UserProfile): ScoredTool {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Company size fit
  if (tool.bestFor.includes(profile.companySize)) {
    score += 30;
    matchReasons.push(`Built for ${profile.companySize} companies`);
  } else {
    score -= 20;
  }

  // 2. Role fit
  if (profile.role) {
    const roleMatch = tool.primaryRoles.some(r =>
      r.toLowerCase().includes(profile.role!.toLowerCase()) ||
      profile.role!.toLowerCase().includes(r.toLowerCase())
    );
    if (roleMatch) {
      score += 20;
      matchReasons.push(`Recommended for ${profile.role}s`);
    }
  }

  // 3. Budget fit
  if (profile.budgetRange) {
    const acceptableTiers = BUDGET_TO_TIERS[profile.budgetRange];
    if (acceptableTiers.includes(tool.pricingTier)) {
      score += 20;
      matchReasons.push('Fits your budget');
    } else {
      score -= 15;
    }
    if (profile.budgetRange === 'free' && tool.pricingTier === 'free') {
      score += 10;
    }
  }

  // 4. Category hint
  if (profile.categoryHint && profile.categoryHint !== 'other') {
    const keywords = CATEGORY_HINT_MAP[profile.categoryHint] ?? [profile.categoryHint];
    const categoryMatch = keywords.some(kw =>
      tool.category.toLowerCase().includes(kw.toLowerCase())
    );
    if (categoryMatch) {
      score += 25;
      matchReasons.push('Matches your category');
    }
  }

  // 5. Priority scoring
  for (const priority of profile.priorities ?? []) {
    switch (priority) {
      case 'easy':
        if (tool.learningCurve === 'easy') {
          score += 15;
          matchReasons.push('Easy to learn');
        } else if (tool.learningCurve === 'steep') {
          score -= 10;
        }
        break;

      case 'powerful':
        if (tool.learningCurve === 'steep') score += 10;
        if (tool.keyFeatures.length >= 8) {
          score += 5;
          matchReasons.push('Feature-rich');
        }
        break;

      case 'affordable':
        if (tool.pricingTier === 'free') {
          score += 15;
          matchReasons.push('Free tier available');
        } else if (tool.pricingTier === 'starter') {
          score += 10;
          matchReasons.push('Budget-friendly pricing');
        }
        break;

      case 'integrations':
        if (tool.integrations.length >= 5) {
          score += 15;
          matchReasons.push(`${tool.integrations.length} integrations`);
        } else if (tool.integrations.length >= 3) {
          score += 8;
        }
        break;

      case 'support':
        if (tool.pricingTier === 'enterprise' || tool.pricingTier === 'professional') {
          score += 10;
          matchReasons.push('Dedicated support');
        }
        break;
    }
  }

  // 6. Rating quality signal
  const avg = getAvgRating(tool);
  if (avg >= 4.5) {
    score += 10;
    matchReasons.push(`Top-rated (${avg.toFixed(1)}★)`);
  } else if (avg >= 4.0) {
    score += 5;
  }

  return { tool, score, matchReasons };
}

export function recommendTools(
  profile: UserProfile,
  limit: number = 12
): ScoredTool[] {
  return toolsData
    .map(tool => scoreToolForProfile(tool, profile))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ============================================
// COST CALCULATOR
// ============================================

export interface CostEstimate {
  monthlyLow: number;
  monthlyHigh: number;
  annualLow: number;
  annualHigh: number;
  label: string;
  notes: string[];
}

const TIER_COST_PER_USER: Record<PricingTier, { low: number; high: number }> = {
  free:         { low: 0,   high: 0   },
  starter:      { low: 5,   high: 25  },
  professional: { low: 25,  high: 75  },
  enterprise:   { low: 75,  high: 300 },
};

export function calculateMonthlyCost(tool: AITool, teamSize: number): CostEstimate {
  const range = TIER_COST_PER_USER[tool.pricingTier];

  const monthlyLow  = range.low  * teamSize;
  const monthlyHigh = range.high * teamSize;
  const annualLow   = monthlyLow  * 12;
  const annualHigh  = monthlyHigh * 12;

  const notes: string[] = [];
  if (tool.pricingTier === 'free') {
    notes.push('Free plan available — verify usage limits before committing');
  }
  if (tool.pricingTier === 'enterprise') {
    notes.push('Enterprise pricing is negotiated — budget 20-30% above list for implementation');
  }
  if (tool.integrations.some(i => i.complexity === 'complex')) {
    notes.push('Complex integrations may require developer time (~$150-200/hr)');
  }
  if (tool.learningCurve === 'steep') {
    const trainingCost = teamSize * 200;
    notes.push(`Factor in ~$${trainingCost.toLocaleString()} for onboarding and training`);
  }

  const fmt = (n: number) => n === 0 ? 'Free' : `$${n.toLocaleString()}`;
  const label = monthlyLow === monthlyHigh
    ? fmt(monthlyLow)
    : `${fmt(monthlyLow)} – ${fmt(monthlyHigh)}/mo`;

  return { monthlyLow, monthlyHigh, annualLow, annualHigh, label, notes };
}

// ============================================
// UTILITIES
// ============================================

export function getTopRated(
  category?: ToolCategory,
  limit: number = 10
): AITool[] {
  const tools = category ? getToolsByCategory(category) : toolsData;

  return tools
    .filter(tool => tool.ratings.length > 0)
    .sort((a, b) => {
      const avgA = a.ratings.reduce((sum, r) => sum + r.score, 0) / a.ratings.length;
      const avgB = b.ratings.reduce((sum, r) => sum + r.score, 0) / b.ratings.length;
      return avgB - avgA;
    })
    .slice(0, limit);
}
