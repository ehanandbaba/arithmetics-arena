import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameStats } from '@/types/game';
import { Trophy, Target, TrendingUp, Home, Play } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stats = location.state?.stats as GameStats;

  if (!stats) {
    navigate('/');
    return null;
  }

  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correct / stats.totalQuestions) * 100) 
    : 0;

  const getMessage = () => {
    if (accuracy >= 90) return { text: 'Outstanding! 🌟', color: 'text-success' };
    if (accuracy >= 75) return { text: 'Great Job! 🎉', color: 'text-primary' };
    if (accuracy >= 50) return { text: 'Good Effort! 💪', color: 'text-secondary' };
    return { text: 'Keep Practicing! 📚', color: 'text-muted-foreground' };
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl mb-2">Game Complete!</CardTitle>
            <p className={`text-3xl font-bold ${message.color}`}>{message.text}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 text-center bg-success/5 border-success/20">
                <Target className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                <p className="text-4xl font-bold text-success">{stats.correct}</p>
              </Card>
              
              <Card className="p-6 text-center bg-destructive/5 border-destructive/20">
                <TrendingUp className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Incorrect Answers</p>
                <p className="text-4xl font-bold text-destructive">{stats.incorrect}</p>
              </Card>
              
              <Card className="p-6 text-center bg-primary/5 border-primary/20">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="text-4xl font-bold text-primary">{accuracy}%</p>
              </Card>
            </div>

            {/* Accuracy Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-success via-primary to-secondary transition-all duration-500"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                You answered {stats.totalQuestions} questions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/settings')}
                className="flex-1 text-lg h-14"
              >
                <Play className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/')}
                className="flex-1 text-lg h-14"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Encouragement Message */}
        <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <p className="text-lg font-medium">
            {accuracy >= 90 && "You're a times tables master! Keep up the amazing work! 🏆"}
            {accuracy >= 75 && accuracy < 90 && "You're doing fantastic! A bit more practice and you'll be unstoppable! 💫"}
            {accuracy >= 50 && accuracy < 75 && "Good progress! Keep practicing and you'll see improvement! 🌟"}
            {accuracy < 50 && "Every expert was once a beginner. Keep practicing and you'll get better! 🚀"}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Results;
