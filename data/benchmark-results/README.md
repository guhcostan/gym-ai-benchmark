# Benchmark Results

This directory contains static benchmark results for various AI models tested on the Gym AI Benchmark.

## Format

Each JSON file should follow this structure:

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
  "notes": "Optional notes about the model's performance"
}
```

## Adding New Results

1. Run a benchmark using the CLI:
   ```bash
   ./gym-bench.sh run -m <model-name>
   ```

2. Take the result from `results/` directory

3. Create a formatted JSON file here with:
   - Clear display name
   - Provider information
   - Performance notes
   - Cost estimate

4. The web dashboard will automatically display the new result

## Current Results

- `gpt-3.5-turbo.json` - OpenAI GPT-3.5 Turbo (91.18% accuracy)

## Contributing

Want to add more model results? Run the benchmark and submit a PR with:
- The formatted JSON file
- Screenshots of the results (optional)
- Any observations about the model's performance

