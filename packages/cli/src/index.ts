#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { createRunCommand } from "./commands/run";
import { createCompareCommand } from "./commands/compare";
import { createReportCommand } from "./commands/report";

const program = new Command();

program
  .name("gym-bench")
  .description("AI Benchmark for Physical Education and Gym Training Knowledge")
  .version("1.0.0");

console.log(chalk.bold.cyan("\n💪 Gym AI Benchmark\n"));

program.addCommand(createRunCommand());
program.addCommand(createCompareCommand());
program.addCommand(createReportCommand());

program
  .command("models")
  .description("List available models from OpenRouter")
  .option("-f, --free", "Show only free models")
  .option("-p, --popular", "Show only popular models")
  .option("-a, --all", "Show all available models")
  .action(async (options) => {
    const ora = require("ora");
    const { fetchAvailableModels, filterFreeModels, filterPopularModels, formatModelDisplay } = 
      require("@gym-bench/core");
    
    type OpenRouterModel = any; // Type from @gym-bench/core
    
    const spinner = ora("Fetching available models from OpenRouter...").start();
    
    try {
      const allModels = await fetchAvailableModels();
      
      if (allModels.length === 0) {
        spinner.fail("Failed to fetch models. Using cached list.");
        console.log(chalk.yellow("\n⚠️  Could not connect to OpenRouter API"));
        console.log(chalk.gray("Showing cached popular models:\n"));
        
        const cachedModels = [
          "openai/gpt-4",
          "openai/gpt-3.5-turbo",
          "anthropic/claude-3-opus",
          "anthropic/claude-3-sonnet",
          "google/gemini-pro",
        ];
        
        cachedModels.forEach((model) => {
          console.log(`  • ${chalk.yellow(model)}`);
        });
        console.log();
        return;
      }
      
      spinner.succeed(`Found ${allModels.length} models`);
      
      if (options.free) {
        const freeModels = filterFreeModels(allModels);
        console.log(chalk.cyan(`\n🆓 Free Models (${freeModels.length} found):\n`));
        
        if (freeModels.length === 0) {
          console.log(chalk.yellow("  No free models currently available"));
          console.log(chalk.gray("  Note: Free tier availability may vary\n"));
        } else {
          freeModels.slice(0, 15).forEach((model: OpenRouterModel) => {
            console.log(`  • ${chalk.green(model.id)}`);
            if (model.description) {
              console.log(chalk.gray(`    ${model.description.slice(0, 80)}`));
            }
          });
        }
      } else if (options.popular) {
        const popularModels = filterPopularModels(allModels);
        console.log(chalk.cyan(`\n⭐ Popular Models (${popularModels.length} shown):\n`));
        
        popularModels.forEach((model: OpenRouterModel) => {
          const cost = parseFloat(model.pricing.prompt);
          const color = cost === 0 ? chalk.green : cost < 0.001 ? chalk.yellow : chalk.blue;
          console.log(`  • ${color(model.id)}`);
          console.log(chalk.gray(`    ${model.pricing.prompt}/prompt, ${model.pricing.completion}/completion`));
        });
      } else if (options.all) {
        console.log(chalk.cyan(`\n📋 All Available Models (${allModels.length} total):\n`));
        console.log(chalk.gray("Model".padEnd(50) + "Cost (prompt)".padStart(20)));
        console.log("-".repeat(70));
        
        allModels.slice(0, 30).forEach((model: OpenRouterModel) => {
          console.log(formatModelDisplay(model));
        });
        
        if (allModels.length > 30) {
          console.log(chalk.gray(`\n... and ${allModels.length - 30} more models`));
        }
      } else {
        // Default: show categorized view
        const freeModels = filterFreeModels(allModels);
        const popularModels = filterPopularModels(allModels);
        
        console.log(chalk.cyan(`\n🆓 Free Models (${freeModels.length} available):\n`));
        if (freeModels.length === 0) {
          console.log(chalk.yellow("  No free models currently available"));
        } else {
          freeModels.slice(0, 10).forEach((model: OpenRouterModel) => {
            console.log(`  • ${chalk.green(model.id)}`);
          });
          if (freeModels.length > 10) {
            console.log(chalk.gray(`  ... and ${freeModels.length - 10} more (use --free to see all)`));
          }
        }
        
        console.log(chalk.cyan(`\n⭐ Popular Models (top 10):\n`));
        popularModels.slice(0, 10).forEach((model: OpenRouterModel) => {
          const cost = `$${parseFloat(model.pricing.prompt).toFixed(4)}/1K`;
          console.log(`  • ${chalk.yellow(model.id)} ${chalk.gray(cost)}`);
        });
        
        console.log(chalk.gray("\n💡 Use --all to see all models, --free for free only, --popular for popular only"));
      }
      
      console.log();
    } catch (error: any) {
      spinner.fail("Error fetching models");
      console.error(chalk.red("\n❌ Error:"), error.message);
    }
  });

program.parse(process.argv);

