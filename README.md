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

- ✅ **Single API Key**: Access 100+ models via OpenRouter
- ✅ **Dynamic Model Discovery**: Real-time fetching of 350+ available models from OpenRouter API
- ✅ **35+ Free Models**: Test with no-cost models (Gemini Flash, Llama 4, GPT-4.1 Nano, and more)
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
./gym-bench.sh models
./gym-bench.sh models --free  # Show 35+ free models

# Test with a free model
./gym-bench.sh run -m google/gemini-2.0-flash-exp:free

# Test specific category
./gym-bench.sh run -m google/gemini-flash-1.5:free -c anatomy

# Compare multiple models
./gym-bench.sh compare -m "google/gemini-flash-1.5:free,mistralai/mistral-7b-instruct:free"

# List available free models
./gym-bench.sh models

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
gym-bench models
```

## 🆓 Free Models (No Credits Required)

**NEW**: The benchmark now fetches available models dynamically! Run `./gym-bench.sh models --free` to see all 35+ free models.

Popular free models currently available:

- `google/gemini-2.0-flash-exp:free` ⭐ NEW!
- `google/gemini-2.5-flash-lite:free` ⭐ NEW!
- `meta-llama/llama-4-maverick` ⭐ NEW!
- `openai/gpt-4.1-nano` ⭐ NEW!
- `openai/gpt-4.1-mini` ⭐ NEW!
- `nvidia/nemotron-nano-9b-v2:free`
- `mistralai/devstral-2512:free`
- And 28+ more! Run `./gym-bench.sh models --free` to see all

See [DYNAMIC_MODELS.md](DYNAMIC_MODELS.md) for details on dynamic model discovery.

## 💳 Popular Paid Models

When you have OpenRouter credits:

- `openai/gpt-4`
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus`
- `anthropic/claude-3-sonnet`
- `anthropic/claude-3-haiku`
- `google/gemini-pro`
- `meta-llama/llama-3-70b`

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

