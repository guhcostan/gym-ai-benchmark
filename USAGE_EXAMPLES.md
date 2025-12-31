# Usage Examples

## Example 1: Test a Single Free Model

```bash
./gym-bench.sh run -m meta-llama/llama-3-8b-instruct:free
```

**Expected Output:**
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

Results saved to: results/meta-llama_llama-3-8b-instruct_free_2024-12-31T00-00-00-000Z.json

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

## Example 2: Test Specific Category

```bash
./gym-bench.sh run -m google/gemini-flash-1.5:free -c anatomy
```

**Expected Output:**
```
💪 Gym AI Benchmark

📊 Starting benchmark...
Model: google/gemini-flash-1.5:free
Questions: 12
Category: anatomy

[1/12] ✓ gym-001
[2/12] ✓ gym-002
...
[12/12] ✓ gym-012

✅ Benchmark completed!

Results saved to: results/google_gemini-flash-1_5_free_2024-12-31T00-00-00-000Z.json

Summary:
  Accuracy: 91.67%
  Correct: 11/12
  Total Time: 8.45s
  Avg Time: 0.70s per question
```

## Example 3: Compare Multiple Models

```bash
./gym-bench.sh compare -m "google/gemini-flash-1.5:free,mistralai/mistral-7b-instruct:free,meta-llama/llama-3-8b-instruct:free"
```

**Expected Output:**
```
💪 Gym AI Benchmark

📊 Comparing models...
Models: google/gemini-flash-1.5:free, mistralai/mistral-7b-instruct:free, meta-llama/llama-3-8b-instruct:free
Questions: 68

🔄 Testing google/gemini-flash-1.5:free...
[68/68] completed
✅ google/gemini-flash-1.5:free: 82.35%

🔄 Testing mistralai/mistral-7b-instruct:free...
[68/68] completed
✅ mistralai/mistral-7b-instruct:free: 76.47%

🔄 Testing meta-llama/llama-3-8b-instruct:free...
[68/68] completed
✅ meta-llama/llama-3-8b-instruct:free: 75.00%


📈 Comparison Results:
====================================================================================================
Model                                          Accuracy       Avg Time    Questions
----------------------------------------------------------------------------------------------------
🥇 google/gemini-flash-1.5:free                  82.35%          0.65s              68
🥈 mistralai/mistral-7b-instruct:free            76.47%          0.58s              68
🥉 meta-llama/llama-3-8b-instruct:free           75.00%          0.67s              68
====================================================================================================

💾 Comparison saved to: results/comparison_2024-12-31T00-00-00-000Z.json
```

## Example 4: View Saved Results

```bash
# List all results
./gym-bench.sh report -l
```

**Expected Output:**
```
📁 Available Results:

  • google_gemini-flash-1_5_free_2024-12-31T00-00-00-000Z.json
  • meta-llama_llama-3-8b-instruct_free_2024-12-31T00-00-00-000Z.json
  • mistralai_mistral-7b-instruct_free_2024-12-31T00-00-00-000Z.json
  • comparison_2024-12-31T00-00-00-000Z.json
```

```bash
# View specific result
./gym-bench.sh report -f google_gemini-flash-1_5_free_2024-12-31T00-00-00-000Z.json
```

## Example 5: List Available Models

```bash
./gym-bench.sh models
```

**Expected Output:**
```
💪 Gym AI Benchmark

🆓 Free Models (no credits required):

  • meta-llama/llama-3-8b-instruct:free
  • google/gemini-flash-1.5:free
  • mistralai/mistral-7b-instruct:free
  • nousresearch/nous-capybara-7b:free
  • openchat/openchat-7b:free
  • gryphe/mythomist-7b:free

💳 Popular Paid Models:

  • openai/gpt-4
  • openai/gpt-4-turbo
  • anthropic/claude-3-opus
  • anthropic/claude-3-sonnet
  • google/gemini-pro
  • meta-llama/llama-3-70b
```

## Example 6: Web Dashboard

```bash
npm run dev:web
```

**Expected Output:**
```
> @gym-bench/web@1.0.0 dev
> next dev --port 3001

   ▲ Next.js 15.5.9
   - Local:        http://localhost:3001

 ✓ Starting...
 ✓ Ready in 2.3s
```

Then open `http://localhost:3001` in your browser to access:
- **Home**: Overview and quick start
- **Run Test**: Generate CLI commands for benchmarking
- **Results**: View all saved benchmark results
- **Questions**: Browse the complete dataset

## Pro Tips

1. **Save Time**: Test with a single category first (`-c anatomy`) before running the full benchmark

2. **Free Models**: Start with free models to test the system before adding OpenRouter credits

3. **Comparisons**: Compare 2-3 models at a time for faster results

4. **Results**: Results are automatically saved in `results/` folder as JSON files

5. **Categories**: Available categories:
   - `anatomy` - Anatomy & Physiology (12 questions)
   - `technique` - Exercise Technique (12 questions)
   - `programming` - Training Programming (12 questions)
   - `nutrition` - Sports Nutrition (12 questions)
   - `injury` - Injury Prevention (10 questions)
   - `biomechanics` - Biomechanics (10 questions)

## Troubleshooting

**Error: OPENROUTER_API_KEY not found**
```bash
# Make sure .env file exists and contains your API key
cat .env
```

**Error: Module not found**
```bash
# Rebuild the project
npm run build
```

**CLI not working**
```bash
# Ensure gym-bench.sh is executable
chmod +x gym-bench.sh

# Or use direct node command
node packages/cli/dist/index.js models
```

