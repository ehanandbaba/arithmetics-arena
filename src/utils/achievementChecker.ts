import { GameProgress } from '@/types/achievements';
import { GameStats, GameSettings } from '@/types/game';
import { toast } from 'sonner';
import { getProgress, getDailyChallenge } from './storage';

// Check achievements that can be unlocked during gameplay (real-time)
export const checkGameplayAchievements = (
  stats: GameStats,
  alreadyUnlocked: string[]
): string[] => {
  const newAchievements: string[] = [];
  const answerTime = stats.answerTimes[stats.answerTimes.length - 1] || Infinity;

  // First correct answer
  if (stats.correct === 1 && !alreadyUnlocked.includes('first_correct')) {
    newAchievements.push('first_correct');
    toast.success('Achievement Unlocked! ✅', { description: 'First Victory' });
  }

  // Streak achievements
  const streakChecks = [
    { streak: 3, id: 'streak_3', icon: '🎯', title: 'Triple Threat' },
    { streak: 5, id: 'streak_5', icon: '🔥', title: 'Five Alive' },
    { streak: 10, id: 'streak_10', icon: '⚡', title: 'Perfect Ten' },
    { streak: 15, id: 'streak_15', icon: '🔥', title: 'Hot Streak' },
    { streak: 20, id: 'streak_20', icon: '💪', title: 'Unstoppable' },
    { streak: 25, id: 'streak_25', icon: '🌟', title: 'Quarter Century Streak' },
    { streak: 30, id: 'streak_30', icon: '💥', title: 'Thirty Strong' },
    { streak: 40, id: 'streak_40', icon: '🌪️', title: 'Forty Fury' },
    { streak: 50, id: 'streak_50', icon: '🔥', title: 'Half Century Streak' },
    { streak: 100, id: 'streak_100', icon: '👑', title: 'Century Streak' }
  ];

  streakChecks.forEach(({ streak, id, icon, title }) => {
    if (stats.currentStreak === streak && !alreadyUnlocked.includes(id)) {
      newAchievements.push(id);
      toast.success(`Achievement Unlocked! ${icon}`, { description: title });
    }
  });

  // Speed achievements
  const speedChecks = [
    { time: 10, id: 'speed_10s', icon: '⏱️', title: 'Fast Fingers' },
    { time: 7, id: 'speed_7s', icon: '💨', title: 'Quick Response' },
    { time: 5, id: 'speed_5s', icon: '🧠', title: 'Quick Thinker' },
    { time: 3, id: 'speed_master', icon: '⚡', title: 'Lightning Fast' },
    { time: 2, id: 'speed_2s', icon: '👁️', title: 'Blink Fast' },
    { time: 1.5, id: 'speed_1_5s', icon: '🚀', title: 'Superhuman Speed' }
  ];

  speedChecks.forEach(({ time, id, icon, title }) => {
    if (answerTime < time && !alreadyUnlocked.includes(id)) {
      newAchievements.push(id);
      toast.success(`Achievement Unlocked! ${icon}`, { description: title });
    }
  });

  return newAchievements;
};

