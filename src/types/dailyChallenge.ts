import { GameSettings } from './game';

export interface DailyChallenge {
  date: string; // YYYY-MM-DD format
  settings: GameSettings;
  completed: boolean;
  score?: {
    correct: number;
    total: number;
    accuracy: number;
  };
}

export const generateDailyChallenge = (date: Date): DailyChallenge => {
  // Use date as seed for consistent daily challenges
  const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365;
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const modes: ('multiplication' | 'division' | 'mixed')[] = ['multiplication', 'division', 'mixed'];
  const mode = modes[seed % 3];
  
  // Generate varied challenges
  const tableCount = random(3, 6);
  const startTable = random(1, 20 - tableCount);
  const selectedTables = Array.from({ length: tableCount }, (_, i) => startTable + i);
  
  const multiplierMin = random(1, 5);
  const multiplierMax = random(multiplierMin + 2, 10);

  return {
    date: date.toISOString().split('T')[0],
    settings: {
      mode,
      timeLimit: random(15, 30),
      timerMode: 'per-question',
      selectedTables,
      multiplierRange: { min: multiplierMin, max: multiplierMax }
    },
    completed: false
  };
};
