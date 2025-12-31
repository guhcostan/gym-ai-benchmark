import { Command } from "commander";
import chalk from "chalk";
import { formatResultsTable, BenchmarkResult } from "@gym-bench/core";
import { loadResults, listResults } from "../utils/loader";

export function createReportCommand(): Command {
  const command = new Command("report");
  
  command
    .description("Generate report from saved results")
    .option("-f, --file <filename>", "Specific result file")
    .option("-l, --list", "List all available results")
    .action((options) => {
      if (options.list) {
        const files = listResults();
        
        if (files.length === 0) {
          console.log(chalk.yellow("No results found. Run a benchmark first!"));
          return;
        }
        
        console.log(chalk.cyan("\n📁 Available Results:\n"));
        files.forEach((file) => {
          console.log(`  • ${file}`);
        });
        console.log();
        return;
      }
      
      if (!options.file) {
        console.log(chalk.red("Please specify a file with -f or use -l to list available files"));
        return;
      }
      
      const result = loadResults(options.file);
      
      if (!result) {
        console.log(chalk.red(`File not found: ${options.file}`));
        return;
      }
      
      if (result.models) {
        console.log(chalk.cyan("\n📊 Model Comparison Report\n"));
        console.log("=".repeat(100));
        console.log(
          "Model".padEnd(50) +
          "Accuracy".padStart(12) +
          "Avg Time".padStart(15) +
          "Questions".padStart(12)
        );
        console.log("-".repeat(100));
        
        const sorted = [...result.results].sort((a: BenchmarkResult, b: BenchmarkResult) => 
          b.accuracy - a.accuracy
        );
        
        for (const res of sorted) {
          console.log(
            res.modelName.padEnd(50) +
            `${res.accuracy.toFixed(2)}%`.padStart(12) +
            `${(res.averageTimeMs / 1000).toFixed(2)}s`.padStart(15) +
            res.totalQuestions.toString().padStart(12)
          );
        }
        
        console.log("=".repeat(100));
      } else {
        console.log(formatResultsTable(result as BenchmarkResult));
      }
    });
  
  return command;
}

