import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import {
  fetchAvailableModels,
  getRecommendedModelsByTier,
  BenchmarkEvaluator,
  Category,
} from "@gym-bench/core";
import type { ModelConfig } from "@gym-bench/core";
import { loadQuestions } from "../utils/loader";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

export function createBenchmarkAllCommand(): Command {
  const command = new Command("benchmark-all");

  command
    .description("Run benchmark on all models of a specific tier in parallel")
    .option("-t, --tier <tier>", "Tier: free, budget, or premium", "free")
    .option("-l, --limit <number>", "Limit number of models to test", "10")
    .option("-c, --category <category>", "Specific category to test (optional)")
    .option("--concurrency <number>", "Number of parallel requests", "5")
    .action(async (options) => {
      const spinner = ora("Fetching available models...").start();

      try {
        // Fetch models
        const allModels = await fetchAvailableModels();
        const tier = options.tier as "free" | "budget" | "premium";
        const limit = parseInt(options.limit);
        const concurrency = parseInt(options.concurrency);

        const modelsToTest = getRecommendedModelsByTier(allModels, tier).slice(
          0,
          limit
        );

        spinner.succeed(
          `Found ${modelsToTest.length} ${tier} models to benchmark`
        );

        console.log(
          chalk.bold.cyan(
            `\n💪 Benchmarking ${modelsToTest.length} ${tier} models in parallel\n`
          )
        );

        // Load questions once
        console.log(chalk.gray("Loading questions..."));
        const questions = await loadQuestions(options.category);
        console.log(chalk.green(`✓ Loaded ${questions.length} questions\n`));

        // Create results directory
        const resultsDir = path.join(process.cwd(), "results");
        if (!fs.existsSync(resultsDir)) {
          fs.mkdirSync(resultsDir, { recursive: true });
        }

        // Run benchmarks with controlled concurrency
        const results: Array<{
          model: string;
          result: any;
          error?: string;
        }> = [];
        let completed = 0;
        let failed = 0;

        console.log(
          chalk.cyan(`Running with concurrency: ${concurrency}\n`)
        );

        // Process in batches
        for (let i = 0; i < modelsToTest.length; i += concurrency) {
          const batch = modelsToTest.slice(i, i + concurrency);

          const batchPromises = batch.map(async (model) => {
            const modelSpinner = ora(
              `[${completed + failed + 1}/${modelsToTest.length}] Testing ${model.id}...`
            ).start();

            try {
              const modelConfig: ModelConfig = {
                provider: "openrouter",
                modelName: model.id,
                temperature: 0,
              };
              
              const evaluator = new BenchmarkEvaluator(modelConfig);
              const result = await evaluator.evaluate(questions);

              // Save result
              const timestamp = new Date().toISOString().replace(/:/g, "-");
              const filename = `${model.id.replace(/\//g, "_")}_${timestamp}.json`;
              const filepath = path.join(resultsDir, filename);
              fs.writeFileSync(filepath, JSON.stringify(result, null, 2));

              modelSpinner.succeed(
                `${model.id}: ${chalk.green(`${result.accuracy.toFixed(2)}%`)} (${result.correctAnswers}/${result.totalQuestions})`
              );

              completed++;
              return { model: model.id, result, filepath };
            } catch (error: any) {
              modelSpinner.fail(
                `${model.id}: ${chalk.red("Error")} - ${error.message}`
              );
              failed++;
              return { model: model.id, result: null, error: error.message };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        }

        // Summary
        console.log(chalk.bold.cyan("\n📊 Summary:\n"));
        console.log(
          `${chalk.green("✓ Completed:")} ${completed}/${modelsToTest.length}`
        );
        console.log(
          `${chalk.red("✗ Failed:")} ${failed}/${modelsToTest.length}`
        );

        // Show top performers
        const successfulResults = results
          .filter((r) => r.result)
          .sort((a, b) => b.result.accuracy - a.result.accuracy);

        if (successfulResults.length > 0) {
          console.log(chalk.bold.cyan("\n🏆 Top Performers:\n"));

          successfulResults.slice(0, 10).forEach((r, idx) => {
            const medal =
              idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`;
            console.log(
              `${medal} ${chalk.bold(r.model)}: ${chalk.green(`${r.result.accuracy.toFixed(2)}%`)} (${r.result.correctAnswers}/${r.result.totalQuestions})`
            );
          });
        }

        console.log(
          chalk.gray(`\nResults saved to: ${resultsDir}\n`)
        );
      } catch (error: any) {
        spinner.fail("Error running benchmark");
        console.error(chalk.red("\n❌ Error:"), error.message);
        process.exit(1);
      }
    });

  return command;
}

