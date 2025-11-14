import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { GameSettings, DIFFICULTY_PRESETS, DifficultyPreset } from '@/types/game';
import { ArrowLeft, Play, Zap, Brain, Trophy, Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'multiplication',
    timeLimit: 30,
    timerMode: 'per-question',
    selectedTables: [2, 3, 4, 5],
    multiplierRange: { min: 1, max: 10 },
    difficulty: 'custom',
    totalQuestions: 20
  });

  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  const applyDifficultyPreset = (preset: DifficultyPreset) => {
    const presetSettings = DIFFICULTY_PRESETS[preset];
    setSettings(prev => ({
      ...prev,
      ...presetSettings,
      mode: prev.mode,
      difficulty: preset
    }));
  };

  const toggleTable = (table: number) => {
    setSettings(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(table)
        ? prev.selectedTables.filter(t => t !== table)
        : [...prev.selectedTables, table],
      difficulty: 'custom'
    }));
  };

  const startGame = () => {
    if (settings.selectedTables.length === 0) {
      alert('Please select at least one times table!');
      return;
    }
    navigate('/game', { state: { settings } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Game Settings</CardTitle>
            <CardDescription>Customize your practice session</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quick" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="quick" className="text-base">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Start
                </TabsTrigger>
                <TabsTrigger value="custom" className="text-base">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Custom
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-6">
                {/* Difficulty Presets */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Choose Difficulty</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        settings.difficulty === 'beginner' 
                          ? 'border-success bg-success/5 shadow-md' 
                          : 'border-border hover:border-success/50'
                      }`}
                      onClick={() => applyDifficultyPreset('beginner')}
                    >
                      <CardContent className="p-6 text-center space-y-2">
                        <Brain className="w-10 h-10 mx-auto text-success" />
                        <h3 className="font-bold text-lg">Beginner</h3>
                        <p className="text-sm text-muted-foreground">Tables 1-5</p>
                        <p className="text-xs text-muted-foreground">30s per question</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        settings.difficulty === 'intermediate' 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => applyDifficultyPreset('intermediate')}
                    >
                      <CardContent className="p-6 text-center space-y-2">
                        <Zap className="w-10 h-10 mx-auto text-primary" />
                        <h3 className="font-bold text-lg">Intermediate</h3>
                        <p className="text-sm text-muted-foreground">Tables 6-10</p>
                        <p className="text-xs text-muted-foreground">20s per question</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        settings.difficulty === 'expert' 
                          ? 'border-destructive bg-destructive/5 shadow-md' 
                          : 'border-border hover:border-destructive/50'
                      }`}
                      onClick={() => applyDifficultyPreset('expert')}
                    >
                      <CardContent className="p-6 text-center space-y-2">
                        <Trophy className="w-10 h-10 mx-auto text-destructive" />
                        <h3 className="font-bold text-lg">Expert</h3>
                        <p className="text-sm text-muted-foreground">Tables 11-20</p>
                        <p className="text-xs text-muted-foreground">15s per question</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Game Mode */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Game Mode</Label>
                  <RadioGroup
                    value={settings.mode}
                    onValueChange={(value) => setSettings({ ...settings, mode: value as GameSettings['mode'] })}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    <Label
                      htmlFor="multiplication"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.mode === 'multiplication' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="multiplication" id="multiplication" />
                      <span className="text-2xl mr-2">✖️</span>
                      <span>Multiplication</span>
                    </Label>
                    <Label
                      htmlFor="division"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.mode === 'division' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="division" id="division" />
                      <span className="text-2xl mr-2">➗</span>
                      <span>Division</span>
                    </Label>
                    <Label
                      htmlFor="mixed"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.mode === 'mixed' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="mixed" id="mixed" />
                      <span className="text-2xl mr-2">🎲</span>
                      <span>Mixed</span>
                    </Label>
                  </RadioGroup>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                {/* Timer Mode */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Timer Mode</Label>
                  <RadioGroup
                    value={settings.timerMode}
                    onValueChange={(value) => setSettings({ ...settings, timerMode: value as 'per-question' | 'total' })}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="per-question"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.timerMode === 'per-question' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="per-question" id="per-question" />
                      <div>
                        <div className="font-semibold">Per Question</div>
                        <div className="text-xs text-muted-foreground">Timer resets for each question</div>
                      </div>
                    </Label>
                    <Label
                      htmlFor="total"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.timerMode === 'total' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="total" id="total" />
                      <div>
                        <div className="font-semibold">Total Time</div>
                        <div className="text-xs text-muted-foreground">One timer for all questions</div>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Time Limit */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    {settings.timerMode === 'per-question' 
                      ? `Time per Question: ${settings.timeLimit} seconds`
                      : `Total Time: ${Math.floor(settings.timeLimit / 60)}m ${settings.timeLimit % 60}s`
                    }
                  </Label>
                  <Slider
                    value={[settings.timeLimit]}
                    onValueChange={([value]) => setSettings({ ...settings, timeLimit: value, difficulty: 'custom' })}
                    min={settings.timerMode === 'per-question' ? 1 : 60}
                    max={settings.timerMode === 'per-question' ? 60 : 3600}
                    step={settings.timerMode === 'per-question' ? 1 : 30}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{settings.timerMode === 'per-question' ? '1s' : '1m'}</span>
                    <span>{settings.timerMode === 'per-question' ? '60s' : '1h'}</span>
                  </div>
                </div>

                {settings.timerMode === 'total' && (
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Number of Questions: {settings.totalQuestions}
                    </Label>
                    <Slider
                      value={[settings.totalQuestions || 20]}
                      onValueChange={([value]) => setSettings({ ...settings, totalQuestions: value, difficulty: 'custom' })}
                      min={5}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 questions</span>
                      <span>50 questions</span>
                    </div>
                  </div>
                )}

                {/* Multiplier Range */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    Multiplier Range: {settings.multiplierRange.min} - {settings.multiplierRange.max}
                  </Label>
                  <Slider
                    value={[settings.multiplierRange.min, settings.multiplierRange.max]}
                    onValueChange={([min, max]) => setSettings({ ...settings, multiplierRange: { min, max }, difficulty: 'custom' })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Times Tables Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Select Times Tables</Label>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings({ ...settings, selectedTables: tables, difficulty: 'custom' })}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings({ ...settings, selectedTables: [], difficulty: 'custom' })}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {tables.map(table => (
                      <Button
                        key={table}
                        variant={settings.selectedTables.includes(table) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTable(table)}
                        className="h-12 text-base font-semibold"
                      >
                        {table}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Game Mode */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Game Mode</Label>
                  <RadioGroup
                    value={settings.mode}
                    onValueChange={(value) => setSettings({ ...settings, mode: value as GameSettings['mode'] })}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    <Label
                      htmlFor="mult"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.mode === 'multiplication' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="multiplication" id="mult" />
                      <span className="text-2xl mr-2">✖️</span>
                      <span>Multiplication</span>
                    </Label>
                    <Label
                      htmlFor="div"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.mode === 'division' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="division" id="div" />
                      <span className="text-2xl mr-2">➗</span>
                      <span>Division</span>
                    </Label>
                    <Label
                      htmlFor="mix"
                      className={`flex items-center space-x-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        settings.mode === 'mixed' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value="mixed" id="mix" />
                      <span className="text-2xl mr-2">🎲</span>
                      <span>Mixed</span>
                    </Label>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              size="lg"
              onClick={startGame}
              className="w-full text-xl py-6 h-auto mt-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
