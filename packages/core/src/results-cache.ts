import * as fs from "fs";
import * as path from "path";

export interface CachedResult {
  modelName: string;
  filename: string;
  timestamp: string;
  accuracy: number;
}

export function getResultsDirectory(): string {
  return path.join(process.cwd(), "results");
}

export function listCachedResults(): CachedResult[] {
  const resultsDir = getResultsDirectory();
  
  if (!fs.existsSync(resultsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(resultsDir);
  const jsonFiles = files.filter(f => f.endsWith(".json"));
  
  const results: CachedResult[] = [];
  
  for (const file of jsonFiles) {
    try {
      const filePath = path.join(resultsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(content);
      
      results.push({
        modelName: data.modelName,
        filename: file,
        timestamp: data.timestamp,
        accuracy: data.accuracy,
      });
    } catch (error) {
      // Skip invalid files
    }
  }
  
  return results;
}

export function hasResultForModel(modelName: string, category?: string): boolean {
  const cached = listCachedResults();
  
  for (const result of cached) {
    if (result.modelName === modelName) {
      // If category is specified, we need to check if it's a full benchmark
      // For now, we'll consider any result as valid
      // TODO: Could add category-specific caching
      return true;
    }
  }
  
  return false;
}

export function getResultForModel(modelName: string): CachedResult | null {
  const cached = listCachedResults();
  
  // Find the most recent result for this model
  const results = cached.filter(r => r.modelName === modelName);
  
  if (results.length === 0) return null;
  
  // Sort by timestamp descending (most recent first)
  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return results[0];
}

export function getTestedModels(): string[] {
  const cached = listCachedResults();
  const modelNames = new Set<string>();
  
  cached.forEach(r => modelNames.add(r.modelName));
  
  return Array.from(modelNames);
}

export function getUntestedRecommendedModels(recommendedModels: Array<{ id: string }>): string[] {
  const tested = getTestedModels();
  const testedSet = new Set(tested);
  
  return recommendedModels
    .map(m => m.id)
    .filter(id => !testedSet.has(id));
}

