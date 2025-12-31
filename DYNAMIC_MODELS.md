# 🔄 Dynamic Model Discovery

## Overview

The Gym AI Benchmark uses **dynamic model discovery** from the OpenRouter API. This means:

- ✅ **No hardcoded model lists** that go stale
- ✅ **Always up-to-date** with the latest models
- ✅ **Smart prioritization** based on pricing, provider, and capabilities
- ✅ **Automatic tier classification** (free/budget/premium)

## How It Works

### 1. API Fetching

Every time you run `models` or `recommend`, the CLI fetches the current list of models from OpenRouter:

```bash
./gym-bench.sh models --free
# Fetches 350+ models and filters to 35+ free ones
```

### 2. Smart Categorization

The system analyzes each model and assigns:

- **Tier**: free, budget, or premium based on pricing
- **Priority**: Higher score = better model (based on provider, context length, etc.)
- **Estimated Cost**: Calculated per full benchmark (68 questions)

**Tier Classification:**

- **Free**: $0.00 per 1M tokens (prompt + completion)
- **Budget**: < $0.50 per 1M tokens (< $0.03 per benchmark)
- **Premium**: ≥ $0.50 per 1M tokens

### 3. Prioritization Factors

Models get priority points based on:

| Factor | Points | Notes |
|--------|--------|-------|
| Free tier | +100 | Highest priority |
| Budget tier | +50 | Medium priority |
| Premium tier | +10 | Lower priority |
| Major provider | +20 | OpenAI, Anthropic, Google, Meta, Mistral, NVIDIA, Cohere |
| Large context | +5 | ≥ 8000 tokens |

**Major Providers:**
- OpenAI
- Anthropic
- Google
- Meta (Llama)
- Mistral
- NVIDIA
- Cohere

### 4. Recommendations

The `recommend` command shows the top models for each tier:

```bash
# Top 20 free models (sorted by priority)
./gym-bench.sh recommend --tier free

# Top 30 budget models
./gym-bench.sh recommend --tier budget --limit 30

# Only untested premium models
./gym-bench.sh recommend --tier premium --untested
```

## Architecture

### Core Functions

**`packages/core/src/api.ts`**
- `fetchAvailableModels()`: Fetches all models from OpenRouter API

**`packages/core/src/recommended.ts`**
- `categorizeModel()`: Analyzes and categorizes a single model
- `getRecommendedModels()`: Returns top models across all tiers
- `getRecommendedModelsByTier()`: Filters by specific tier
- `getTopModels()`: Returns top N models

**`packages/cli/src/index.ts`**
- Integrates `fetchAvailableModels()` into `models` command
- Adds `--free`, `--popular`, `--all` options

**`packages/cli/src/commands/recommend.ts`**
- New `recommend` command
- Shows categorized models with testing status
- Suggests next model to test

## Benefits

### 1. Always Current
No need to manually update model lists. As OpenRouter adds new models, they automatically appear.

### 2. No Vendor Lock-in
The system works with ANY model on OpenRouter, not just a curated list.

### 3. Cost Awareness
Automatically calculates and displays cost per benchmark for each model.

### 4. Future-Proof
When GPT-5, Claude 4, or Gemini 3 launch, they'll automatically be discovered and recommended.

## Examples

### Discover New Models

```bash
# See what's new (sorted by priority)
./gym-bench.sh recommend --tier free --limit 50

# Get all 350+ models
./gym-bench.sh models --all
```

### Test Popular Models

```bash
# Get top 10 free models
./gym-bench.sh recommend --tier free --limit 10

# Run the top one
./gym-bench.sh run -m nvidia/nemotron-3-nano-30b-a3b:free
```

### Find Untested Models

```bash
# Show only models you haven't tested
./gym-bench.sh recommend --untested

# Filter by tier
./gym-bench.sh recommend --tier free --untested
```

## Implementation Details

### Model Data Structure

```typescript
interface OpenRouterModel {
  id: string;                    // "nvidia/nemotron-3-nano-30b-a3b:free"
  name: string;                  // "NVIDIA: Nemotron 3 Nano 30B A3B (free)"
  context_length: number;        // 256000
  pricing: {
    prompt: string;              // "0"
    completion: string;          // "0"
  };
  top_provider?: boolean;        // true/false
}

interface ModelWithTier extends OpenRouterModel {
  tier: "free" | "budget" | "premium";
  estimatedCost: string;         // "$0.00" or "$0.023" or "$1.50"
  priority: number;              // 0-125 (higher = better)
}
```

### Cost Calculation

For a full benchmark (68 questions):

```
Estimated Cost = (promptPrice × 3400) + (completionPrice × 68)
```

Assumptions:
- Average prompt: ~50 tokens per question
- Total prompt tokens: 68 × 50 = 3,400
- Average completion: 1 token per answer (A/B/C/D)
- Total completion tokens: 68

### API Rate Limits

OpenRouter's `/models` endpoint has generous rate limits:
- No authentication required (but recommended)
- Cached for 5 minutes on their end
- Returns 350+ models in < 1 second

## Future Enhancements

Potential improvements:

1. **Cache Results Locally**: Store fetched models for 1 hour to reduce API calls
2. **Model Metadata**: Add model capabilities (vision, function calling, etc.)
3. **Performance Tracking**: Track which models perform best over time
4. **Cost Tracking**: Sum total costs across all benchmarks
5. **Auto-Update Check**: Notify when new models are available

## See Also

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [QUICKSTART.md](QUICKSTART.md) - Getting started guide
- [README.md](README.md) - Main documentation
