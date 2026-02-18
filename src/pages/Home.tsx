import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Gamepad2, Monitor, Route, Gauge, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4 text-center">
          <h1 className="text-5xl font-black tracking-tight md:text-6xl">Nitro Streets Arena</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Pick a sports car driver, hit the road, dodge hazards, and push your speedometer to the limit.
          </p>
          <Button size="lg" className="text-base" onClick={() => navigate('/game')}>
            <Gamepad2 className="mr-2 h-5 w-5" />
            Play on PC
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-700 bg-slate-900/80 p-5">
            <Car className="mb-3 h-8 w-8 text-cyan-300" />
            <h2 className="text-xl font-bold">Sports Cars</h2>
            <p className="mt-2 text-sm text-slate-300">Three high-performance cars with unique acceleration, top speed, and handling.</p>
          </Card>
          <Card className="border-slate-700 bg-slate-900/80 p-5">
            <Users className="mb-3 h-8 w-8 text-purple-300" />
            <h2 className="text-xl font-bold">Drivers</h2>
            <p className="mt-2 text-sm text-slate-300">Choose your favorite driver and race style before every run.</p>
          </Card>
          <Card className="border-slate-700 bg-slate-900/80 p-5">
            <Gauge className="mb-3 h-8 w-8 text-amber-300" />
            <h2 className="text-xl font-bold">Live Speedometer</h2>
            <p className="mt-2 text-sm text-slate-300">Track real-time speed, nitro level, score, and road progress in one dashboard.</p>
          </Card>
        </section>

        <Card className="space-y-3 border-cyan-500/50 bg-cyan-500/10 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Route className="h-6 w-6" />
            Controls & Compatibility
          </h2>
          <ul className="space-y-1 text-slate-100">
            <li>• Arrow Left / Right: switch lanes</li>
            <li>• Space: hold nitro boost</li>
            <li>• Enter: start race</li>
            <li>• R: retry after crash or finish</li>
          </ul>
          <p className="flex items-center gap-2 text-sm text-cyan-100">
            <Monitor className="h-4 w-4" />
            Optimized for desktop browsers, including Windows 11 Home 25H2 PCs.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
