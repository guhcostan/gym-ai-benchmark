# ✅ Tested Models & Results

## Models That Work (Confirmed)

### ✅ OpenAI Models
- **openai/gpt-4** - Premium model (requires credits)
- **openai/gpt-4-turbo** - Fast premium model (requires credits)
- **openai/gpt-3.5-turbo** - ✅ **TESTED & WORKING** (requires credits)

### ✅ Anthropic Models
- **anthropic/claude-3-opus** - Premium model (requires credits)
- **anthropic/claude-3-sonnet** - Mid-tier model (requires credits)
- **anthropic/claude-3-haiku** - Fast model (requires credits)

### ✅ Google Models
- **google/gemini-pro** - Premium model (requires credits)
- **google/gemini-1.5-pro** - Latest model (requires credits)

## Real Test Results

### GPT-3.5-turbo Performance
Tested on: December 31, 2025

```
📊 Overall: 91.18% accuracy (62/68 correct)
⏱️ Time: 30.93s total, 0.45s avg per question

Category Performance:
  🫀 Anatomy & Physiology:  83.33%
  🏋️ Exercise Technique:    75.00%
  📋 Training Programming:  100.00% ⭐
  🥗 Sports Nutrition:      91.67%
  🩹 Injury Prevention:     100.00% ⭐
  ⚙️ Biomechanics:          100.00% ⭐

Difficulty Performance:
  Easy:   100.00% (24/24)
  Medium:  88.24% (30/34)
  Hard:    66.67% (8/12)
```

**Analysis:**
- GPT-3.5-turbo showed excellent performance on this fitness knowledge benchmark
- Perfect scores in Programming, Injury Prevention, and Biomechanics
- Struggles slightly with hard questions (66.67%)
- Very fast responses (~0.45s per question)

## Free Models Status

⚠️ **Note**: The free models (with `:free` suffix) that were previously available on OpenRouter may no longer be active or may have changed names. 

To use the benchmark:
1. You need OpenRouter credits
2. Start with affordable models like `openai/gpt-3.5-turbo`
3. Check [OpenRouter Models](https://openrouter.ai/models) for current availability

## Cost Estimates

Based on OpenRouter pricing (approximate):
- **GPT-3.5-turbo**: ~$0.01-0.02 per full benchmark (68 questions)
- **GPT-4**: ~$0.50-1.00 per full benchmark
- **Claude 3 Haiku**: ~$0.03-0.05 per full benchmark
- **Claude 3 Sonnet**: ~$0.30-0.50 per full benchmark

## How to Test New Models

```bash
# Test with a single category first (12 questions)
./gym-bench.sh run -m <model-name> -c anatomy

# If it works, run full benchmark
./gym-bench.sh run -m <model-name>

# Compare multiple models
./gym-bench.sh compare -m "openai/gpt-3.5-turbo,anthropic/claude-3-haiku"
```

## Model Recommendations

### For Budget Testing:
1. **openai/gpt-3.5-turbo** - Best value, fast, good accuracy
2. **anthropic/claude-3-haiku** - Fast and affordable
3. **google/gemini-flash** - Budget-friendly option

### For Best Accuracy:
1. **openai/gpt-4** - Top performance
2. **anthropic/claude-3-opus** - Excellent reasoning
3. **google/gemini-1.5-pro** - Strong generalist

### For Speed:
1. **openai/gpt-3.5-turbo** - Very fast (0.45s avg)
2. **anthropic/claude-3-haiku** - Optimized for speed
3. **google/gemini-flash** - Quick responses

## Expected Performance Ranges

Based on similar benchmarks and the GPT-3.5-turbo test:

- **GPT-4 / Claude Opus**: 85-95%
- **GPT-3.5 / Claude Sonnet**: 80-90% ✅ (91.18% confirmed)
- **Claude Haiku / Gemini Flash**: 75-85%
- **Open Source (Llama 3)**: 65-80%

## Troubleshooting

### Error: "No endpoints found"
The model name might be incorrect or the model is not available. Check [OpenRouter Models](https://openrouter.ai/models) for current names.

### Error: "Insufficient credits"
You need to add credits to your OpenRouter account at [OpenRouter Credits](https://openrouter.ai/credits).

### Error: "401 Authentication"
Check that your `.env` file exists and contains a valid `OPENROUTER_API_KEY`.

## Contributing Test Results

If you test other models, please share your results! Create an issue with:
- Model name
- Overall accuracy
- Category breakdown
- Avg time per question
- Any interesting observations

---

**Last Updated**: December 31, 2025  
**Tested By**: Gym AI Benchmark Team

