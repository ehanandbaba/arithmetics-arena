export type AchievementId = 
  | 'first_game' | 'first_correct' | 'questions_5' | 'daily_first' | 'streak_3'
  | 'questions_10' | 'speed_10s' | 'streak_5' | 'games_3' | 'questions_50'
  | 'accuracy_80' | 'speed_7s' | 'all_modes' | 'streak_10' | 'games_5'
  | 'century_club' | 'accuracy_90' | 'speed_5s' | 'streak_15' | 'perfect_score'
  | 'speed_master' | 'questions_200' | 'streak_20' | 'mult_85' | 'div_85'
  | 'games_10' | 'multiplication_master' | 'division_master' | 'mixed_master' | 'questions_500'
  | 'streak_25' | 'speed_2s' | 'daily_5' | 'games_20' | 'perfect_x3'
  | 'questions_1000' | 'streak_30' | 'speed_1_5s' | 'mult_95' | 'div_95'
  | 'mixed_95' | 'streak_40' | 'daily_10' | 'games_50' | 'questions_2000'
  | 'streak_50' | 'perfect_streak_5' | 'daily_20' | 'streak_100' | 'questions_5000';

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
  // EASY (1-15)
  { id: 'first_game', title: 'First Steps', description: 'Complete your first game', icon: '🎮', unlocked: false },
  { id: 'first_correct', title: 'First Victory', description: 'Answer your first question correctly', icon: '✅', unlocked: false },
  { id: 'questions_5', title: 'Quick Learner', description: 'Answer 5 questions', icon: '📝', unlocked: false },
  { id: 'daily_first', title: 'Daily Challenger', description: 'Complete your first daily challenge', icon: '📅', unlocked: false },
  { id: 'streak_3', title: 'Triple Threat', description: 'Get 3 correct answers in a row', icon: '🎯', unlocked: false },
  { id: 'questions_10', title: 'Getting Warmed Up', description: 'Answer 10 questions', icon: '🔢', unlocked: false },
  { id: 'speed_10s', title: 'Fast Fingers', description: 'Answer a question in under 10 seconds', icon: '⏱️', unlocked: false },
  { id: 'streak_5', title: 'Five Alive', description: 'Get 5 correct answers in a row', icon: '🔥', unlocked: false },
  { id: 'games_3', title: 'Committed Player', description: 'Play 3 games', icon: '🎲', unlocked: false },
  { id: 'questions_50', title: 'Half Century', description: 'Answer 50 questions', icon: '🎊', unlocked: false },
  { id: 'accuracy_80', title: 'Pretty Good', description: 'Complete a game with 80% accuracy', icon: '👍', unlocked: false },
  { id: 'speed_7s', title: 'Quick Response', description: 'Answer a question in under 7 seconds', icon: '💨', unlocked: false },
  { id: 'all_modes', title: 'Versatile', description: 'Try all three game modes', icon: '🌐', unlocked: false },
  { id: 'streak_10', title: 'Perfect Ten', description: 'Get 10 correct answers in a row', icon: '⚡', unlocked: false },
  { id: 'games_5', title: 'Regular Player', description: 'Play 5 games', icon: '🎮', unlocked: false },
  
  // MEDIUM (16-35)
  { id: 'century_club', title: 'Century Club', description: 'Answer 100 questions correctly', icon: '💯', unlocked: false },
  { id: 'accuracy_90', title: 'Excellence', description: 'Complete a game with 90% accuracy', icon: '🌟', unlocked: false },
  { id: 'speed_5s', title: 'Quick Thinker', description: 'Answer a question in under 5 seconds', icon: '🧠', unlocked: false },
  { id: 'streak_15', title: 'Hot Streak', description: 'Get 15 correct answers in a row', icon: '🔥', unlocked: false },
  { id: 'perfect_score', title: 'Perfectionist', description: 'Complete a game with 100% accuracy', icon: '💎', unlocked: false },
  { id: 'speed_master', title: 'Lightning Fast', description: 'Answer a question in under 3 seconds', icon: '⚡', unlocked: false },
  { id: 'questions_200', title: 'Double Century', description: 'Answer 200 questions correctly', icon: '🎯', unlocked: false },
  { id: 'streak_20', title: 'Unstoppable', description: 'Get 20 correct answers in a row', icon: '💪', unlocked: false },
  { id: 'mult_85', title: 'Multiplication Pro', description: 'Get 85% accuracy in multiplication mode', icon: '✖️', unlocked: false },
  { id: 'div_85', title: 'Division Pro', description: 'Get 85% accuracy in division mode', icon: '➗', unlocked: false },
  { id: 'games_10', title: 'Dedicated', description: 'Play 10 games', icon: '🎪', unlocked: false },
  { id: 'multiplication_master', title: 'Multiplication Master', description: 'Get 90% accuracy in multiplication mode', icon: '✖️', unlocked: false },
  { id: 'division_master', title: 'Division Master', description: 'Get 90% accuracy in division mode', icon: '➗', unlocked: false },
  { id: 'mixed_master', title: 'Mixed Master', description: 'Get 90% accuracy in mixed mode', icon: '🎲', unlocked: false },
  { id: 'questions_500', title: 'Five Hundred Club', description: 'Answer 500 questions correctly', icon: '🏆', unlocked: false },
  { id: 'streak_25', title: 'Quarter Century Streak', description: 'Get 25 correct answers in a row', icon: '🌟', unlocked: false },
  { id: 'speed_2s', title: 'Blink Fast', description: 'Answer a question in under 2 seconds', icon: '👁️', unlocked: false },
  { id: 'daily_5', title: 'Daily Devotee', description: 'Complete 5 daily challenges', icon: '📆', unlocked: false },
  { id: 'games_20', title: 'Veteran', description: 'Play 20 games', icon: '🎖️', unlocked: false },
  { id: 'perfect_x3', title: 'Triple Perfect', description: 'Complete 3 perfect games', icon: '💫', unlocked: false },
  
  // HARD (36-50)
  { id: 'questions_1000', title: 'Millennium', description: 'Answer 1000 questions correctly', icon: '🏅', unlocked: false },
  { id: 'streak_30', title: 'Thirty Strong', description: 'Get 30 correct answers in a row', icon: '💥', unlocked: false },
  { id: 'speed_1_5s', title: 'Superhuman Speed', description: 'Answer a question in under 1.5 seconds', icon: '🚀', unlocked: false },
  { id: 'mult_95', title: 'Multiplication Genius', description: 'Get 95% accuracy in multiplication mode', icon: '✖️', unlocked: false },
  { id: 'div_95', title: 'Division Genius', description: 'Get 95% accuracy in division mode', icon: '➗', unlocked: false },
  { id: 'mixed_95', title: 'Mixed Genius', description: 'Get 95% accuracy in mixed mode', icon: '🎲', unlocked: false },
  { id: 'streak_40', title: 'Forty Fury', description: 'Get 40 correct answers in a row', icon: '🌪️', unlocked: false },
  { id: 'daily_10', title: 'Daily Champion', description: 'Complete 10 daily challenges', icon: '🏆', unlocked: false },
  { id: 'games_50', title: 'Master Player', description: 'Play 50 games', icon: '👑', unlocked: false },
  { id: 'questions_2000', title: 'Two Thousand Strong', description: 'Answer 2000 questions correctly', icon: '💪', unlocked: false },
  { id: 'streak_50', title: 'Half Century Streak', description: 'Get 50 correct answers in a row', icon: '🔥', unlocked: false },
  { id: 'perfect_streak_5', title: 'Flawless Five', description: 'Complete 5 perfect games in a row', icon: '💯', unlocked: false },
  { id: 'daily_20', title: 'Daily Legend', description: 'Complete 20 daily challenges', icon: '🌟', unlocked: false },
  { id: 'streak_100', title: 'Century Streak', description: 'Get 100 correct answers in a row', icon: '👑', unlocked: false },
  { id: 'questions_5000', title: 'Ultimate Master', description: 'Answer 5000 questions correctly', icon: '🎖️', unlocked: false }
];
