import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Brain className="w-24 h-24 text-primary animate-pulse" />
              <Sparkles className="w-8 h-8 text-secondary absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Times Tables Challenge
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Master multiplication and division with fun, timed challenges!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate('/settings')}
            className="text-xl px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Start Playing
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 text-sm">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold mb-1">Choose Your Challenge</h3>
            <p className="text-muted-foreground text-xs">Select tables from 1-20 and customize your practice</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="font-bold mb-1">Beat the Clock</h3>
            <p className="text-muted-foreground text-xs">Race against time with customizable timers</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold mb-1">Track Progress</h3>
            <p className="text-muted-foreground text-xs">See your score and improve with every game</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
