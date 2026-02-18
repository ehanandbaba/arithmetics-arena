import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Gauge, Timer, Trophy } from 'lucide-react';

type Driver = {
  name: string;
  color: string;
  maxSpeed: number;
  acceleration: number;
  handling: number;
};

type Car = {
  x: number;
  speed: number;
  lane: number;
  distance: number;
  isBoosting: boolean;
};

type Obstacle = {
  id: number;
  lane: number;
  y: number;
  kind: 'cone' | 'oil';
};

const LANES = 3;
const ROAD_HEIGHT = 560;
const ROAD_WIDTH = 360;
const CAR_HEIGHT = 80;
const FINISH_DISTANCE = 2500;
const FPS = 1000 / 60;

const drivers: Driver[] = [
  { name: 'Nova Blaze', color: 'from-red-500 to-orange-400', maxSpeed: 230, acceleration: 5.2, handling: 0.18 },
  { name: 'Kai Drift', color: 'from-cyan-500 to-sky-400', maxSpeed: 210, acceleration: 6.1, handling: 0.24 },
  { name: 'Raven Volt', color: 'from-violet-500 to-fuchsia-400', maxSpeed: 245, acceleration: 4.5, handling: 0.15 },
];

const laneToX = (lane: number) => 20 + lane * ((ROAD_WIDTH - 40) / LANES);

const isStartKey = (event: KeyboardEvent) =>
  event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space' || event.key === ' ';