// Check achievements that are based on cumulative progress (after game ends)
export const checkProgressAchievements = (
  stats: GameStats,
  settings: GameSettings,
  isDailyChallenge: boolean
): string[] => {
  const progress = getProgress();
  const newAchievements: string[] = [];
  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correct / stats.totalQuestions) * 100) 
    : 0;

  // Helper to check if achievement is already unlocked
  const isUnlocked = (id: string) => 
    progress.achievements.find(a => a.id === id)?.unlocked || false;

  // First game
  if (progress.totalGamesPlayed === 0 && !isUnlocked('first_game')) {
    newAchievements.push('first_game');
  }

  // Questions answered achievements
  const questionChecks = [
    { count: 5, id: 'questions_5' },
    { count: 10, id: 'questions_10' },
    { count: 50, id: 'questions_50' },
    { count: 100, id: 'century_club' },
    { count: 200, id: 'questions_200' },
    { count: 500, id: 'questions_500' },
    { count: 1000, id: 'questions_1000' },
    { count: 2000, id: 'questions_2000' },
    { count: 5000, id: 'questions_5000' }
  ];

  const totalCorrect = progress.totalCorrectAnswers + stats.correct;
  questionChecks.forEach(({ count, id }) => {
    if (totalCorrect >= count && !isUnlocked(id)) {
      newAchievements.push(id);
    }
  });

  // Games played achievements
  const gamesChecks = [
    { count: 3, id: 'games_3' },
    { count: 5, id: 'games_5' },
    { count: 10, id: 'games_10' },
    { count: 20, id: 'games_20' },
    { count: 50, id: 'games_50' }
  ];

  const totalGames = progress.totalGamesPlayed + 1;
  gamesChecks.forEach(({ count, id }) => {
    if (totalGames >= count && !isUnlocked(id)) {
      newAchievements.push(id);
    }
  });

  // Accuracy achievements
  if (accuracy >= 80 && !isUnlocked('accuracy_80')) {
    newAchievements.push('accuracy_80');
  }
  if (accuracy >= 90 && !isUnlocked('accuracy_90')) {
    newAchievements.push('accuracy_90');
  }
  if (accuracy === 100 && stats.totalQuestions >= 10 && !isUnlocked('perfect_score')) {
    newAchievements.push('perfect_score');
  }

  // Mode-specific achievements
  if (settings.mode === 'multiplication') {
    if (accuracy >= 85 && !isUnlocked('mult_85')) newAchievements.push('mult_85');
    if (accuracy >= 90 && !isUnlocked('multiplication_master')) newAchievements.push('multiplication_master');
    if (accuracy >= 95 && !isUnlocked('mult_95')) newAchievements.push('mult_95');
  } else if (settings.mode === 'division') {
    if (accuracy >= 85 && !isUnlocked('div_85')) newAchievements.push('div_85');
    if (accuracy >= 90 && !isUnlocked('division_master')) newAchievements.push('division_master');
    if (accuracy >= 95 && !isUnlocked('div_95')) newAchievements.push('div_95');
  } else if (settings.mode === 'mixed') {
    if (accuracy >= 90 && !isUnlocked('mixed_master')) newAchievements.push('mixed_master');
    if (accuracy >= 95 && !isUnlocked('mixed_95')) newAchievements.push('mixed_95');
  }

  // All modes tried (check game history)
  const modes = new Set(progress.gameHistory.map(g => g.mode));
  modes.add(settings.mode);
  if (modes.size >= 3 && !isUnlocked('all_modes')) {
    newAchievements.push('all_modes');
  }

  // Daily challenge achievements
  if (isDailyChallenge && !isUnlocked('daily_first')) {
    newAchievements.push('daily_first');
  }

  // Count completed daily challenges from localStorage
  const dailyKey = 'timesTablesChallenge_daily_challenge';
  try {
    const stored = localStorage.getItem(dailyKey);
    if (stored) {
      // Count unique days with completed challenges
      const challengeHistory = progress.gameHistory.filter(
        g => g.mode === settings.mode && g.accuracy >= 50
      );
      
      const dailyChallengesCount = isDailyChallenge ? 
        challengeHistory.length + 1 : challengeHistory.length;

      if (dailyChallengesCount >= 5 && !isUnlocked('daily_5')) {
        newAchievements.push('daily_5');
      }
      if (dailyChallengesCount >= 10 && !isUnlocked('daily_10')) {
        newAchievements.push('daily_10');
      }
      if (dailyChallengesCount >= 20 && !isUnlocked('daily_20')) {
        newAchievements.push('daily_20');
      }
    }
  } catch (e) {
    // Silent fail for daily challenge tracking
  }

  // Perfect games tracking
  const perfectGames = progress.gameHistory.filter(g => g.accuracy === 100);
  if (accuracy === 100) {
    if (perfectGames.length + 1 >= 3 && !isUnlocked('perfect_x3')) {
      newAchievements.push('perfect_x3');
    }

    // Check for consecutive perfect games
    const recentGames = [
      ...progress.gameHistory.slice(0, 4),
      { accuracy }
    ];
    const isConsecutivePerfect = recentGames.every(g => g.accuracy === 100);
    if (isConsecutivePerfect && recentGames.length >= 5 && !isUnlocked('perfect_streak_5')) {
      newAchievements.push('perfect_streak_5');
    }
  }

  return newAchievements;
};
