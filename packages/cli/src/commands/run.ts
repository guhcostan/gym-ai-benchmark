import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { BenchmarkEvaluator, Category, hasResultForModel, getResultForModel } from "@gym-bench/core";
import type { ModelConfig } from "@gym-bench/core";
import { loadQuestions, saveResult } from "../utils/loader";
import * as dotenv from "dotenv";

dotenv.config();

export function createRunCommand(): Command {
  const command = new Command("run");
  
  command
    .description("Run benchmark on a specific model")
    .requiredOption("-m, --model <model>", "Model name (e.g., meta-llama/llama-3-8b-instruct:free)")
    .option("-c, --category <category>", "Specific category to test")
    .option("-p, --provider <provider>", "Provider (default: openrouter)", "openrouter")
    .option("-t, --temperature <temp>", "Temperature (default: 0)", "0")
    .option("-f, --force", "Force re-run even if results exist")
    .action(async (options) => {
      // Check if results already exist
      if (!options.force && !options.category) {
        const existingResult = getResultForModel(options.model);
        
        if (existingResult) {
          console.log(chalk.yellow("\n⚠️  Results already exist for this model!"));
          console.log(chalk.gray(`   File: ${existingResult.filename}`));
          console.log(chalk.gray(`   Accuracy: ${existingResult.accuracy.toFixed(2)}%`));
          console.log(chalk.gray(`   Date: ${new Date(existingResult.timestamp).toLocaleString()}`));
          console.log(chalk.cyan("\n💡 Use --force to re-run the benchmark"));
          console.log(chalk.cyan("   Or use 'gym-bench report -f <filename>' to view results\n"));
          return;
        }
      }
      const spinner = ora("Loading questions...").start();
      
      try {
        const category = options.category as Category | undefined;
        const questions = loadQuestions(category);
        
        spinner.succeed(`Loaded ${questions.length} questions`);
        
        const modelConfig: ModelConfig = {
          provider: options.provider,
          modelName: options.model,
          temperature: parseFloat(options.temperature),
        };
        
        console.log(chalk.cyan("\n📊 Starting benchmark..."));
        console.log(chalk.gray(`Model: ${options.model}`));
        console.log(chalk.gray(`Questions: ${questions.length}`));
        console.log(chalk.gray(`Category: ${category || "all"}\n`));
        
        const evaluator = new BenchmarkEvaluator(modelConfig);
        
        const result = await evaluator.evaluate(questions);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `${options.model.replace(/\//g, "_")}_${timestamp}.json`;
        
        saveResult(result, filename);
        
        console.log(chalk.green("\n✅ Benchmark completed!"));
        console.log(chalk.cyan(`\nResults saved to: results/${filename}`));
        console.log(chalk.yellow("\nSummary:"));
        console.log(`  Accuracy: ${chalk.bold(result.accuracy.toFixed(2))}%`);
        console.log(`  Correct: ${result.correctAnswers}/${result.totalQuestions}`);
        console.log(`  Total Time: ${(result.totalTimeMs / 1000).toFixed(2)}s`);
        console.log(`  Avg Time: ${(result.averageTimeMs / 1000).toFixed(2)}s per question`);
        
        console.log(chalk.yellow("\nAccuracy by Category:"));
        for (const [cat, acc] of Object.entries(result.accuracyByCategory)) {
          const color = acc >= 80 ? chalk.green : acc >= 60 ? chalk.yellow : chalk.red;
          console.log(`  ${cat.padEnd(15)}: ${color(acc.toFixed(2) + "%")}`);
        }
        
        console.log(chalk.yellow("\nAccuracy by Difficulty:"));
        for (const [diff, acc] of Object.entries(result.accuracyByDifficulty)) {
          const color = acc >= 80 ? chalk.green : acc >= 60 ? chalk.yellow : chalk.red;
          console.log(`  ${diff.padEnd(15)}: ${color(acc.toFixed(2) + "%")}`);
        }
        
      } catch (error: any) {
        spinner.fail("Error running benchmark");
        console.error(chalk.red("\n❌ Error:"), error.message);
        process.exit(1);
      }
    });
  
  return command;
}

