import { calculateMetrics } from '../metrics';
import { BenchmarkResult, Category, Difficulty } from '../types';

describe('Metrics', () => {
  const mockResult: BenchmarkResult = {
    modelName: 'test-model',
    timestamp: '2024-01-01T00:00:00.000Z',
    totalQuestions: 10,
    correctAnswers: 8,
    accuracy: 80,
    totalTimeMs: 10000,
    averageTimeMs: 1000,
    accuracyByCategory: {
      anatomy: 100,
      technique: 75,
      programming: 80,
      nutrition: 70,
      injury: 90,
      biomechanics: 85,
    },
    accuracyByDifficulty: {
      easy: 90,
      medium: 80,
      hard: 70,
    },
    results: [],
  };

  test('calculateMetrics returns formatted metrics', () => {
    const metrics = calculateMetrics(mockResult);
    
    expect(metrics.accuracy).toBe('80.00%');
    expect(metrics.totalQuestions).toBe(10);
    expect(metrics.correctAnswers).toBe(8);
    expect(metrics.averageTimeSeconds).toBe('1.00s');
    expect(metrics.totalTimeSeconds).toBe('10.00s');
  });

  test('accuracy is formatted with 2 decimals', () => {
    const result = { ...mockResult, accuracy: 75.5555 };
    const metrics = calculateMetrics(result);
    
    expect(metrics.accuracy).toBe('75.56%');
  });
});

