import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { GameSettings } from '@/types/game';
import { ArrowLeft, Play } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'multiplication',
    timeLimit: 30,
    selectedTables: [2, 3, 4, 5],
    multiplierRange: { min: 1, max: 10 }
  });

  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  const toggleTable = (table: number) => {
    setSettings(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(table)
        ? prev.selectedTables.filter(t => t !== table)
        : [...prev.selectedTables, table]
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
          <CardContent className="space-y-8">
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

            {/* Time Limit */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Time Limit: {settings.timeLimit} seconds per question
              </Label>
              <Slider
                value={[settings.timeLimit]}
                onValueChange={([value]) => setSettings({ ...settings, timeLimit: value })}
                min={10}
                max={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10s</span>
                <span>60s</span>
              </div>
            </div>

            {/* Multiplier Range */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Multiplier Range: {settings.multiplierRange.min} - {settings.multiplierRange.max}
              </Label>
              <Slider
                value={[settings.multiplierRange.min, settings.multiplierRange.max]}
                onValueChange={([min, max]) => setSettings({ ...settings, multiplierRange: { min, max } })}
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
                    onClick={() => setSettings({ ...settings, selectedTables: tables })}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettings({ ...settings, selectedTables: [] })}
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

            <Button
              size="lg"
              onClick={startGame}
              className="w-full text-xl py-6 h-auto"
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
