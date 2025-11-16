import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GameSettings, Question, GameStats } from '@/types/game';
import { generateQuestion } from '@/utils/questionGenerator';
import { Clock, X, Check, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import { savePausedGame, clearPausedGame, unlockAchievement, getPausedGame } from '@/utils/storage';

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings as GameSettings;
  const isDailyChallenge = location.state?.isDailyChallenge;
  const inputRef = useRef<HTMLInputElement>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Redirect if no settings
  useEffect(() => {
    if (!settings) {
      navigate('/');
    }
  }, [settings, navigate]);

  // Early return if no settings to prevent crashes
  if (!settings) {
    return null;
  }

  const pausedGame = getPausedGame();
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<GameStats>(pausedGame?.stats || {
    correct: 0,
    incorrect: 0,
    totalQuestions: 0,
    questionsAnswered: [],
    currentStreak: 0,
    bestStreak: 0,
    averageTime: 0,
    fastestAnswer: Infinity,
    answerTimes: [],
    unlockedAchievements: []
  });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [questionsCompleted, setQuestionsCompleted] = useState(pausedGame?.questionsCompleted || 0);

  const effectiveSettings = isDailyChallenge ? {
    ...settings,
    totalQuestions: 50,
    timeLimit: 3,
    timerMode: 'per-question' as const
  } : settings;

  const totalQuestions = effectiveSettings.timerMode === 'total' 
    ? effectiveSettings.totalQuestions || 20 
    : Infinity;


  useEffect(() => {
    if (pausedGame) {
      setCurrentQuestion(pausedGame.currentQuestion);
      setTimeLeft(pausedGame.timeLeft);
      setTotalTimeLeft(pausedGame.totalTimeLeft);
      setQuestionsCompleted(pausedGame.questionsCompleted);
      clearPausedGame();
    } else {
      generateNewQuestion();
      if (effectiveSettings.timerMode === 'total') {
        setTotalTimeLeft(effectiveSettings.timeLimit);
      }
    }
  }, []);

  useEffect(() => {
    if (isPaused || feedback) return;

    const timer = setInterval(() => {
      if (effectiveSettings.timerMode === 'per-question') {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTotalTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, feedback, effectiveSettings.timerMode]);

  useEffect(() => {
    if (!isPaused) {
      inputRef.current?.focus();
    }
  }, [currentQuestion, isPaused]);

  const generateNewQuestion = () => {
    const question = generateQuestion(effectiveSettings);
    setCurrentQuestion(question);
    setUserAnswer('');
    if (effectiveSettings.timerMode === 'per-question') {
      setTimeLeft(effectiveSettings.timeLimit);
    }
    setFeedback(null);
    questionStartTimeRef.current = Date.now();
  };

  const checkAchievements = (updatedStats: GameStats) => {
    const newAchievements: string[] = [];

    if (updatedStats.totalQuestions === 1 && !stats.unlockedAchievements.includes('first_game')) {
      newAchievements.push('first_game');
      toast.success('Achievement Unlocked! 🎮', { description: 'Getting Started' });
    }

    if (updatedStats.currentStreak === 5 && !stats.unlockedAchievements.includes('streak_5')) {
      newAchievements.push('streak_5');
      toast.success('Achievement Unlocked! 🔥', { description: '5 in a Row!' });
    }

    if (updatedStats.currentStreak === 10 && !stats.unlockedAchievements.includes('streak_10')) {
      newAchievements.push('streak_10');
      toast.success('Achievement Unlocked! ⚡', { description: '10 in a Row!' });
    }

    const answerTime = (Date.now() - questionStartTimeRef.current) / 1000;
    if (answerTime < 3 && !stats.unlockedAchievements.includes('speed_master')) {
      newAchievements.push('speed_master');
      toast.success('Achievement Unlocked! 🚀', { description: 'Speed Master!' });
    }

    return newAchievements;
  };

  const handleTimeout = () => {
    if (!currentQuestion) return;
    
    setFeedback('incorrect');
    const updatedStats = {
      ...stats,
      incorrect: stats.incorrect + 1,
      totalQuestions: stats.totalQuestions + 1,
      questionsAnswered: [...stats.questionsAnswered, currentQuestion],
      currentStreak: 0,
      answerTimes: [...stats.answerTimes, effectiveSettings.timeLimit]
    };
    setStats(updatedStats);
    setQuestionsCompleted(prev => prev + 1);

    toast.error('Time\'s up! ⏰', {
      description: `The answer was ${currentQuestion.answer}`
    });

    setTimeout(() => {
      if (effectiveSettings.timerMode === 'total' || questionsCompleted + 1 < totalQuestions) {
        generateNewQuestion();
      } else {
        endGame();
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || feedback || isPaused) return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentQuestion.answer;
    const answerTime = (Date.now() - questionStartTimeRef.current) / 1000;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    const updatedStats = {
      ...stats,
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1),
      totalQuestions: stats.totalQuestions + 1,
      questionsAnswered: [...stats.questionsAnswered, currentQuestion],
      currentStreak: isCorrect ? stats.currentStreak + 1 : 0,
      bestStreak: isCorrect ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak,
      fastestAnswer: isCorrect ? Math.min(stats.fastestAnswer, answerTime) : stats.fastestAnswer,
      answerTimes: [...stats.answerTimes, answerTime],
      unlockedAchievements: stats.unlockedAchievements
    };

    if (isCorrect) {
      const newAchievements = checkAchievements(updatedStats);
      updatedStats.unlockedAchievements = [...updatedStats.unlockedAchievements, ...newAchievements];
      newAchievements.forEach(id => unlockAchievement(id));
    }

    setStats(updatedStats);
    setQuestionsCompleted(prev => prev + 1);

    if (isCorrect) {
      toast.success('Correct! 🎉', {
        description: updatedStats.currentStreak > 1 ? `${updatedStats.currentStreak} in a row!` : 'Great job!'
      });
    } else {
      toast.error('Incorrect 😔', {
        description: `The answer was ${currentQuestion.answer}`
      });
    }

    setTimeout(() => {
      if (effectiveSettings.timerMode === 'total' || questionsCompleted + 1 < totalQuestions) {
        generateNewQuestion();
      } else {
        endGame();
      }
    }, 1500);
  };

  const handlePause = () => {
    setIsPaused(true);
    savePausedGame({
      settings: effectiveSettings,
      stats,
      currentQuestion,
      timeLeft,
      totalTimeLeft,
      questionsCompleted,
      isDailyChallenge
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    questionStartTimeRef.current = Date.now();
  };

  const endGame = () => {
    clearPausedGame();
    navigate('/results', { 
      state: { 
        stats, 
        settings: effectiveSettings,
        isDailyChallenge 
      } 
    });
  };

  if (!currentQuestion) return null;

  const operatorSymbol = currentQuestion.operation === 'multiplication' ? '×' : '÷';
  const progressPercentage = stats.totalQuestions > 0 
    ? (stats.correct / stats.totalQuestions) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold text-success">{stats.correct}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Missed</p>
                <p className="text-2xl font-bold text-destructive">{stats.incorrect}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-2xl font-bold text-primary">
                  {effectiveSettings.timerMode === 'per-question' ? timeLeft : totalTimeLeft}s
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success via-primary to-secondary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {effectiveSettings.timerMode === 'total' 
                  ? `Questions: ${questionsCompleted} / ${totalQuestions}`
                  : `Question ${questionsCompleted + 1}`
                }
              </span>
              {stats.currentStreak > 0 && (
                <span className="text-accent font-bold">🔥 {stats.currentStreak} streak</span>
              )}
            </div>
          </div>
        </Card>

        {isPaused && (
          <Card className="p-8 text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold">Game Paused</h2>
            <p className="text-muted-foreground">Take a break! Your progress is saved.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleResume} size="lg">
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
              <Button variant="outline" onClick={endGame} size="lg">
                End Game
              </Button>
            </div>
          </Card>
        )}

        {!isPaused && (
          <Card className="p-8 text-center space-y-6 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl font-bold text-primary">
                {currentQuestion.num1} {operatorSymbol} {currentQuestion.num2}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="text-4xl text-center h-20 text-foreground"
                  disabled={feedback !== null}
                />
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 text-xl h-16"
                    disabled={!userAnswer || feedback !== null}
                  >
                    <Check className="w-6 h-6 mr-2" />
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handlePause}
                    className="h-16 px-8"
                  >
                    <Pause className="w-6 h-6" />
                  </Button>
                </div>
              </form>
            </div>

            <Button
              variant="outline"
              onClick={endGame}
              className="w-full"
            >
              End Game
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Game;
