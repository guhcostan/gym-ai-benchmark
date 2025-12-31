# 📚 Commands Reference

## Package Manager Commands

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## CLI Commands

### Basic Usage

```bash
./gym-bench.sh <command> [options]
```

### Commands

#### 1. `models` - List Available Models

```bash
./gym-bench.sh models
```

Lists all free and popular paid models available via OpenRouter.

#### 2. `run` - Run Benchmark

```bash
./gym-bench.sh run -m <model> [options]
```

**Options:**
- `-m, --model <model>` - Model name (required)
- `-c, --category <category>` - Specific category (optional)
- `-p, --provider <provider>` - Provider (default: openrouter)
- `-t, --temperature <temp>` - Temperature (default: 0)

**Examples:**
```bash
# Full benchmark
./gym-bench.sh run -m meta-llama/llama-3-8b-instruct:free

# Specific category
./gym-bench.sh run -m google/gemini-flash-1.5:free -c anatomy

# Custom temperature
./gym-bench.sh run -m openai/gpt-4 -t 0.3

# Specific provider
./gym-bench.sh run -m gpt-4 -p openai
```

#### 3. `compare` - Compare Multiple Models

```bash
./gym-bench.sh compare -m <models> [options]
```

**Options:**
- `-m, --models <models>` - Comma-separated model names (required)
- `-c, --category <category>` - Specific category (optional)
- `-p, --provider <provider>` - Provider (default: openrouter)

**Examples:**
```bash
# Compare 3 free models
./gym-bench.sh compare -m "google/gemini-flash-1.5:free,mistralai/mistral-7b-instruct:free,meta-llama/llama-3-8b-instruct:free"

# Compare on specific category
./gym-bench.sh compare -m "gpt-4,claude-3-opus" -c technique

# Compare all free models
./gym-bench.sh compare -m "meta-llama/llama-3-8b-instruct:free,google/gemini-flash-1.5:free,mistralai/mistral-7b-instruct:free,nousresearch/nous-capybara-7b:free,openchat/openchat-7b:free,gryphe/mythomist-7b:free"
```

#### 4. `report` - View Results

```bash
./gym-bench.sh report [options]
```

**Options:**
- `-f, --file <filename>` - Specific result file
- `-l, --list` - List all available results

**Examples:**
```bash
# List all results
./gym-bench.sh report -l

# View specific result
./gym-bench.sh report -f meta-llama_llama-3-8b-instruct_free_2024-12-31T00-00-00-000Z.json

# View comparison result
./gym-bench.sh report -f comparison_2024-12-31T00-00-00-000Z.json
```

## Web Dashboard Commands

```bash
# Start development server (port 3001)
npm run dev:web

# Build for production
cd packages/web && npm run build

# Start production server
cd packages/web && npm start
```

## Development Commands

### Core Package

```bash
cd packages/core

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

### CLI Package

```bash
cd packages/cli

# Build
npm run build

# Watch mode
npm run dev

# Test command directly
node dist/index.js models
```

### Web Package

```bash
cd packages/web

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Advanced Usage

### Using npm Scripts

```bash
# Run CLI via npm
npm run gym-bench -- run -m meta-llama/llama-3-8b-instruct:free

# Development mode for specific package
npm run dev:cli
npm run dev:web
```

### Direct Node Execution

```bash
# Run CLI directly with node
node packages/cli/dist/index.js models
node packages/cli/dist/index.js run -m google/gemini-flash-1.5:free
```

### Environment Variables

```bash
# Use different API key
OPENROUTER_API_KEY=your-key ./gym-bench.sh run -m gpt-4

# Use Ollama locally
OLLAMA_BASE_URL=http://localhost:11434 ./gym-bench.sh run -m llama3 -p ollama
```

## Categories

Available categories for `-c` flag:
- `anatomy` - Anatomy & Physiology
- `technique` - Exercise Technique
- `programming` - Training Programming
- `nutrition` - Sports Nutrition
- `injury` - Injury Prevention
- `biomechanics` - Biomechanics

## Free Models

Copy-paste ready for testing:

```bash
meta-llama/llama-3-8b-instruct:free
google/gemini-flash-1.5:free
mistralai/mistral-7b-instruct:free
nousresearch/nous-capybara-7b:free
openchat/openchat-7b:free
gryphe/mythomist-7b:free
```

## Popular Paid Models

Require OpenRouter credits:

```bash
openai/gpt-4
openai/gpt-4-turbo
openai/gpt-3.5-turbo
anthropic/claude-3-opus
anthropic/claude-3-sonnet
anthropic/claude-3-haiku
google/gemini-pro
google/gemini-1.5-pro
meta-llama/llama-3-70b
mistralai/mixtral-8x7b
```

## Troubleshooting Commands

```bash
# Check if CLI is built
ls -la packages/cli/dist/

# Rebuild everything
npm run clean && npm install && npm run build

# Check environment
cat .env

# Make script executable
chmod +x gym-bench.sh

# Check Node version
node --version  # Should be >= 18
```

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/test.yml`:
- Runs on push to main/dev
- Tests on Node.js 18.x and 20.x
- Runs linter, tests, and build

## File Locations

```bash
# Questions dataset
data/questions/*.json

# Results
results/*.json

# Built packages
packages/core/dist/
packages/cli/dist/
packages/web/.next/

# Environment
.env

# Logs
results/*.log
```

## Quick Tips

1. **Always build before using CLI**: `npm run build`
2. **Use free models first**: Test without spending credits
3. **Save results**: Automatically saved in `results/` folder
4. **Compare strategically**: 2-3 models at a time for speed
5. **Test categories**: Use `-c` flag to test specific areas first
6. **Check API key**: Ensure `.env` file exists and has valid key
7. **Web vs CLI**: CLI for automation, Web for exploration

---

**Need Help?**
- See [README.md](README.md) for full documentation
- See [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) for detailed examples
- See [QUICKSTART.md](QUICKSTART.md) for getting started

