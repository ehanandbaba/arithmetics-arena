import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameStats } from '@/types/game';
import { Trophy, Target, TrendingUp, Home, Play, Sparkles, Zap } from 'lucide-react';
import { saveGameResult, checkPersonalBests, getProgress } from '@/utils/storage';
import { saveDailyChallenge, getDailyChallenge } from '@/utils/storage';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stats = location.state?.stats as GameStats;
  const settings = location.state?.settings;
  const isDailyChallenge = location.state?.isDailyChallenge;

  useEffect(() => {
    if (!stats) {
      navigate('/');
      return;
    }

    // Save game result
    saveGameResult(stats, settings, stats.unlockedAchievements);

    // Update daily challenge if applicable
    if (isDailyChallenge) {
      const challenge = getDailyChallenge();
      const accuracy = stats.totalQuestions > 0 
        ? Math.round((stats.correct / stats.totalQuestions) * 100) 
        : 0;
      
      challenge.completed = true;
      challenge.score = {
        correct: stats.correct,
        total: stats.totalQuestions,
        accuracy
      };
      saveDailyChallenge(challenge);
    }
  }, [stats, settings, isDailyChallenge]);

  if (!stats) {
    navigate('/');
    return null;
  }

  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correct / stats.totalQuestions) * 100) 
    : 0;

  const personalBests = checkPersonalBests(stats);
  const progress = getProgress();
  const newlyUnlockedAchievements = stats.unlockedAchievements.map(id => 
    progress.achievements.find(a => a.id === id)
  ).filter(Boolean);

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
        {/* Personal Bests Banner */}
        {personalBests.length > 0 && (
          <Card className="p-6 text-center bg-gradient-to-r from-accent/20 via-primary/20 to-success/20 border-accent animate-scale-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              <h2 className="text-3xl font-bold text-accent">NEW PERSONAL BEST!</h2>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-lg font-semibold">
              {personalBests.join(' & ')} 🎯
            </p>
          </Card>
        )}

        {/* Main Results Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl mb-2">
              {isDailyChallenge ? 'Daily Challenge Complete!' : 'Game Complete!'}
            </CardTitle>
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

            {/* Newly Unlocked Achievements */}
            {newlyUnlockedAchievements.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold text-accent">New Achievements!</h3>
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newlyUnlockedAchievements.map((achievement: any) => (
                    <Card 
                      key={achievement.id} 
                      className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 animate-scale-in"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/')}
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
