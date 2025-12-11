import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BattleArena } from '@/components/battle/BattleArena';
import { BattleDifficulty, BattleSettings } from '@/types/battle';
import { Swords, User, Wifi, ArrowLeft } from 'lucide-react';

const Battle = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [settings, setSettings] = useState<BattleSettings>({
    mode: 'solo',
    difficulty: 'medium',
    playerName: ''
  });

  const handleStartGame = () => {
    if (!settings.playerName.trim()) {
      return;
    }
    setGameStarted(true);
  };

  if (gameStarted) {
    return (
      <BattleArena
        mode={settings.mode}
        difficulty={settings.difficulty}
        playerName={settings.playerName}
        opponentName={settings.mode === 'solo' ? 'CPU' : 'Opponent'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-primary/10 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-destructive via-primary to-accent bg-clip-text text-transparent leading-tight pb-2 flex items-center justify-center gap-3">
              <Swords className="w-10 h-10 text-destructive" />
              Math Battle
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Race to answer math questions and defeat your opponent!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
              <CardDescription>Configure your battle preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Player Name */}
              <div className="space-y-2">
                <Label htmlFor="playerName">Your Name</Label>
                <Input
                  id="playerName"
                  placeholder="Enter your name"
                  value={settings.playerName}
                  onChange={(e) => setSettings({ ...settings, playerName: e.target.value })}
                  className="text-lg"
                />
              </div>

              {/* Game Mode */}
              <div className="space-y-3">
                <Label>Game Mode</Label>
                <Tabs 
                  value={settings.mode} 
                  onValueChange={(v) => setSettings({ ...settings, mode: v as 'solo' | 'online' })}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solo" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Solo
                    </TabsTrigger>
                    <TabsTrigger value="online" className="flex items-center gap-2" disabled>
                      <Wifi className="w-4 h-4" />
                      Online (Soon)
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="solo" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Battle against the CPU! Answer questions faster than the computer to deal damage.
                    </p>
                  </TabsContent>
                  <TabsContent value="online" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Online multiplayer coming soon! Battle against real players.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <Label>Difficulty</Label>
                <RadioGroup
                  value={settings.difficulty}
                  onValueChange={(v) => setSettings({ ...settings, difficulty: v as BattleDifficulty })}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="easy" id="easy" className="peer sr-only" />
                    <Label
                      htmlFor="easy"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-pointer"
                    >
                      <span className="text-2xl mb-1">🌱</span>
                      <span className="font-semibold">Easy</span>
                      <span className="text-xs text-muted-foreground">1-6</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                    <Label
                      htmlFor="medium"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500 cursor-pointer"
                    >
                      <span className="text-2xl mb-1">⚡</span>
                      <span className="font-semibold">Medium</span>
                      <span className="text-xs text-muted-foreground">1-10</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="hard" id="hard" className="peer sr-only" />
                    <Label
                      htmlFor="hard"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-500 [&:has([data-state=checked])]:border-red-500 cursor-pointer"
                    >
                      <span className="text-2xl mb-1">🔥</span>
                      <span className="font-semibold">Hard</span>
                      <span className="text-xs text-muted-foreground">1-12</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Rules */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h3 className="font-semibold">Battle Rules:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Both players start with 60 HP</li>
                  <li>• Answer faster than your opponent to deal 2 damage</li>
                  <li>• Wrong answers don't deal damage but waste time</li>
                  <li>• First to reduce opponent to 0 HP wins!</li>
                  <li>• Operations: +, -, ×, ÷ (numbers 1-12)</li>
                </ul>
              </div>

              {/* Start Button */}
              <Button 
                onClick={handleStartGame} 
                size="lg" 
                className="w-full text-xl h-14"
                disabled={!settings.playerName.trim()}
              >
                <Swords className="w-6 h-6 mr-2" />
                Start Battle!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Battle;
