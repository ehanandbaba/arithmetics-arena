import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getProgress, resetProgress } from '@/utils/storage';
import { GameProgress } from '@/types/achievements';
import { ArrowLeft, Trophy, Target, TrendingUp, Award, Clock, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Progress = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const handleReset = () => {
    resetProgress();
    setProgress(getProgress());
  };

  if (!progress) return null;

  const accuracy = progress.totalQuestionsAnswered > 0
    ? Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100)
    : 0;

  const unlockedAchievements = progress.achievements.filter(a => a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your progress, achievements, and game history. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Your Progress</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center bg-primary/5 border-primary/20">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Games Played</p>
                <p className="text-3xl font-bold text-primary">{progress.totalGamesPlayed}</p>
              </Card>

              <Card className="p-4 text-center bg-success/5 border-success/20">
                <Target className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Questions Answered</p>
                <p className="text-3xl font-bold text-success">{progress.totalQuestionsAnswered}</p>
              </Card>

              <Card className="p-4 text-center bg-secondary/5 border-secondary/20">
                <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-secondary">{accuracy}%</p>
              </Card>

              <Card className="p-4 text-center bg-destructive/5 border-destructive/20">
                <Award className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Best Streak</p>
                <p className="text-3xl font-bold text-destructive">{progress.bestStreak}</p>
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Achievements ({unlockedAchievements.length}/{progress.achievements.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {progress.achievements.map((achievement) => (
                  <Card 
                    key={achievement.id}
                    className={`p-4 text-center transition-all ${
                      achievement.unlocked 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-primary mt-2">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Games */}
            {progress.gameHistory.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Games
                </h3>
                <div className="space-y-2">
                  {progress.gameHistory.slice(0, 10).map((game) => (
                    <Card key={game.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{game.mode} Mode</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(game.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{game.accuracy}%</p>
                          <p className="text-sm text-muted-foreground">
                            {game.correct}/{game.correct + game.incorrect}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
