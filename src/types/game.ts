export type GameMode = 'multiplication' | 'division' | 'mixed';
export type TimerMode = 'per-question' | 'total';
export type DifficultyPreset = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface GameSettings {
  mode: GameMode;
  timeLimit: number; // seconds per question or total
  timerMode: TimerMode;
  selectedTables: number[]; // 1-20
  multiplierRange: { min: number; max: number }; // 1-10
  difficulty?: DifficultyPreset;
  totalQuestions?: number; // for total timer mode
}

export interface Question {
  num1: number;
  num2: number;
  operation: 'multiplication' | 'division';
  answer: number;
}

export interface GameStats {
  correct: number;
  incorrect: number;
  totalQuestions: number;
  questionsAnswered: Question[];
  currentStreak: number;
  bestStreak: number;
  averageTime: number;
  fastestAnswer: number;
}

export const DIFFICULTY_PRESETS: Record<DifficultyPreset, Partial<GameSettings>> = {
  beginner: {
    difficulty: 'beginner',
    selectedTables: [1, 2, 3, 4, 5],
    multiplierRange: { min: 1, max: 5 },
    timeLimit: 30,
    timerMode: 'per-question'
  },
  intermediate: {
    difficulty: 'intermediate',
    selectedTables: [6, 7, 8, 9, 10],
    multiplierRange: { min: 3, max: 10 },
    timeLimit: 20,
    timerMode: 'per-question'
  },
  expert: {
    difficulty: 'expert',
    selectedTables: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    multiplierRange: { min: 5, max: 10 },
    timeLimit: 15,
    timerMode: 'per-question'
  },
  custom: {
    difficulty: 'custom'
  }
};
