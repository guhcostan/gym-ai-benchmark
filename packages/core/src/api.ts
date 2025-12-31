import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture?: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
  };
  per_request_limits?: any;
}

export interface OpenRouterResponse {
  data: OpenRouterModel[];
}

export async function fetchAvailableModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://github.com/guhcostan/gym-ai-benchmark",
        "X-Title": "Gym AI Benchmark",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as OpenRouterResponse;
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch models from OpenRouter:", error);
    return [];
  }
}

export function filterFreeModels(models: OpenRouterModel[]): OpenRouterModel[] {
  return models.filter((model) => 
    model.id.includes(":free") || 
    (parseFloat(model.pricing.prompt) === 0 && parseFloat(model.pricing.completion) === 0)
  );
}

export function filterPopularModels(models: OpenRouterModel[]): OpenRouterModel[] {
  const popularProviders = ["openai", "anthropic", "google", "meta-llama", "mistralai"];
  
  return models.filter((model) => {
    const provider = model.id.split("/")[0];
    return popularProviders.includes(provider);
  }).sort((a, b) => {
    // Sort by popularity (approximate based on context length and pricing)
    const scoreA = a.context_length * (1 / (parseFloat(a.pricing.prompt) + 0.0001));
    const scoreB = b.context_length * (1 / (parseFloat(b.pricing.prompt) + 0.0001));
    return scoreB - scoreA;
  }).slice(0, 20); // Top 20 popular models
}

export function formatModelDisplay(model: OpenRouterModel): string {
  const cost = parseFloat(model.pricing.prompt) === 0 
    ? "FREE" 
    : `$${parseFloat(model.pricing.prompt).toFixed(4)}/1K tokens`;
  
  return `${model.id.padEnd(50)} ${cost.padStart(20)}`;
}

