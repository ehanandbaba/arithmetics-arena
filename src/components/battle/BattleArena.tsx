import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { HealthBar } from './HealthBar';
import { generateBattleQuestion } from '@/utils/battleQuestionGenerator';
import { BattleQuestion, BattleDifficulty, BattlePlayer } from '@/types/battle';
import { Pause, Play, Home, Swords } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BattleArenaProps {
  mode: 'solo' | 'online';
  difficulty: BattleDifficulty;
  playerName: string;
  opponentName?: string;
  onGameEnd?: (winner: 'player' | 'opponent') => void;
}

const MAX_HEALTH = 60;
const DAMAGE = 2;

export const BattleArena = ({ 
  mode, 
  difficulty, 
  playerName, 
  opponentName = 'CPU',
  onGameEnd 
}: BattleArenaProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [player, setPlayer] = useState<BattlePlayer>({
    id: 'player',
    name: playerName,
    health: MAX_HEALTH
  });
  
  const [opponent, setOpponent] = useState<BattlePlayer>({
    id: 'opponent',
    name: opponentName,
    health: MAX_HEALTH,
    isBot: mode === 'solo'
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<BattleQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'attack'; message: string } | null>(null);
  const [botTimer, setBotTimer] = useState<number | null>(null);
  
  // Generate new question
  const generateNewQuestion = useCallback(() => {
    const question = generateBattleQuestion(difficulty);
    setCurrentQuestion(question);
    setUserAnswer('');
    setFeedback(null);
    
    // Set bot answer time based on difficulty
    if (mode === 'solo') {
      const botSpeed = {
        easy: Math.random() * 5000 + 5000,    // 5-10 seconds
        medium: Math.random() * 3000 + 3000,  // 3-6 seconds
        hard: Math.random() * 2000 + 2000     // 2-4 seconds
      };
      setBotTimer(botSpeed[difficulty]);
    }
  }, [difficulty, mode]);
  
  // Initialize game
  useEffect(() => {
    generateNewQuestion();
    inputRef.current?.focus();
  }, [generateNewQuestion]);
  
  // Bot answer timer
  useEffect(() => {
    if (mode !== 'solo' || isPaused || gameOver || !botTimer || !currentQuestion) return;
    
    const timer = setTimeout(() => {
      // Bot answers - damage player
      setPlayer(prev => {
        const newHealth = Math.max(0, prev.health - DAMAGE);
        if (newHealth <= 0) {
          setGameOver(true);
          setWinner('opponent');
        }
        return { ...prev, health: newHealth };
      });
      
      setFeedback({ type: 'attack', message: `${opponent.name} answered first! -${DAMAGE} HP` });
      
      setTimeout(() => {
        if (!gameOver) generateNewQuestion();
      }, 1500);
    }, botTimer);
    
    return () => clearTimeout(timer);
  }, [botTimer, isPaused, gameOver, mode, currentQuestion, opponent.name, generateNewQuestion]);
  
  // Handle answer submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || isPaused || gameOver) return;
    
    const numAnswer = parseInt(userAnswer, 10);
    
    if (numAnswer === currentQuestion.answer) {
      // Correct - damage opponent
      setOpponent(prev => {
        const newHealth = Math.max(0, prev.health - DAMAGE);
        if (newHealth <= 0) {
          setGameOver(true);
          setWinner('player');
        }
        return { ...prev, health: newHealth };
      });
      
      setFeedback({ type: 'correct', message: `Correct! ${opponent.name} takes -${DAMAGE} HP!` });
      
      setTimeout(() => {
        if (!gameOver) generateNewQuestion();
      }, 1500);
    } else {
      // Incorrect
      setFeedback({ type: 'incorrect', message: `Wrong! The answer was ${currentQuestion.answer}` });
      setUserAnswer('');
      inputRef.current?.focus();
    }
  };
  
  // Game over effect
  useEffect(() => {
    if (gameOver && winner) {
      toast({
        title: winner === 'player' ? '🎉 Victory!' : '💀 Defeat!',
        description: winner === 'player' 
          ? `You defeated ${opponent.name}!` 
          : `${opponent.name} won the battle!`,
      });
      onGameEnd?.(winner);
    }
  }, [gameOver, winner, opponent.name, toast, onGameEnd]);
  
  // Focus input when unpaused
  useEffect(() => {
    if (!isPaused && !gameOver) {
      inputRef.current?.focus();
    }
  }, [isPaused, gameOver]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-primary/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="w-5 h-5 mr-2" />
            Exit
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="w-6 h-6" />
            Math Battle
          </h1>
          <Button 
            variant="outline" 
            onClick={() => setIsPaused(!isPaused)}
            disabled={gameOver}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Health Bars */}
        <div className="grid grid-cols-1 gap-4">
          <HealthBar 
            health={player.health} 
            maxHealth={MAX_HEALTH} 
            playerName={player.name}
            isPlayer={true}
          />
          <div className="text-center text-2xl font-bold text-muted-foreground">VS</div>
          <HealthBar 
            health={opponent.health} 
            maxHealth={MAX_HEALTH} 
            playerName={opponent.name}
            isPlayer={false}
          />
        </div>
        
        {/* Battle Area */}
        <AnimatePresence mode="wait">
          {isPaused ? (
            <motion.div
              key="paused"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <Card className="p-8 bg-card/80 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-4">⏸️ Paused</h2>
                <p className="text-muted-foreground mb-6">Take a breather!</p>
                <Button size="lg" onClick={() => setIsPaused(false)}>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </Button>
              </Card>
            </motion.div>
          ) : gameOver ? (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <Card className="p-8 bg-card/80 backdrop-blur-sm">
                <h2 className={`text-4xl font-bold mb-4 ${winner === 'player' ? 'text-green-500' : 'text-red-500'}`}>
                  {winner === 'player' ? '🏆 Victory!' : '💀 Defeat!'}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {winner === 'player' 
                    ? `You defeated ${opponent.name}!` 
                    : `${opponent.name} won the battle!`}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/')}>
                    <Home className="w-5 h-5 mr-2" />
                    Home
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    <Swords className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8 bg-card/80 backdrop-blur-sm text-center">
                {/* Question */}
                <motion.div
                  key={currentQuestion?.displayText}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-8"
                >
                  <p className="text-6xl font-bold text-primary mb-4">
                    {currentQuestion?.displayText}
                  </p>
                  <p className="text-2xl text-muted-foreground">= ?</p>
                </motion.div>
                
                {/* Answer Input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="text-center text-3xl h-16 font-bold"
                    autoComplete="off"
                  />
                  <Button type="submit" size="lg" className="w-full text-xl h-14">
                    Attack!
                  </Button>
                </form>
                
                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-6 p-4 rounded-lg font-semibold ${
                        feedback.type === 'correct' 
                          ? 'bg-green-500/20 text-green-500'
                          : feedback.type === 'attack'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}
                    >
                      {feedback.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
