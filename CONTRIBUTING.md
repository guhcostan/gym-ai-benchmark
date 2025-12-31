# Contributing to Gym AI Benchmark

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Adding Questions

The most valuable contribution is adding high-quality questions to the dataset.

**Requirements for Questions:**

1. **Evidence-based**: Questions should be based on scientific literature, established guidelines (ACSM, NSCA), or widely accepted practice
2. **Clear and unambiguous**: Only one correct answer should be clearly correct
3. **Appropriate difficulty**: Easy questions for basics, hard for nuanced/advanced topics
4. **Good explanations**: Explain why the answer is correct with references when possible

**Question Format:**

```json
{
  "id": "gym-XXX",
  "question": "Clear, specific question?",
  "choices": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
  ],
  "answer": 1,
  "category": "anatomy|technique|programming|nutrition|injury|biomechanics",
  "difficulty": "easy|medium|hard",
  "explanation": "Detailed explanation referencing why this answer is correct."
}
```

**Guidelines:**

- Use sequential IDs (gym-069, gym-070, etc.)
- All 4 choices should be plausible
- Avoid "trick" questions
- Be culturally neutral and inclusive
- Use metric units (kg, cm) as primary with imperial in parentheses if needed

### Code Contributions

**Setting up development environment:**

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

**Code Style:**

- Use TypeScript strict mode
- Follow existing code patterns
- Add tests for new functionality
- Update documentation for API changes

### Testing

Before submitting:

```bash
# Run all tests
npm test

# Build everything
npm run build

# Test CLI locally
cd packages/cli
npm run build
node dist/index.js run -m meta-llama/llama-3-8b-instruct:free
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linter
5. Commit with clear messages (`git commit -m 'Add 10 new anatomy questions'`)
6. Push to your fork
7. Open a Pull Request with:
   - Clear description of changes
   - Motivation/reasoning
   - Any breaking changes
   - Screenshots if UI changes

## Question Review Criteria

Questions are reviewed for:

- ✅ Scientific accuracy
- ✅ Clarity and readability
- ✅ Appropriate difficulty level
- ✅ Quality of explanation
- ✅ Diversity across categories
- ✅ No duplication with existing questions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the best outcome for the project
- Welcome newcomers

## Questions?

Open an issue with the `question` label for any doubts or suggestions.

Thank you for contributing! 💪

