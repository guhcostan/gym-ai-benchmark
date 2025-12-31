export type Category = 
  | "anatomy" 
  | "technique" 
  | "programming" 
  | "nutrition" 
  | "injury" 
  | "biomechanics";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  question: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  category: Category;
  difficulty: Difficulty;
  explanation: string;
}

export interface EvaluationResult {
  questionId: string;
  question: string;
  modelAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  category: Category;
  difficulty: Difficulty;
  timeMs: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface BenchmarkResult {
  modelName: string;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTimeMs: number;
  averageTimeMs: number;
  accuracyByCategory: Record<Category, number>;
  accuracyByDifficulty: Record<Difficulty, number>;
  results: EvaluationResult[];
  totalTokens?: number;
  estimatedCost?: number;
}

export interface ModelConfig {
  provider: "openrouter" | "openai" | "anthropic" | "google" | "ollama";
  modelName: string;
  apiKey?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

