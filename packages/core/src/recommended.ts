import { OpenRouterModel } from "./api";

export interface ModelWithTier extends OpenRouterModel {
  tier: "free" | "budget" | "premium";
  estimatedCost: string;
  priority: number;
}

// Major providers we want to prioritize
const MAJOR_PROVIDERS = [
  "openai",
  "anthropic", 
  "google",
  "meta-llama",
  "mistralai",
  "nvidia",
  "cohere",
];

export function categorizeModel(model: OpenRouterModel): ModelWithTier {
  const promptPrice = parseFloat(model.pricing.prompt);
  const completionPrice = parseFloat(model.pricing.completion);
  
  let tier: "free" | "budget" | "premium";
  let estimatedCost: string;
  let priority: number = 0;
  
  // Determine tier based on pricing
  if (promptPrice === 0 && completionPrice === 0) {
    tier = "free";
    estimatedCost = "$0.00";
    priority = 100; // Highest priority for free
  } else if (promptPrice < 0.0005) { // Less than $0.50 per 1M tokens = $0.03 per 68 questions
    tier = "budget";
    estimatedCost = `$${(promptPrice * 3400 + completionPrice * 68).toFixed(3)}`;
    priority = 50;
  } else {
    tier = "premium";
    estimatedCost = `$${(promptPrice * 3400 + completionPrice * 68).toFixed(2)}`;
    priority = 10;
  }
  
  // Boost priority for major providers
  const provider = model.id.split("/")[0];
  if (MAJOR_PROVIDERS.includes(provider)) {
    priority += 20;
  }
  
  // Boost priority for models with good context length
  if (model.context_length >= 8000) {
    priority += 5;
  }
  
  return {
    ...model,
    tier,
    estimatedCost,
    priority,
  };
}

export function getRecommendedModels(allModels: OpenRouterModel[]): ModelWithTier[] {
  // Categorize all models
  const categorized = allModels.map(categorizeModel);
  
  // Sort by priority (higher first)
  categorized.sort((a, b) => b.priority - a.priority);
  
  // Get top models from each tier
  const free = categorized.filter(m => m.tier === "free").slice(0, 20);
  const budget = categorized.filter(m => m.tier === "budget").slice(0, 15);
  const premium = categorized.filter(m => m.tier === "premium").slice(0, 10);
  
  return [...free, ...budget, ...premium];
}

export function getRecommendedModelsByTier(
  allModels: OpenRouterModel[], 
  tier: "free" | "budget" | "premium"
): ModelWithTier[] {
  const recommended = getRecommendedModels(allModels);
  return recommended.filter(m => m.tier === tier);
}

export function filterByProvider(models: ModelWithTier[], provider: string): ModelWithTier[] {
  return models.filter(m => m.id.startsWith(provider + "/"));
}

export function getTopModels(allModels: OpenRouterModel[], limit: number = 20): ModelWithTier[] {
  const recommended = getRecommendedModels(allModels);
  return recommended.slice(0, limit);
}

