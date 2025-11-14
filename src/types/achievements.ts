export type AchievementId = 
  | 'first_game'
  | 'streak_5'
  | 'streak_10'
  | 'speed_master'
  | 'perfect_score'
  | 'century_club'
  | 'quick_thinker'
  | 'multiplication_master'
  | 'division_master'
  | 'mixed_master';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameProgress {
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  currentStreak: number;
  fastestAnswer: number; // in seconds
  achievements: Achievement[];
  gameHistory: GameHistoryEntry[];
}

export interface GameHistoryEntry {
  id: string;
  date: string;
  mode: string;
  correct: number;
  incorrect: number;
  accuracy: number;
  timePerQuestion: number;
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    title: 'Getting Started',
    description: 'Complete your first game',
    icon: '🎮',
    unlocked: false
  },
  {
    id: 'streak_5',
    title: '5 in a Row',
    description: 'Get 5 correct answers in a row',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'streak_10',
    title: '10 in a Row',
    description: 'Get 10 correct answers in a row',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'speed_master',
    title: 'Speed Master',
    description: 'Answer a question in under 3 seconds',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Complete a game with 100% accuracy',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Answer 100 questions correctly',
    icon: '💯',
    unlocked: false
  },
  {
    id: 'quick_thinker',
    title: 'Quick Thinker',
    description: 'Average under 5 seconds per question',
    icon: '🧠',
    unlocked: false
  },
  {
    id: 'multiplication_master',
    title: 'Multiplication Master',
    description: 'Get 90% accuracy in multiplication mode',
    icon: '✖️',
    unlocked: false
  },
  {
    id: 'division_master',
    title: 'Division Master',
    description: 'Get 90% accuracy in division mode',
    icon: '➗',
    unlocked: false
  },
  {
    id: 'mixed_master',
    title: 'Mixed Master',
    description: 'Get 90% accuracy in mixed mode',
    icon: '🎲',
    unlocked: false
  }
];
