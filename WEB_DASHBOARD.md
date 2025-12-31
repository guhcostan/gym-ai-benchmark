# 🌐 Web Dashboard

## Overview

The web dashboard is a **static visualization tool** that displays benchmark results. It does NOT run benchmarks - all testing is done via the CLI, and results are stored as static JSON files.

## Architecture

```
┌─────────────────┐
│   CLI Tool      │  ← Runs benchmarks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Static JSON    │  ← Stores results
│  Files          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Web Dashboard  │  ← Displays results
│  (Read Only)    │
└─────────────────┘
```

## How It Works

### 1. Run Benchmarks (CLI)

```bash
# Test a model
./gym-bench.sh run -m openai/gpt-3.5-turbo

# Results saved to: results/openai_gpt-3.5-turbo_<timestamp>.json
```

### 2. Format Results (Manual)

Take the CLI output and create a formatted file in `data/benchmark-results/`:

```json
{
  "modelName": "openai/gpt-3.5-turbo",
  "displayName": "GPT-3.5 Turbo",
  "provider": "OpenAI",
  "timestamp": "2025-12-31T12:27:12.446Z",
  "totalQuestions": 68,
  "correctAnswers": 62,
  "accuracy": 91.18,
  "totalTimeMs": 30930,
  "averageTimeMs": 454.85,
  "accuracyByCategory": {
    "anatomy": 83.33,
    "technique": 75.00,
    "programming": 100.00,
    "nutrition": 91.67,
    "injury": 100.00,
    "biomechanics": 100.00
  },
  "accuracyByDifficulty": {
    "easy": 100.00,
    "medium": 88.24,
    "hard": 66.67
  },
  "cost": "$0.015",
  "notes": "Excellent performance on programming, injury prevention, and biomechanics."
}
```

### 3. View Results (Web)

```bash
npm run dev:web
# Open http://localhost:3001
```

The dashboard automatically reads all JSON files from `data/benchmark-results/` and displays them.

## Pages

### Home (`/`)
- Overview of the benchmark
- Quick stats
- Link to view results and questions

### Results (`/results`)
- **Leaderboard table** - Ranking of all models by accuracy
- **Detailed cards** - Performance breakdown per model
  - Accuracy by category (bar charts)
  - Accuracy by difficulty (bar charts)
  - Time and cost metrics
  - Model notes

### Questions (`/questions`)
- Browse all 68 questions
- View by category
- See correct answers and explanations

## Features

✅ **Static & Fast** - No server-side computation  
✅ **Automatic Updates** - Add JSON files, rebuild, deploy  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Comparison View** - Side-by-side model comparison  
✅ **Beautiful UI** - Modern design with TailwindCSS  

## Adding New Model Results

### Method 1: From CLI Output

1. Run benchmark:
   ```bash
   ./gym-bench.sh run -m anthropic/claude-3-haiku
   ```

2. Copy the result from `results/` directory

3. Create formatted file:
   ```bash
   # Create data/benchmark-results/claude-3-haiku.json
   ```

4. Rebuild web:
   ```bash
   npm run build
   ```

### Method 2: Manual Entry

If you have results from another source:

1. Create JSON file following the schema
2. Add to `data/benchmark-results/`
3. Rebuild

## Deployment

The web dashboard can be deployed to any static hosting:

### Vercel (Recommended)

```bash
cd packages/web
vercel deploy
```

### Netlify

```bash
cd packages/web
netlify deploy --prod
```

### GitHub Pages

```bash
npm run build
# Deploy packages/web/.next to GitHub Pages
```

## File Structure

```
data/
└── benchmark-results/     # Static results
    ├── gpt-3.5-turbo.json
    ├── gpt-4.json         # (add more)
    ├── claude-3-opus.json # (add more)
    └── README.md

packages/web/
├── app/
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Layout with nav
│   ├── results/
│   │   └── page.tsx       # Results & comparison
│   └── questions/
│       └── page.tsx       # Browse questions
└── public/                # Static assets
```

## Why Static?

1. **Security** - No API keys exposed in frontend
2. **Performance** - Pre-rendered, instant load
3. **Cost** - Free static hosting
4. **Simplicity** - No backend needed
5. **Reliability** - Can't break from API failures

## Contributing Results

Want to add your model to the leaderboard?

1. **Run the benchmark** using our CLI
2. **Format the results** as JSON
3. **Submit a PR** with:
   - The JSON file in `data/benchmark-results/`
   - Screenshots (optional)
   - Brief description of model

We'll review and merge if the results look valid!

## Local Development

```bash
# Start development server
npm run dev:web

# Build for production
cd packages/web && npm run build

# Preview production build
cd packages/web && npm start
```

## Environment Variables

None needed! The web dashboard is fully static and reads from local JSON files.

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Deployment**: Static export

---

**Note**: The web dashboard does NOT require the OpenRouter API key. All benchmarking is done via CLI, and the web only displays pre-computed results.

