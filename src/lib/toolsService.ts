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
  maxPrice?: number;
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
// RECOMMENDATIONS
// ============================================
 
interface UserProfile {
  companySize: CompanySize;
  role?: string;
  budget?: number;
  teamSize?: number;
  priorities?: ('easy' | 'affordable' | 'powerful' | 'integrations')[];
}
 
export function recommendTools(
  profile: UserProfile,
  category?: ToolCategory
): AITool[] {
  let candidates = category ? getToolsByCategory(category) : toolsData;
 
  candidates = candidates.filter(tool =>
    tool.bestFor.includes(profile.companySize)
  );
 
  if (profile.role) {
    candidates = candidates.filter(tool =>
      tool.primaryRoles.some(role =>
        role.toLowerCase().includes(profile.role!.toLowerCase())
      )
    );
  }
 
  return candidates.slice(0, 10);
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
      const avgA =
        a.ratings.reduce((sum, r) => sum + r.score, 0) / a.ratings.length;
      const avgB =
        b.ratings.reduce((sum, r) => sum + r.score, 0) / b.ratings.length;
      return avgB - avgA;
    })
    .slice(0, limit);
}
 
export function calculateMonthlyCost(tool: AITool, teamSize: number): string {
  return tool.pricingDetails;
}
