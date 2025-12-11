import { BattleQuestion, BattleOperation, BattleDifficulty } from '@/types/battle';

const operations: BattleOperation[] = ['addition', 'subtraction', 'multiplication', 'division'];

const operationSymbols: Record<BattleOperation, string> = {
  addition: '+',
  subtraction: '-',
  multiplication: '×',
  division: '÷'
};

export const generateBattleQuestion = (difficulty: BattleDifficulty): BattleQuestion => {
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number, answer: number;
  
  // Determine number ranges based on difficulty
  const getRange = () => {
    switch (difficulty) {
      case 'easy':
        return { min: 1, max: 6 };
      case 'medium':
        return { min: 1, max: 10 };
      case 'hard':
        return { min: 1, max: 12 };
      default:
        return { min: 1, max: 10 };
    }
  };
  
  const range = getRange();
  
  switch (operation) {
    case 'addition':
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      answer = num1 + num2;
      break;
      
    case 'subtraction':
      // Ensure positive result
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
      
    case 'multiplication':
      // Tables and multipliers limited to 1-12
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      break;
      
    case 'division':
      // Ensure clean division with tables 1-12
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * answer;
      break;
      
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  
  const displayText = `${num1} ${operationSymbols[operation]} ${num2}`;
  
  return {
    num1,
    num2,
    operation,
    answer,
    displayText
  };
};
