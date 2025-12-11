export type BattleOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type BattleDifficulty = 'easy' | 'medium' | 'hard';

export interface BattleQuestion {
  num1: number;
  num2: number;
  operation: BattleOperation;
  answer: number;
  displayText: string;
}

export interface BattlePlayer {
  id: string;
  name: string;
  health: number;
  isBot?: boolean;
}

export interface BattleRoom {
  id: string;
  player1_id: string | null;
  player2_id: string | null;
  player1_name: string;
  player2_name: string | null;
  player1_health: number;
  player2_health: number;
  current_question: BattleQuestion | null;
  difficulty: BattleDifficulty;
  status: 'waiting' | 'in_progress' | 'finished';
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BattleSettings {
  mode: 'solo' | 'online';
  difficulty: BattleDifficulty;
  playerName: string;
}
