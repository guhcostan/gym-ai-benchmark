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
  .description("List available free models")
  .action(() => {
    console.log(chalk.cyan("\n🆓 Free Models (no credits required):\n"));
    const freeModels = [
      "meta-llama/llama-3-8b-instruct:free",
      "google/gemini-flash-1.5:free",
      "mistralai/mistral-7b-instruct:free",
      "nousresearch/nous-capybara-7b:free",
      "openchat/openchat-7b:free",
      "gryphe/mythomist-7b:free",
    ];
    
    freeModels.forEach((model) => {
      console.log(`  • ${chalk.green(model)}`);
    });
    
    console.log(chalk.cyan("\n💳 Popular Paid Models:\n"));
    const paidModels = [
      "openai/gpt-4",
      "openai/gpt-4-turbo",
      "anthropic/claude-3-opus",
      "anthropic/claude-3-sonnet",
      "google/gemini-pro",
      "meta-llama/llama-3-70b",
    ];
    
    paidModels.forEach((model) => {
      console.log(`  • ${chalk.yellow(model)}`);
    });
    
    console.log();
  });

program.parse(process.argv);

