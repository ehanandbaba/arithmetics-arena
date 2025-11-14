export type GameMode = 'multiplication' | 'division' | 'mixed';

export interface GameSettings {
  mode: GameMode;
  timeLimit: number; // seconds per question
  selectedTables: number[]; // 1-20
  multiplierRange: { min: number; max: number }; // 1-10
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
}