const isControlKey = (event: KeyboardEvent) =>
  ['ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'NumpadEnter', 'KeyA', 'KeyD', 'KeyR'].includes(event.code);

const Game = () => {
  const navigate = useNavigate();
  const [selectedDriver, setSelectedDriver] = useState<Driver>(drivers[0]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [boost, setBoost] = useState(100);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Use ← and → to change lanes. Hold Space for Nitro!');
  const [car, setCar] = useState<Car>({ x: laneToX(1), speed: 0, lane: 1, distance: 0, isBoosting: false });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const pressedRef = useRef<Record<string, boolean>>({});
  const timerRef = useRef<number | null>(null);
  const obstacleIdRef = useRef(0);
  const spawnTicksRef = useRef(0);
  const boostRef = useRef(100);
  const speedRef = useRef(0);
  const raceAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boostRef.current = boost;
  }, [boost]);

  useEffect(() => {
    speedRef.current = car.speed;
  }, [car.speed]);

  useEffect(() => {
    raceAreaRef.current?.focus();
  }, []);

  const topSpeed = useMemo(() => Math.round(selectedDriver.maxSpeed + (car.isBoosting ? 35 : 0)), [selectedDriver.maxSpeed, car.isBoosting]);
  const progress = Math.min((car.distance / FINISH_DISTANCE) * 100, 100);

  const resetRace = useCallback(() => {
    setFinished(false);
    setStarted(false);
    setTimeElapsed(0);
    setBoost(100);
    setScore(0);
    setMessage('Use ← and → to change lanes. Hold Space for Nitro!');
    setCar({ x: laneToX(1), speed: 0, lane: 1, distance: 0, isBoosting: false });
    obstacleIdRef.current = 0;
    spawnTicksRef.current = 0;
    boostRef.current = 100;
    speedRef.current = 0;
    setObstacles([]);
  }, []);

  const startRace = useCallback(() => {
    if (finished) {
      setFinished(false);
      setTimeElapsed(0);
      setBoost(100);
      setScore(0);
      setCar({ x: laneToX(1), speed: 0, lane: 1, distance: 0, isBoosting: false });
      setObstacles([]);
      obstacleIdRef.current = 0;
      spawnTicksRef.current = 0;
      boostRef.current = 100;
      speedRef.current = 0;
    }

    setStarted(true);
    setMessage('Race started! Dodge traffic and push your top speed.');
    raceAreaRef.current?.focus();
  }, [finished]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      pressedRef.current[event.code] = true;

      if (isControlKey(event)) {
        event.preventDefault();
      }

      if (!started && isStartKey(event)) {
        startRace();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressedRef.current[event.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [startRace, started]);

  useEffect(() => {
    const clearPressedKeys = () => {
      pressedRef.current = {};
    };

    window.addEventListener('blur', clearPressedKeys);
    document.addEventListener('visibilitychange', clearPressedKeys);

    return () => {
      window.removeEventListener('blur', clearPressedKeys);
      document.removeEventListener('visibilitychange', clearPressedKeys);
    };
  }, []);

  useEffect(() => {
    if (!started || finished) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeElapsed((prev) => prev + FPS / 1000);
      setCar((prev) => {
        let nextLane = prev.lane;
        if (pressedRef.current.ArrowLeft || pressedRef.current.KeyA) nextLane = Math.max(0, prev.lane - 1);
        if (pressedRef.current.ArrowRight || pressedRef.current.KeyD) nextLane = Math.min(LANES - 1, prev.lane + 1);

        const boosting = !!pressedRef.current.Space && boostRef.current > 1;
        const accel = selectedDriver.acceleration + (boosting ? 2.8 : 0);
        const drag = 1.25;
        const maxSpeed = selectedDriver.maxSpeed + (boosting ? 35 : 0);
        const nextSpeed = Math.max(0, Math.min(maxSpeed, prev.speed + accel - drag));
        const distanceGain = nextSpeed * 0.02;

        if (boosting) {
          setBoost((b) => Math.max(0, b - 1.2));
        } else {
          setBoost((b) => Math.min(100, b + 0.45));
        }

        const nextDistance = prev.distance + distanceGain;
        if (nextDistance >= FINISH_DISTANCE) {
          setFinished(true);
          setStarted(false);
          setMessage('Finish line crossed! You are the road champion!');
          setScore((s) => s + 500);
        }

        return {
          x: laneToX(nextLane),
          lane: nextLane,
          speed: nextSpeed,
          distance: nextDistance,
          isBoosting: boosting,
        };
      });

      spawnTicksRef.current += 1;
      if (spawnTicksRef.current > 28) {
        spawnTicksRef.current = 0;
        setObstacles((prev) => [
          ...prev,
          {
            id: obstacleIdRef.current++,
            lane: Math.floor(Math.random() * LANES),
            y: -60,
            kind: Math.random() > 0.5 ? 'cone' : 'oil',
          },
        ]);
      }

      setObstacles((prev) =>
        prev
          .map((obstacle) => ({ ...obstacle, y: obstacle.y + 8 + speedRef.current * 0.01 }))
          .filter((obstacle) => obstacle.y < ROAD_HEIGHT + 120)
      );

      setScore((prev) => prev + Math.round(speedRef.current * 0.02));
    }, FPS);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [finished, selectedDriver.acceleration, selectedDriver.maxSpeed, started]);

  useEffect(() => {
    const hit = obstacles.some((obstacle) => {
      const carY = ROAD_HEIGHT - CAR_HEIGHT - 30;
      const obstacleInCarZone = obstacle.y > carY - 10 && obstacle.y < carY + CAR_HEIGHT;
      const sameLane = obstacle.lane === car.lane;
      return obstacleInCarZone && sameLane;
    });

    if (hit && started) {
      setStarted(false);
      setFinished(true);
      setMessage('Crash! Hit R to retry or click race again.');
      setScore((prev) => Math.max(0, prev - 250));
    }
  }, [car.lane, obstacles, started]);

  useEffect(() => {
    const onRetry = (event: KeyboardEvent) => {
      if (event.code === 'KeyR') resetRace();
    };

    window.addEventListener('keydown', onRetry);
    return () => window.removeEventListener('keydown', onRetry);
  }, [resetRace]);

  return (
    <div
      ref={raceAreaRef}
      tabIndex={0}
      onClick={() => raceAreaRef.current?.focus()}
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 py-6 outline-none"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-black tracking-tight">Sports Car Street Sprint</h1>
          <Button onClick={resetRace}>Race Again</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden border-slate-700 bg-slate-900">
            <div className="relative mx-auto mt-4 h-[560px] w-[360px] rounded-xl border-4 border-slate-500 bg-gradient-to-b from-slate-700 to-slate-900">
              <div className="absolute inset-0 opacity-40">
                {Array.from({ length: 14 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute left-1/2 h-12 w-2 -translate-x-1/2 rounded bg-yellow-300"
                    style={{ top: `${(index * 80 + (timeElapsed * 250) % 80) % 620 - 60}px` }}
                  />
                ))}
              </div>

              {obstacles.map((obstacle) => (
                <div
                  key={obstacle.id}
                  className={`absolute h-14 w-20 rounded-md ${
                    obstacle.kind === 'cone' ? 'bg-orange-500' : 'bg-slate-700'
                  } border-2 border-white/20`}
                  style={{ left: laneToX(obstacle.lane), top: obstacle.y }}
                />
              ))}

              <div
                className={`absolute h-20 w-24 rounded-lg border-2 border-white/40 bg-gradient-to-br ${selectedDriver.color} ${
                  car.isBoosting ? 'shadow-[0_0_22px_4px_rgba(250,204,21,0.8)]' : ''
                }`}
                style={{ left: car.x - 8, top: ROAD_HEIGHT - CAR_HEIGHT - 30, transition: `left ${selectedDriver.handling}s ease-out` }}
              >
                <div className="absolute -bottom-2 left-2 h-3 w-5 rounded bg-red-500" />
                <div className="absolute -bottom-2 right-2 h-3 w-5 rounded bg-red-500" />
              </div>

              {!started && !finished && (
                <button
                  type="button"
                  onClick={startRace}
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/35 text-center"
                >
                  <div className="rounded-xl border border-cyan-300/60 bg-slate-900/85 p-5">
                    <p className="text-lg font-bold text-cyan-200">Press Enter or Click to Start</p>
                    <p className="mt-1 text-sm text-slate-200">Use ←/→ or A/D to steer • Hold Space for Nitro • R to reset</p>
                  </div>
                </button>
              )}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="space-y-4 border-slate-700 bg-slate-900 p-5">
              <h2 className="text-xl font-bold">Choose Driver</h2>
              <div className="grid gap-3">
                {drivers.map((driver) => (
                  <button
                    key={driver.name}
                    type="button"
                    onClick={() => {
                      if (!started) {
                        setSelectedDriver(driver);
                        setMessage(`${driver.name} is ready to burn rubber.`);
                      }
                    }}
                    className={`rounded-lg border p-3 text-left transition ${
                      selectedDriver.name === driver.name ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-xs text-slate-300">
                      Max {driver.maxSpeed} km/h • Accel {driver.acceleration.toFixed(1)} • Handling {driver.handling.toFixed(2)}s
                    </p>
                  </button>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={startRace}
                disabled={started}
              >
                {finished ? 'Start New Race' : 'Start Race (Enter)'}
              </Button>
            </Card>

            <Card className="space-y-4 border-slate-700 bg-slate-900 p-5">
              <h2 className="text-xl font-bold">Dashboard</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-slate-800 p-3">
                  <p className="text-slate-300">Speedometer</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-cyan-300">
                    <Gauge className="h-5 w-5" />
                    {Math.round(car.speed)} km/h
                  </p>
                </div>
                <div className="rounded-md bg-slate-800 p-3">
                  <p className="text-slate-300">Top Speed</p>
                  <p className="mt-1 text-2xl font-black text-emerald-300">{topSpeed} km/h</p>
                </div>
                <div className="rounded-md bg-slate-800 p-3">
                  <p className="text-slate-300">Timer</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-amber-300">
                    <Timer className="h-5 w-5" />
                    {timeElapsed.toFixed(1)}s
                  </p>
                </div>
                <div className="rounded-md bg-slate-800 p-3">
                  <p className="text-slate-300">Score</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-pink-300">
                    <Trophy className="h-5 w-5" />
                    {score}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Nitro</span>
                  <span>{Math.round(boost)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-500" style={{ width: `${boost}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Road Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <p className="rounded-md border border-cyan-500/40 bg-cyan-500/10 p-3 text-sm text-cyan-100">{message}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
