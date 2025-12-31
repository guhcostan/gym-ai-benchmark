import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage } from "@langchain/core/messages";
import { Question, EvaluationResult, BenchmarkResult, Category, Difficulty, ModelConfig } from "./types";
import { createModel } from "./models";

const PROMPT_TEMPLATE = `You are taking a physical education and gym training exam.
Answer the multiple choice question by selecting only the letter (A, B, C, or D) of the correct answer.

Question: {question}
A) {choice_a}
B) {choice_b}
C) {choice_c}
D) {choice_d}

Answer with only the letter:`;

export class BenchmarkEvaluator {
  private model: BaseChatModel;
  private modelName: string;

  constructor(modelConfig: ModelConfig) {
    this.model = createModel(modelConfig);
    this.modelName = modelConfig.modelName;
  }

  private formatPrompt(question: Question): string {
    return PROMPT_TEMPLATE
      .replace("{question}", question.question)
      .replace("{choice_a}", question.choices[0])
      .replace("{choice_b}", question.choices[1])
      .replace("{choice_c}", question.choices[2])
      .replace("{choice_d}", question.choices[3]);
  }

  private extractAnswer(response: string): string {
    const cleaned = response.trim().toUpperCase();
    
    const match = cleaned.match(/^[ABCD]$/);
    if (match) return match[0];
    
    const letterMatch = cleaned.match(/[ABCD]/);
    if (letterMatch) return letterMatch[0];
    
    return cleaned.charAt(0);
  }

  private getCorrectAnswerLetter(question: Question): string {
    return ["A", "B", "C", "D"][question.answer];
  }

  async evaluateQuestion(question: Question): Promise<EvaluationResult> {
    const prompt = this.formatPrompt(question);
    const startTime = Date.now();

    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      const timeMs = Date.now() - startTime;

      const modelAnswer = this.extractAnswer(response.content.toString());
      const correctAnswer = this.getCorrectAnswerLetter(question);
      const isCorrect = modelAnswer === correctAnswer;

      return {
        questionId: question.id,
        question: question.question,
        modelAnswer,
        correctAnswer,
        isCorrect,
        category: question.category,
        difficulty: question.difficulty,
        timeMs,
      };
    } catch (error) {
      console.error(`Error evaluating question ${question.id}:`, error);
      throw error;
    }
  }

  async evaluate(questions: Question[]): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const results: EvaluationResult[] = [];

    for (const question of questions) {
      const result = await this.evaluateQuestion(question);
      results.push(result);
      console.log(
        `[${results.length}/${questions.length}] ${result.isCorrect ? "✓" : "✗"} ${question.id}`
      );
    }

    const totalTimeMs = Date.now() - startTime;
    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const accuracy = (correctAnswers / questions.length) * 100;

    const accuracyByCategory = this.calculateAccuracyByCategory(results);
    const accuracyByDifficulty = this.calculateAccuracyByDifficulty(results);

    return {
      modelName: this.modelName,
      timestamp: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers,
      accuracy,
      totalTimeMs,
      averageTimeMs: totalTimeMs / questions.length,
      accuracyByCategory,
      accuracyByDifficulty,
      results,
    };
  }

  private calculateAccuracyByCategory(
    results: EvaluationResult[]
  ): Record<Category, number> {
    const categories: Category[] = [
      "anatomy",
      "technique",
      "programming",
      "nutrition",
      "injury",
      "biomechanics",
    ];

    const accuracyByCategory = {} as Record<Category, number>;

    for (const category of categories) {
      const categoryResults = results.filter((r) => r.category === category);
      if (categoryResults.length > 0) {
        const correct = categoryResults.filter((r) => r.isCorrect).length;
        accuracyByCategory[category] = (correct / categoryResults.length) * 100;
      } else {
        accuracyByCategory[category] = 0;
      }
    }

    return accuracyByCategory;
  }

  private calculateAccuracyByDifficulty(
    results: EvaluationResult[]
  ): Record<Difficulty, number> {
    const difficulties: Difficulty[] = ["easy", "medium", "hard"];
    const accuracyByDifficulty = {} as Record<Difficulty, number>;

    for (const difficulty of difficulties) {
      const difficultyResults = results.filter((r) => r.difficulty === difficulty);
      if (difficultyResults.length > 0) {
        const correct = difficultyResults.filter((r) => r.isCorrect).length;
        accuracyByDifficulty[difficulty] = (correct / difficultyResults.length) * 100;
      } else {
        accuracyByDifficulty[difficulty] = 0;
      }
    }

    return accuracyByDifficulty;
  }
}

