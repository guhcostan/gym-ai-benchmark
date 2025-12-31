import { Question, Category } from "@gym-bench/core";
import * as fs from "fs";
import * as path from "path";

export function loadQuestions(category?: Category): Question[] {
  const dataDir = path.join(__dirname, "../../../../data/questions");
  
  if (category) {
    const filePath = path.join(dataDir, `${category}.json`);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Question[];
  }
  
  const categories: Category[] = [
    "anatomy",
    "technique",
    "programming",
    "nutrition",
    "injury",
    "biomechanics",
  ];
  
  const allQuestions: Question[] = [];
  
  for (const cat of categories) {
    const filePath = path.join(dataDir, `${cat}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const questions = JSON.parse(data) as Question[];
      allQuestions.push(...questions);
    }
  }
  
  return allQuestions;
}

export function saveResult(result: any, filename: string): void {
  const resultsDir = path.join(__dirname, "../../../../results");
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const filePath = path.join(resultsDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
}

export function loadResults(filename: string): any {
  const resultsDir = path.join(__dirname, "../../../../results");
  const filePath = path.join(resultsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function listResults(): string[] {
  const resultsDir = path.join(__dirname, "../../../../results");
  
  if (!fs.existsSync(resultsDir)) {
    return [];
  }
  
  return fs.readdirSync(resultsDir).filter((f) => f.endsWith(".json"));
}

