import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, Trophy, Settings, Calendar, Zap } from "lucide-react";
import { DIFFICULTY_PRESETS, type DifficultyPreset } from "@/types/game";
import { getProgress, getDailyChallenge } from "@/utils/storage";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [hasNewDaily, setHasNewDaily] = useState(false);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  useEffect(() => {
    const dailyChallenge = getDailyChallenge();
    setHasNewDaily(!dailyChallenge.completed);
    
    const progress = getProgress();
    setTotalGamesPlayed(progress.totalGamesPlayed);
  }, []);

  const handleQuickStart = (preset: DifficultyPreset) => {
    const settings = {
      ...DIFFICULTY_PRESETS[preset],
      mode: 'mixed' as const,
      timeLimit: 30,
      timerMode: 'per-question' as const,
    };
    navigate("/game", { state: { settings } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Times Tables Challenge
          </h1>
          <p className="text-muted-foreground text-lg">
            Master multiplication and division with fun!
          </p>
        </div>

        {/* Stats Summary */}
        {totalGamesPlayed > 0 && (
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-center">
                <Trophy className="h-5 w-5 text-accent" />
                <p className="text-lg">
                  <span className="font-bold text-2xl text-primary">{totalGamesPlayed}</span>
                  <span className="text-muted-foreground ml-2">games played!</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Challenge */}
        {hasNewDaily && (
          <Card className="border-2 border-accent bg-gradient-to-r from-accent/10 to-accent/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-accent" />
                  <CardTitle>Daily Challenge</CardTitle>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-semibold">
                  NEW
                </span>
              </div>
              <CardDescription>Complete today's special challenge!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/daily-challenge")} 
                className="w-full"
                size="lg"
              >
                Start Daily Challenge
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Start - Difficulty Presets */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle>Quick Start</CardTitle>
            </div>
            <CardDescription>Choose your difficulty level and play instantly!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleQuickStart('beginner')}
              variant="outline"
              size="lg"
              className="w-full justify-start text-left h-auto py-4"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">🌱 Beginner</div>
                <div className="text-sm text-muted-foreground">Tables 1-5</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleQuickStart('intermediate')}
              variant="outline"
              size="lg"
              className="w-full justify-start text-left h-auto py-4"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">⚡ Intermediate</div>
                <div className="text-sm text-muted-foreground">Tables 6-10</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleQuickStart('expert')}
              variant="outline"
              size="lg"
              className="w-full justify-start text-left h-auto py-4"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">🚀 Expert</div>
                <div className="text-sm text-muted-foreground">Tables 11-20</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/settings")}>
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle>Custom Game</CardTitle>
              <CardDescription>Create your own challenge</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/progress")}>
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 mx-auto text-accent mb-2" />
              <CardTitle>Progress</CardTitle>
              <CardDescription>View stats & achievements</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/settings")}>
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
