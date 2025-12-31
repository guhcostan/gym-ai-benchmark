# 🔄 Dynamic Model Discovery

## Overview

The Gym AI Benchmark now **dynamically fetches available models** from the OpenRouter API in real-time. This ensures you always have access to the latest models without manual updates.

## Benefits

✅ **Always Up-to-Date** - No need to update hardcoded lists  
✅ **Discover New Models** - Automatically see newly added models  
✅ **See Real Pricing** - Actual costs from OpenRouter  
✅ **Find Free Models** - Filter to see 35+ free options  
✅ **Model Descriptions** - See what each model does  

## Usage

### List All Models (Default View)
```bash
./gym-bench.sh models
```
Shows:
- Top 10 free models
- Top 10 popular models
- Total count (353 models currently)

### List Only Free Models
```bash
./gym-bench.sh models --free
```
Shows all 35+ free models with descriptions.

### List Popular Models
```bash
./gym-bench.sh models --popular
```
Shows top 20 popular models with pricing.

### List All Available Models
```bash
./gym-bench.sh models --all
```
Shows first 30 of 353 available models.

## New Free Models Discovered

The dynamic fetching revealed **35 free models**, including:

### Google Models (FREE!)
- `google/gemini-2.0-flash-exp:free`
- `google/gemini-2.0-flash-lite-001` 
- `google/gemini-2.5-flash-lite-preview-09-2025`
- `google/gemini-2.5-flash-lite`
- `google/gemini-2.0-flash-001`

### Meta Models (FREE!)
- `meta-llama/llama-4-maverick`

### OpenAI Models (FREE!)
- `openai/gpt-4.1-nano`
- `openai/gpt-4.1-mini`

### Nvidia Models (FREE!)
- `nvidia/nemotron-3-nano-30b-a3b:free`
- `nvidia/nemotron-nano-12b-v2-vl:free`
- `nvidia/nemotron-nano-9b-v2:free`

### Mistral Models (FREE!)
- `mistralai/devstral-2512:free`

### And Many More!
- Xiaomi MiMo-V2-Flash
- AllenAI Olmo 3.1 32B Think
- Arcee-AI Trinity Mini
- DeepSeek V3.1 Nex-N1
- KwaiPilot KAT-Coder-Pro
- Alibaba Tongyi DeepResearch
- And 20+ more...

## Example: Testing a Free Model

```bash
# Discover free models
./gym-bench.sh models --free

# Test one
./gym-bench.sh run -m google/gemini-2.0-flash-exp:free

# Compare multiple free models
./gym-bench.sh compare -m "google/gemini-2.0-flash-exp:free,meta-llama/llama-4-maverick,openai/gpt-4.1-mini"
```

## How It Works

### 1. API Call
The CLI calls `https://openrouter.ai/api/v1/models` with your API key.

### 2. Model Parsing
```typescript
interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  // ...
}
```

### 3. Filtering
- **Free Models**: `pricing.prompt == "0"` or `:free` suffix
- **Popular Models**: Sort by context length and usage patterns
- **All Models**: Complete list from API

### 4. Display
Models are shown with:
- ID (for use in commands)
- Pricing (per 1K tokens)
- Description (when available)
- Context length

## Fallback Behavior

If the API call fails:
```bash
⚠️  Could not connect to OpenRouter API
Showing cached popular models:
  • openai/gpt-4
  • openai/gpt-3.5-turbo
  • anthropic/claude-3-opus
  ...
```

## Technical Implementation

### Core Function
```typescript
// packages/core/src/api.ts
export async function fetchAvailableModels(): Promise<OpenRouterModel[]>
```

### Filters
```typescript
filterFreeModels(models: OpenRouterModel[]): OpenRouterModel[]
filterPopularModels(models: OpenRouterModel[]): OpenRouterModel[]
formatModelDisplay(model: OpenRouterModel): string
```

### CLI Integration
```typescript
// packages/cli/src/index.ts
program
  .command("models")
  .option("-f, --free", "Show only free models")
  .option("-p, --popular", "Show only popular models")
  .option("-a, --all", "Show all available models")
```

## Performance

- **API Call**: ~1-2 seconds
- **Models Returned**: 353 currently
- **Cache**: None (always fresh data)
- **Rate Limiting**: Respects OpenRouter limits

## Future Enhancements

Possible improvements:
- [ ] Cache results locally for 1 hour
- [ ] Sort by specific criteria (price, context, speed)
- [ ] Search models by keyword
- [ ] Show model capabilities (vision, function calling, etc)
- [ ] Compare model specs side-by-side
- [ ] Favorite/bookmark models

## Benefits for Users

### Before (Hardcoded)
```bash
./gym-bench.sh models
# Shows 6 hardcoded free models (some don't exist)
# Shows 6 hardcoded paid models
# No descriptions, no pricing
```

### After (Dynamic)
```bash
./gym-bench.sh models
# Shows 35+ real free models
# Shows top 20 popular models
# Real pricing and descriptions
# Always up-to-date
```

## Try It Now!

```bash
# See what's available
./gym-bench.sh models

# Test a free model
./gym-bench.sh run -m google/gemini-2.0-flash-exp:free -c anatomy

# Compare free models
./gym-bench.sh compare -m "google/gemini-2.0-flash-exp:free,nvidia/nemotron-nano-9b-v2:free"
```

---

**This feature makes the benchmark future-proof and always shows the latest available models!** 🚀

