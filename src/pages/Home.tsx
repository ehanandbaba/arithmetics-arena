import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { GameSettings, DIFFICULTY_PRESETS, DifficultyPreset, GameMode } from '@/types/game';
import { getProgress, getDailyChallenge } from '@/utils/storage';
import { Brain, Trophy, Zap, Calendar, TrendingUp, Play, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Home = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());
  const [dailyChallenge, setDailyChallenge] = useState(getDailyChallenge());
  
  const [difficulty, setDifficulty] = useState<DifficultyPreset>('beginner');
  const [gameMode, setGameMode] = useState<GameMode>('multiplication');
  const [timerMode, setTimerMode] = useState<'per-question' | 'total'>('per-question');
  const [timeLimit, setTimeLimit] = useState(30);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3, 4, 5]);
  const [multiplierMin, setMultiplierMin] = useState(1);
  const [multiplierMax, setMultiplierMax] = useState(10);

  useEffect(() => {
    setProgress(getProgress());
    setDailyChallenge(getDailyChallenge());
  }, []);

  const applyDifficultyPreset = (preset: DifficultyPreset) => {
    setDifficulty(preset);
    const presetSettings = DIFFICULTY_PRESETS[preset];
    if (presetSettings.selectedTables) setSelectedTables(presetSettings.selectedTables);
    if (presetSettings.multiplierRange) {
      setMultiplierMin(presetSettings.multiplierRange.min);
      setMultiplierMax(presetSettings.multiplierRange.max);
    }
    if (presetSettings.timeLimit) setTimeLimit(presetSettings.timeLimit);
    if (presetSettings.timerMode) setTimerMode(presetSettings.timerMode);
  };

  const toggleTable = (table: number) => {
    setSelectedTables(prev =>
      prev.includes(table)
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
    setDifficulty('custom');
  };

  const startGame = (customSettings?: Partial<GameSettings>) => {
    if (!customSettings && selectedTables.length === 0) {
      alert('Please select at least one times table!');
      return;
    }

    const settings: GameSettings = {
      mode: gameMode,
      timeLimit,
      timerMode,
      selectedTables,
      multiplierRange: { min: multiplierMin, max: multiplierMax },
      difficulty,
      totalQuestions,
      ...customSettings
    };

    navigate('/game', { state: { settings } });
  };

  const startDailyChallenge = () => {
    navigate('/game', { 
      state: { 
        settings: dailyChallenge.settings,
        isDailyChallenge: true 
      } 
    });
  };

  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight pb-2">
            Times Tables Challenge
          </h1>
          <p className="text-xl text-muted-foreground">Master multiplication and division!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center bg-primary/5 border-primary/20">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Games Played</p>
            <p className="text-2xl font-bold text-primary">{progress.totalGamesPlayed}</p>
          </Card>
          <Card className="p-4 text-center bg-success/5 border-success/20">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Questions Answered</p>
            <p className="text-2xl font-bold text-success">{progress.totalQuestionsAnswered}</p>
          </Card>
          <Card className="p-4 text-center bg-accent/5 border-accent/20">
            <Zap className="w-6 h-6 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Best Streak</p>
            <p className="text-2xl font-bold text-accent">{progress.bestStreak}</p>
          </Card>
          <Card className="p-4 text-center bg-secondary/5 border-secondary/20">
            <Brain className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Achievements</p>
            <p className="text-2xl font-bold text-secondary">
              {progress.achievements.filter(a => a.unlocked).length}/{progress.achievements.length}
            </p>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 border-accent/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-accent" />
                <CardTitle className="text-2xl">Daily Challenge</CardTitle>
              </div>
              {dailyChallenge.completed ? (
                <Badge variant="outline" className="bg-success/20 text-success border-success">
                  ✓ Completed {dailyChallenge.score ? `${dailyChallenge.score.accuracy}%` : ''}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
                  50 Questions · 3s each
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {dailyChallenge.completed ? (
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Great job! Come back tomorrow for a new challenge.</p>
                {dailyChallenge.score && (
                  <p className="text-lg font-semibold text-success">
                    Score: {dailyChallenge.score.correct}/{dailyChallenge.score.total}
                  </p>
                )}
              </div>
            ) : (
              <Button onClick={startDailyChallenge} size="lg" className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Start Daily Challenge
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Start a Game</CardTitle>
            <CardDescription>Choose your settings and start practicing</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quick" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="quick">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Start
                </TabsTrigger>
                <TabsTrigger value="custom">
                  <Brain className="w-4 h-4 mr-2" />
                  Custom Game
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Choose Difficulty</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['beginner', 'intermediate', 'expert'] as DifficultyPreset[]).map(preset => (
                      <Card 
                        key={preset}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          difficulty === preset 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => applyDifficultyPreset(preset)}
                      >
                        <CardContent className="p-6 text-center space-y-2">
                          {preset === 'beginner' && <Brain className="w-10 h-10 mx-auto text-success" />}
                          {preset === 'intermediate' && <Trophy className="w-10 h-10 mx-auto text-primary" />}
                          {preset === 'expert' && <Zap className="w-10 h-10 mx-auto text-accent" />}
                          <h3 className="font-bold text-lg capitalize">{preset}</h3>
                          <p className="text-sm text-muted-foreground">
                            {preset === 'beginner' && 'Tables 1-5'}
                            {preset === 'intermediate' && 'Tables 6-10'}
                            {preset === 'expert' && 'Tables 11-20'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Game Mode</Label>
                  <RadioGroup value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="multiplication" id="mult" />
                      <Label htmlFor="mult" className="flex-1 cursor-pointer">✖️ Multiplication</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="division" id="div" />
                      <Label htmlFor="div" className="flex-1 cursor-pointer">➗ Division</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed" className="flex-1 cursor-pointer">🎲 Mixed</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={() => startGame()} size="lg" className="w-full text-lg h-14">
                  <Play className="w-6 h-6 mr-2" />
                  Start Game
                </Button>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Game Mode</Label>
                  <RadioGroup value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="multiplication" id="mult2" />
                      <Label htmlFor="mult2" className="flex-1 cursor-pointer">✖️ Multiplication</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="division" id="div2" />
                      <Label htmlFor="div2" className="flex-1 cursor-pointer">➗ Division</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="mixed" id="mixed2" />
                      <Label htmlFor="mixed2" className="flex-1 cursor-pointer">🎲 Mixed</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Timer Mode</Label>
                  <RadioGroup value={timerMode} onValueChange={(v) => setTimerMode(v as 'per-question' | 'total')}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="per-question" id="perq" />
                      <Label htmlFor="perq" className="flex-1 cursor-pointer">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Timer per question
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border">
                      <RadioGroupItem value="total" id="total" />
                      <Label htmlFor="total" className="flex-1 cursor-pointer">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Single timer for whole session
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">
                    {timerMode === 'per-question' ? 'Seconds per Question' : 'Total Time (seconds)'}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTimeLimit(Math.max(1, timeLimit - 5))}
                    >
                      -
                    </Button>
                    <div className="flex-1 text-center">
                      <p className="text-3xl font-bold">{timeLimit}s</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTimeLimit(Math.min(3600, timeLimit + 5))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {timerMode === 'total' && (
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Total Questions</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTotalQuestions(Math.max(5, totalQuestions - 5))}
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center">
                        <p className="text-3xl font-bold">{totalQuestions}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTotalQuestions(totalQuestions + 5)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Select Times Tables</Label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {tables.map(table => (
                      <Button
                        key={table}
                        variant={selectedTables.includes(table) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTable(table)}
                        className="h-12 text-lg"
                      >
                        {table}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Multiplier Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Minimum</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMultiplierMin(Math.max(1, multiplierMin - 1))}
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center">
                          <p className="text-2xl font-bold">{multiplierMin}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMultiplierMin(Math.min(multiplierMax - 1, multiplierMin + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Maximum</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMultiplierMax(Math.max(multiplierMin + 1, multiplierMax - 1))}
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center">
                          <p className="text-2xl font-bold">{multiplierMax}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setMultiplierMax(Math.min(10, multiplierMax + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => startGame()} size="lg" className="w-full text-lg h-14">
                  <Play className="w-6 h-6 mr-2" />
                  Start Custom Game
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/progress')}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
