import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GameSettings, Question, GameStats } from '@/types/game';
import { generateQuestion } from '@/utils/questionGenerator';
import { Clock, Trophy, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings as GameSettings;
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    correct: 0,
    incorrect: 0,
    totalQuestions: 0,
    questionsAnswered: []
  });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (!settings) {
      navigate('/settings');
      return;
    }
    generateNewQuestion();
  }, [settings, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestion && !feedback) {
      handleTimeout();
    }
  }, [timeLeft, feedback, currentQuestion]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestion]);

  const generateNewQuestion = () => {
    const question = generateQuestion(settings);
    setCurrentQuestion(question);
    setUserAnswer('');
    setTimeLeft(settings.timeLimit);
    setFeedback(null);
  };

  const handleTimeout = () => {
    if (!currentQuestion) return;
    
    setFeedback('incorrect');
    setStats(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1,
      totalQuestions: prev.totalQuestions + 1,
      questionsAnswered: [...prev.questionsAnswered, currentQuestion]
    }));

    toast.error('Time\'s up! ⏰', {
      description: `The answer was ${currentQuestion.answer}`
    });

    setTimeout(() => {
      generateNewQuestion();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || feedback) return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentQuestion.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      totalQuestions: prev.totalQuestions + 1,
      questionsAnswered: [...prev.questionsAnswered, currentQuestion]
    }));

    if (isCorrect) {
      toast.success('Correct! 🎉', {
        description: 'Great job!'
      });
    } else {
      toast.error('Incorrect 😔', {
        description: `The answer was ${currentQuestion.answer}`
      });
    }

    setTimeout(() => {
      generateNewQuestion();
    }, 1500);
  };

  const endGame = () => {
    navigate('/results', { state: { stats } });
  };

  if (!currentQuestion) return null;

  const operatorSymbol = currentQuestion.operation === 'multiplication' ? '×' : '÷';
  const progressPercentage = stats.totalQuestions > 0 
    ? (stats.correct / stats.totalQuestions) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Score</span>
            </div>
            <p className="text-2xl font-bold text-success">{stats.correct}</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <X className="w-5 h-5 text-destructive" />
              <span className="text-sm text-muted-foreground">Missed</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.incorrect}</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Time</span>
            </div>
            <p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
              {timeLeft}s
            </p>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Accuracy</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success to-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Question Card */}
        <Card className={`p-8 md:p-12 transition-all duration-300 ${
          feedback === 'correct' ? 'bg-success/10 border-success' : 
          feedback === 'incorrect' ? 'bg-destructive/10 border-destructive' : ''
        }`}>
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="text-6xl md:text-8xl font-bold text-foreground flex items-center justify-center gap-4">
                <span>{currentQuestion.num1}</span>
                <span className="text-primary">{operatorSymbol}</span>
                <span>{currentQuestion.num2}</span>
                <span className="text-muted-foreground">=</span>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <Input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={!!feedback}
                  className="text-center text-4xl md:text-5xl h-20 font-bold"
                  placeholder="?"
                  autoComplete="off"
                />
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!userAnswer || !!feedback}
                    className="flex-1 text-xl h-14"
                  >
                    {feedback ? (
                      feedback === 'correct' ? (
                        <><Check className="w-5 h-5 mr-2" /> Correct!</>
                      ) : (
                        <><X className="w-5 h-5 mr-2" /> Incorrect</>
                      )
                    ) : (
                      'Submit'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={endGame}
                    className="text-xl h-14"
                  >
                    End Game
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Game;
