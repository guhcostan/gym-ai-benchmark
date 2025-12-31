import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { BenchmarkEvaluator, Category, BenchmarkResult } from "@gym-bench/core";
import type { ModelConfig } from "@gym-bench/core";
import { loadQuestions, saveResult } from "../utils/loader";
import * as dotenv from "dotenv";

dotenv.config();

export function createCompareCommand(): Command {
  const command = new Command("compare");
  
  command
    .description("Compare multiple models")
    .requiredOption("-m, --models <models>", "Comma-separated model names")
    .option("-c, --category <category>", "Specific category to test")
    .option("-p, --provider <provider>", "Provider (default: openrouter)", "openrouter")
    .action(async (options) => {
      const models = options.models.split(",").map((m: string) => m.trim());
      const category = options.category as Category | undefined;
      
      const spinner = ora("Loading questions...").start();
      const questions = loadQuestions(category);
      spinner.succeed(`Loaded ${questions.length} questions`);
      
      console.log(chalk.cyan("\n📊 Comparing models..."));
      console.log(chalk.gray(`Models: ${models.join(", ")}`));
      console.log(chalk.gray(`Questions: ${questions.length}\n`));
      
      const results: BenchmarkResult[] = [];
      
      for (const model of models) {
        console.log(chalk.blue(`\n🔄 Testing ${model}...`));
        
        try {
          const modelConfig: ModelConfig = {
            provider: options.provider,
            modelName: model,
            temperature: 0,
          };
          
          const evaluator = new BenchmarkEvaluator(modelConfig);
          const result = await evaluator.evaluate(questions);
          results.push(result);
          
          console.log(chalk.green(`✅ ${model}: ${result.accuracy.toFixed(2)}%`));
          
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const filename = `${model.replace(/\//g, "_")}_${timestamp}.json`;
          saveResult(result, filename);
          
        } catch (error: any) {
          console.error(chalk.red(`❌ ${model} failed: ${error.message}`));
        }
      }
      
      console.log(chalk.cyan("\n\n📈 Comparison Results:"));
      console.log("=".repeat(100));
      console.log(
        "Model".padEnd(50) +
        "Accuracy".padStart(12) +
        "Avg Time".padStart(15) +
        "Questions".padStart(12)
      );
      console.log("-".repeat(100));
      
      const sorted = [...results].sort((a, b) => b.accuracy - a.accuracy);
      
      for (let i = 0; i < sorted.length; i++) {
        const result = sorted[i];
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
        const accuracyColor = 
          result.accuracy >= 80 ? chalk.green :
          result.accuracy >= 60 ? chalk.yellow :
          chalk.red;
        
        console.log(
          medal + " " +
          result.modelName.padEnd(47) +
          accuracyColor(result.accuracy.toFixed(2) + "%").padStart(12) +
          `${(result.averageTimeMs / 1000).toFixed(2)}s`.padStart(15) +
          result.totalQuestions.toString().padStart(12)
        );
      }
      
      console.log("=".repeat(100));
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const comparisonFilename = `comparison_${timestamp}.json`;
      saveResult({ models, results }, comparisonFilename);
      
      console.log(chalk.cyan(`\n💾 Comparison saved to: results/${comparisonFilename}`));
    });
  
  return command;
}

