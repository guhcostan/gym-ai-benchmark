# 💪 Gym AI Benchmark

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

AI Benchmark for Physical Education and Gym Training Knowledge - Evaluate LLMs on their understanding of exercise science, training programming, nutrition, and biomechanics.

**🔗 Repository**: [github.com/guhcostan/gym-ai-benchmark](https://github.com/guhcostan/gym-ai-benchmark)

## 🎯 Overview

This benchmark evaluates AI models across **68 multiple-choice questions** in 6 key categories:

- 🫀 **Anatomy & Physiology** (12 questions)
- 🏋️ **Exercise Technique** (12 questions)
- 📋 **Training Programming** (12 questions)
- 🥗 **Sports Nutrition** (12 questions)
- 🩹 **Injury Prevention** (10 questions)
- ⚙️ **Biomechanics** (10 questions)

## ✨ Features

- ✅ **Single API Key**: Access 350+ models via OpenRouter
- ✅ **Dynamic Model Discovery**: Real-time fetching with smart prioritization (no hardcoded lists!)
- ✅ **35+ Free Models**: Test with no-cost models (auto-discovered from API)
- ✅ **Smart Recommendations**: Automatic tier classification (free/budget/premium) based on pricing
- ✅ **CLI + Web Dashboard**: Command-line tool and beautiful web interface
- ✅ **Detailed Metrics**: Accuracy by category, difficulty, response time
- ✅ **Model Comparison**: Benchmark multiple models side-by-side
- ✅ **TypeScript**: Fully typed with strict TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gym-ai-benchmark

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# Build all packages
npm run build
```

### Run Benchmark (CLI)

```bash
# Discover available models (fetches 350+ models in real-time)
./gym-bench.sh models --free  # Show 35+ free models
./gym-bench.sh models --popular  # Show popular models
./gym-bench.sh models --all  # Show all 350+ models

# Get smart recommendations (dynamic, no hardcoded lists!)
./gym-bench.sh recommend --tier free  # Top 20 free models
./gym-bench.sh recommend --tier budget --limit 30  # Top 30 budget models
./gym-bench.sh recommend --untested  # Only models you haven't tested yet

# Test with a free model
./gym-bench.sh run -m nvidia/nemotron-3-nano-30b-a3b:free

# Test specific category
./gym-bench.sh run -m google/gemini-2.0-flash-exp:free -c anatomy

# Compare multiple models
./gym-bench.sh compare -m "nvidia/nemotron-3-nano-30b-a3b:free,mistralai/devstral-2512:free"

# View results
./gym-bench.sh report -l
./gym-bench.sh report -f <filename>
```

**Alternative**: Use the npm script

```bash
npm run gym-bench -- run -m meta-llama/llama-3-8b-instruct:free
```

### View Results Dashboard

The web dashboard is a static site that displays benchmark results. It does NOT run benchmarks - use the CLI for that.

```bash
# Start the web dashboard
npm run dev:web

# Open http://localhost:3001 in your browser
```

**Note**: The dashboard displays static results from `data/benchmark-results/`. To add new models:
1. Run benchmark with CLI
2. Add formatted JSON to `data/benchmark-results/`
3. Rebuild web dashboard

See [WEB_DASHBOARD.md](WEB_DASHBOARD.md) for details.

## 📊 CLI Commands

### `run` - Run benchmark on a model

```bash
gym-bench run [options]

Options:
  -m, --model <model>       Model name (required)
  -c, --category <category> Specific category (optional)
  -p, --provider <provider> Provider (default: openrouter)
  -t, --temperature <temp>  Temperature (default: 0)
```

**Examples:**

```bash
# Free model
gym-bench run -m meta-llama/llama-3-8b-instruct:free

# Paid model (requires credits)
gym-bench run -m openai/gpt-4

# Specific category
gym-bench run -m google/gemini-flash-1.5:free -c technique
```

### `compare` - Compare multiple models

```bash
gym-bench compare [options]

Options:
  -m, --models <models>     Comma-separated model names (required)
  -c, --category <category> Specific category (optional)
```

**Example:**

```bash
gym-bench compare -m "google/gemini-flash-1.5:free,mistralai/mistral-7b-instruct:free,meta-llama/llama-3-8b-instruct:free"
```

### `report` - View saved results

```bash
gym-bench report [options]

Options:
  -f, --file <filename>  Specific result file
  -l, --list            List all available results
```

### `models` - List available models

```bash
gym-bench models [options]

Options:
  --free     Show only free models (35+ available)
  --popular  Show popular models (based on context length & provider)
  --all      Show all 350+ available models
```

**Examples:**

```bash
# List all 35+ free models
gym-bench models --free

# List popular models
gym-bench models --popular

# List ALL available models
gym-bench models --all
```

### `recommend` - Get smart recommendations (NEW! 🎉)

The `recommend` command dynamically analyzes all available models from OpenRouter and suggests the best ones based on:
- **Pricing** (free/budget/premium tiers)
- **Provider reputation** (OpenAI, Anthropic, Google, Meta, etc.)
- **Context length** (longer = better for complex questions)
- **Testing status** (which models you haven't tested yet)

```bash
gym-bench recommend [options]

Options:
  -t, --tier <tier>      Filter by tier: free, budget, premium
  -u, --untested         Show only models you haven't tested yet
  -l, --limit <number>   Limit number of results (default: 20)
```

**Examples:**

```bash
# Get top 20 recommended models (all tiers)
gym-bench recommend

# Get top 10 free models
gym-bench recommend --tier free --limit 10

# Get only untested budget models
gym-bench recommend --tier budget --untested

# Get top 50 premium models
gym-bench recommend --tier premium --limit 50
```

## 🆓 Free Models (No Credits Required)

**🎉 NEW**: The benchmark now fetches models dynamically from OpenRouter API! No more hardcoded lists that go stale.

Run this to see all 35+ free models currently available:

```bash
./gym-bench.sh models --free
# or get smart recommendations
./gym-bench.sh recommend --tier free
```

Example free models (as of Dec 31, 2025):

- `nvidia/nemotron-3-nano-30b-a3b:free` - 256K context, NVIDIA
- `mistralai/devstral-2512:free` - 262K context, Mistral
- `nvidia/nemotron-nano-9b-v2:free` - 128K context, NVIDIA
- `openai/gpt-oss-120b:free` - 131K context, OpenAI
- `google/gemma-3n-e2b-it:free` - Google
- `mistralai/mistral-small-3.1-24b-instruct:free` - 128K context, Mistral
- And 29+ more! Run `./gym-bench.sh recommend --tier free` to see all

**Note**: The list changes as OpenRouter adds/removes models. Always check with `models --free` or `recommend --tier free`.

## 💳 Popular Paid Models

When you have OpenRouter credits, use the `recommend` command to find budget and premium models:

```bash
# Get top budget models (< $0.03 per benchmark)
./gym-bench.sh recommend --tier budget

# Get top premium models
./gym-bench.sh recommend --tier premium
```

The system automatically categorizes models based on pricing and prioritizes major providers like OpenAI, Anthropic, Google, Meta, and Mistral.

## 📁 Project Structure

```
gym-ai-benchmark/
├── packages/
│   ├── core/           # Core evaluation engine
│   ├── cli/            # Command-line interface
│   └── web/            # Next.js web dashboard
├── data/
│   ├── questions/      # Question datasets by category
│   └── schema.json     # JSON schema for validation
├── results/            # Benchmark results (JSON)
├── .env               # Environment variables
└── README.md
```

## 🧪 Example Output

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

✅ Benchmark completed!

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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Required: OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Optional: Direct API keys (if not using OpenRouter)
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_API_KEY=...

# Optional: Local Ollama
# OLLAMA_BASE_URL=http://localhost:11434
```

### OpenRouter Setup

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Generate an API key
3. Add credits (or use free models)
4. Set `OPENROUTER_API_KEY` in `.env`

## 📈 Metrics Explained

- **Accuracy**: Percentage of correct answers
- **Accuracy by Category**: Performance breakdown by topic
- **Accuracy by Difficulty**: Easy / Medium / Hard breakdown
- **Average Time**: Mean response time per question
- **Total Time**: Complete benchmark duration

## 🤝 Contributing

### Adding Questions

1. Edit files in `data/questions/`
2. Follow the schema in `data/schema.json`
3. Ensure questions are:
   - Accurate and evidence-based
   - Clear and unambiguous
   - Properly categorized and leveled

**Question Format:**

```json
{
  "id": "gym-XXX",
  "question": "Your question here?",
  "choices": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 1,
  "category": "anatomy|technique|programming|nutrition|injury|biomechanics",
  "difficulty": "easy|medium|hard",
  "explanation": "Detailed explanation of the correct answer."
}
```

## 📝 License

MIT License - feel free to use for research and evaluation!

## 🙏 Acknowledgments

- Inspired by academic benchmarks like MMLU, MedQA, and others
- Built with [LangChain](https://www.langchain.com/) for LLM integration
- Powered by [OpenRouter](https://openrouter.ai) for unified model access

## 📮 Contact

For questions, suggestions, or issues, please open an issue on GitHub.

---

Made with 💪 for the fitness and AI communities

