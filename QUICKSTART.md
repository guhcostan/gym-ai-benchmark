# 🚀 Quick Start Guide

## Setup (One-time)

```bash
# 1. Install dependencies
npm install

# 2. Build all packages
npm run build

# 3. Your API key is already configured in .env
# OPENROUTER_API_KEY=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
```

## Run Your First Benchmark

### Using CLI

```bash
# Test with a free model (no credits needed)
./gym-bench.sh run -m meta-llama/llama-3-8b-instruct:free

# Test specific category
./gym-bench.sh run -m google/gemini-flash-1.5:free -c anatomy

# Compare multiple free models
./gym-bench.sh compare -m "google/gemini-flash-1.5:free,mistralai/mistral-7b-instruct:free"

# List all available free models
./gym-bench.sh models

# View saved results
./gym-bench.sh report -l
```

### Using Web Dashboard

```bash
# Start the web interface
npm run dev:web

# Open http://localhost:3001 in your browser
```

## Example Output

```
💪 Gym AI Benchmark

📊 Starting benchmark...
Model: meta-llama/llama-3-8b-instruct:free
Questions: 68
Category: all

[1/68] ✓ gym-001
[2/68] ✓ gym-002
[3/68] ✗ gym-003
...
[68/68] ✓ gym-068

✅ Benchmark completed!

Results saved to: results/meta-llama_llama-3-8b-instruct_free_2024-...json

Summary:
  Accuracy: 75.00%
  Correct: 51/68
  Total Time: 45.23s
  Avg Time: 0.67s per question

Accuracy by Category:
  anatomy        : 83.33%
  technique      : 75.00%
  programming    : 66.67%
  nutrition      : 83.33%
  injury         : 70.00%
  biomechanics   : 70.00%

Accuracy by Difficulty:
  easy           : 85.71%
  medium         : 71.43%
  hard           : 60.00%
```

## Available Free Models

Test without credits:
- `meta-llama/llama-3-8b-instruct:free`
- `google/gemini-flash-1.5:free`
- `mistralai/mistral-7b-instruct:free`
- `nousresearch/nous-capybara-7b:free`
- `openchat/openchat-7b:free`
- `gryphe/mythomist-7b:free`

## What's Included

- ✅ **68 Questions** across 6 categories
- ✅ **CLI Tool** with multiple commands
- ✅ **Web Dashboard** for visualization
- ✅ **OpenRouter Integration** (one API key for all models)
- ✅ **Detailed Metrics** and comparisons

## Need Help?

- See full documentation in [README.md](README.md)
- View contributing guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)
- Report issues on GitHub

Happy benchmarking! 💪

