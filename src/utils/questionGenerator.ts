import { GameSettings, Question } from '@/types/game';

export const generateQuestion = (settings: GameSettings): Question => {
  const { mode, selectedTables, multiplierRange } = settings;
  
  // Randomly select a table from the selected tables
  const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
  
  // Randomly select a multiplier within the range
  const multiplier = Math.floor(Math.random() * (multiplierRange.max - multiplierRange.min + 1)) + multiplierRange.min;
  
  // Determine operation based on mode
  let operation: 'multiplication' | 'division';
  if (mode === 'mixed') {
    operation = Math.random() < 0.5 ? 'multiplication' : 'division';
  } else {
    operation = mode;
  }
  
  // Generate question based on operation
  if (operation === 'multiplication') {
    return {
      num1: table,
      num2: multiplier,
      operation: 'multiplication',
      answer: table * multiplier
    };
  } else {
    // For division, ensure we're dividing evenly
    const product = table * multiplier;
    return {
      num1: product,
      num2: table,
      operation: 'division',
      answer: multiplier
    };
  }
};
