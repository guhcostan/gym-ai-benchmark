import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { 
  fetchAvailableModels,
  getRecommendedModels,
  getRecommendedModelsByTier, 
  getTestedModels,
  getResultForModel,
  ModelWithTier
} from "@gym-bench/core";

export function createRecommendCommand(): Command {
  const command = new Command("recommend");
  
  command
    .description("Show recommended models to benchmark (fetched dynamically from OpenRouter)")
    .option("-t, --tier <tier>", "Filter by tier: free, budget, premium")
    .option("-u, --untested", "Show only untested models")
    .option("-l, --limit <number>", "Limit number of results", "20")
    .action(async (options) => {
      const spinner = ora("Fetching available models from OpenRouter...").start();
      
      try {
        const allModels = await fetchAvailableModels();
        
        if (allModels.length === 0) {
          spinner.fail("Could not fetch models from OpenRouter");
          console.log(chalk.red("\n❌ Please check your API key and connection\n"));
          return;
        }
        
        spinner.succeed(`Analyzed ${allModels.length} models`);
        console.log(chalk.bold.cyan("\n💪 Gym AI Benchmark - Recommended Models\n"));
        
        let models: ModelWithTier[] = options.tier 
          ? getRecommendedModelsByTier(allModels, options.tier as any)
          : getRecommendedModels(allModels);
        
        const limit = parseInt(options.limit);
        const testedModels = new Set(getTestedModels());
        
        if (options.untested) {
          models = models.filter(m => !testedModels.has(m.id));
          
          if (models.length === 0) {
            console.log(chalk.green("✅ All recommended models have been tested!\n"));
            return;
          }
          
          console.log(chalk.yellow(`📋 ${models.length} untested recommended models:\n`));
        } else {
          console.log(chalk.gray(`Showing top ${Math.min(models.length, limit)} recommended models (from ${allModels.length} available)\n`));
        }
        
        // Apply limit
        models = models.slice(0, limit);
        
        // Group by tier
        const byTier = {
          free: models.filter(m => m.tier === "free"),
          budget: models.filter(m => m.tier === "budget"),
          premium: models.filter(m => m.tier === "premium"),
        };
        
        for (const [tier, tierModels] of Object.entries(byTier)) {
          if (tierModels.length === 0) continue;
          
          const icon = tier === "free" ? "🆓" : tier === "budget" ? "💰" : "💎";
          const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
          
          console.log(chalk.cyan(`${icon} ${tierLabel} Tier (${tierModels.length} models):\n`));
          
          for (const model of tierModels) {
            const isTested = testedModels.has(model.id);
            const statusIcon = isTested ? chalk.green("✓") : chalk.gray("○");
            const provider = model.id.split("/")[0];
            
            console.log(`${statusIcon} ${chalk.bold(model.name || model.id)}`);
            console.log(`   ${chalk.gray("ID:")} ${model.id}`);
            console.log(`   ${chalk.gray("Provider:")} ${provider}`);
            console.log(`   ${chalk.gray("Cost:")} ${model.estimatedCost} per benchmark`);
            console.log(`   ${chalk.gray("Context:")} ${model.context_length} tokens`);
            
            if (isTested) {
              const result = getResultForModel(model.id);
              if (result) {
                console.log(chalk.green(`   ✓ Tested: ${result.accuracy.toFixed(2)}% accuracy`));
              }
            }
            
            console.log();
          }
        }
      
        // Summary
        const tested = models.filter(m => testedModels.has(m.id)).length;
        const untested = models.length - tested;
        
        console.log(chalk.cyan("📊 Summary:"));
        console.log(`   ${chalk.green("Tested:")} ${tested}/${models.length} shown`);
        console.log(`   ${chalk.yellow("Untested:")} ${untested}/${models.length} shown`);
        console.log(`   ${chalk.gray("Total available:")} ${allModels.length} models`);
        
        if (untested > 0) {
          console.log(chalk.cyan("\n💡 Suggested next test:"));
          const nextModel = models.find(m => !testedModels.has(m.id));
          if (nextModel) {
            console.log(chalk.bold(`   ./gym-bench.sh run -m ${nextModel.id}`));
          }
        }
        
        console.log(chalk.gray("\n💡 Tips:"));
        console.log(chalk.gray("   • Start with free models: --tier free --untested"));
        console.log(chalk.gray("   • View only untested: --untested"));
        console.log(chalk.gray("   • Increase limit: --limit 50"));
        console.log(chalk.gray("   • The benchmark skips tested models automatically\n"));
        
      } catch (error: any) {
        spinner.fail("Error fetching models");
        console.error(chalk.red("\n❌ Error:"), error.message);
      }
    });
  
  return command;
}

