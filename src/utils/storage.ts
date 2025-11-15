import { GameProgress, DEFAULT_ACHIEVEMENTS, Achievement } from '@/types/achievements';
import { DailyChallenge, generateDailyChallenge } from '@/types/dailyChallenge';

const STORAGE_KEYS = {
  PROGRESS: 'times-tables-progress',
  DAILY_CHALLENGE: 'times-tables-daily-challenge',
  PAUSED_GAME: 'times-tables-paused-game'
};

export const getProgress = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  
  return {
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestStreak: 0,
    currentStreak: 0,
    fastestAnswer: Infinity,
    achievements: DEFAULT_ACHIEVEMENTS,
    gameHistory: []
  };
};

export const saveProgress = (progress: GameProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const resetProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};

export const unlockAchievement = (achievementId: string): Achievement | null => {
  const progress = getProgress();
  const achievement = progress.achievements.find(a => a.id === achievementId);
  
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    saveProgress(progress);
    return achievement;
  }
  
  return null;
};

export const getDailyChallenge = (): DailyChallenge => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE);
    if (stored) {
      const challenge: DailyChallenge = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      
      // If stored challenge is for today, return it
      if (challenge.date === today) {
        return challenge;
      }
    }
  } catch (error) {
    console.error('Error loading daily challenge:', error);
  }
  
  // Generate new challenge for today
  const newChallenge = generateDailyChallenge(new Date());
  saveDailyChallenge(newChallenge);
  return newChallenge;
};

export const saveDailyChallenge = (challenge: DailyChallenge): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(challenge));
  } catch (error) {
    console.error('Error saving daily challenge:', error);
  }
};

export const savePausedGame = (gameState: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PAUSED_GAME, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving paused game:', error);
  }
};

export const getPausedGame = (): any => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PAUSED_GAME);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading paused game:', error);
  }
  return null;
};

export const clearPausedGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PAUSED_GAME);
  } catch (error) {
    console.error('Error clearing paused game:', error);
  }
};

export const saveGameResult = (stats: any, settings: any, unlockedAchievements: string[]): void => {
  const progress = getProgress();
  
  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correct / stats.totalQuestions) * 100) 
    : 0;
  
  const avgTime = stats.answerTimes.length > 0
    ? stats.answerTimes.reduce((a: number, b: number) => a + b, 0) / stats.answerTimes.length
    : 0;
  
  // Update overall progress
  progress.totalGamesPlayed += 1;
  progress.totalQuestionsAnswered += stats.totalQuestions;
  progress.totalCorrectAnswers += stats.correct;
  progress.bestStreak = Math.max(progress.bestStreak, stats.bestStreak);
  progress.fastestAnswer = Math.min(progress.fastestAnswer, stats.fastestAnswer);
  
  // Add to game history
  progress.gameHistory.unshift({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    mode: settings.mode,
    correct: stats.correct,
    incorrect: stats.incorrect,
    accuracy,
    timePerQuestion: avgTime
  });
  
  // Keep only last 50 games
  if (progress.gameHistory.length > 50) {
    progress.gameHistory = progress.gameHistory.slice(0, 50);
  }
  
  // Unlock achievements
  unlockedAchievements.forEach(id => {
    const achievement = progress.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
    }
  });
  
  saveProgress(progress);
};

export const checkPersonalBests = (stats: any): string[] => {
  const progress = getProgress();
  const bests: string[] = [];
  
  if (stats.bestStreak > progress.bestStreak) {
    bests.push('Best Streak');
  }
  
  if (stats.fastestAnswer < progress.fastestAnswer && stats.fastestAnswer < Infinity) {
    bests.push('Fastest Answer');
  }
  
  return bests;
};
