import { BenchmarkResult, Category, Difficulty } from "./types";

export function calculateMetrics(result: BenchmarkResult) {
  return {
    accuracy: result.accuracy.toFixed(2) + "%",
    totalQuestions: result.totalQuestions,
    correctAnswers: result.correctAnswers,
    averageTimeSeconds: (result.averageTimeMs / 1000).toFixed(2) + "s",
    totalTimeSeconds: (result.totalTimeMs / 1000).toFixed(2) + "s",
  };
}

export function formatResultsTable(result: BenchmarkResult): string {
  const lines: string[] = [];
  
  lines.push("=".repeat(80));
  lines.push(`Benchmark Results: ${result.modelName}`);
  lines.push(`Timestamp: ${result.timestamp}`);
  lines.push("=".repeat(80));
  lines.push("");
  
  lines.push("Overall Performance:");
  lines.push(`  Accuracy: ${result.accuracy.toFixed(2)}% (${result.correctAnswers}/${result.totalQuestions})`);
  lines.push(`  Total Time: ${(result.totalTimeMs / 1000).toFixed(2)}s`);
  lines.push(`  Average Time: ${(result.averageTimeMs / 1000).toFixed(2)}s per question`);
  lines.push("");
  
  lines.push("Accuracy by Category:");
  const categories: Category[] = ["anatomy", "technique", "programming", "nutrition", "injury", "biomechanics"];
  for (const cat of categories) {
    const acc = result.accuracyByCategory[cat];
    const count = result.results.filter(r => r.category === cat).length;
    lines.push(`  ${cat.padEnd(15)}: ${acc.toFixed(2).padStart(6)}% (${count} questions)`);
  }
  lines.push("");
  
  lines.push("Accuracy by Difficulty:");
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  for (const diff of difficulties) {
    const acc = result.accuracyByDifficulty[diff];
    const count = result.results.filter(r => r.difficulty === diff).length;
    lines.push(`  ${diff.padEnd(15)}: ${acc.toFixed(2).padStart(6)}% (${count} questions)`);
  }
  lines.push("");
  lines.push("=".repeat(80));
  
  return lines.join("\n");
}

export function compareResults(results: BenchmarkResult[]): string {
  const lines: string[] = [];
  
  lines.push("=".repeat(100));
  lines.push("Model Comparison");
  lines.push("=".repeat(100));
  lines.push("");
  
  lines.push("Model".padEnd(40) + "Accuracy".padStart(12) + "Avg Time".padStart(15) + "Total Questions".padStart(18));
  lines.push("-".repeat(100));
  
  const sorted = [...results].sort((a, b) => b.accuracy - a.accuracy);
  
  for (const result of sorted) {
    lines.push(
      result.modelName.padEnd(40) +
      `${result.accuracy.toFixed(2)}%`.padStart(12) +
      `${(result.averageTimeMs / 1000).toFixed(2)}s`.padStart(15) +
      result.totalQuestions.toString().padStart(18)
    );
  }
  
  lines.push("");
  lines.push("=".repeat(100));
  
  return lines.join("\n");
}

