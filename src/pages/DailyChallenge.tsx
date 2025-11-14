import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getDailyChallenge } from '@/utils/storage';
import { DailyChallenge as DailyChallengeType } from '@/types/dailyChallenge';
import { ArrowLeft, Calendar, Play, CheckCircle } from 'lucide-react';

const DailyChallenge = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<DailyChallengeType | null>(null);

  useEffect(() => {
    setChallenge(getDailyChallenge());
  }, []);

  if (!challenge) return null;

  const startChallenge = () => {
    navigate('/game', { state: { settings: challenge.settings, isDailyChallenge: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-4xl">Daily Challenge</CardTitle>
            <CardDescription>
              {new Date(challenge.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {challenge.completed ? (
              <div className="text-center p-8 bg-success/5 rounded-xl border-2 border-success/20">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-success mb-2">Challenge Completed!</h3>
                <p className="text-lg mb-4">
                  Score: {challenge.score?.accuracy}% ({challenge.score?.correct}/{challenge.score?.total})
                </p>
                <p className="text-muted-foreground">Come back tomorrow for a new challenge!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Mode</p>
                    <p className="text-lg font-bold capitalize">{challenge.settings.mode}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Time Limit</p>
                    <p className="text-lg font-bold">{challenge.settings.timeLimit}s</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Tables</p>
                    <p className="text-lg font-bold">{challenge.settings.selectedTables.join(', ')}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Range</p>
                    <p className="text-lg font-bold">
                      {challenge.settings.multiplierRange.min}-{challenge.settings.multiplierRange.max}
                    </p>
                  </Card>
                </div>

                <Button size="lg" onClick={startChallenge} className="w-full text-xl py-6 h-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyChallenge;
