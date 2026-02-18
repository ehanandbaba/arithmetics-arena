import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Gauge, Shield, Timer, Trophy, Zap } from 'lucide-react';

type Driver = {
  name: string;
  color: string;
  maxSpeed: number;
  acceleration: number;
  handling: number;
};

type PlayerCar = {
  lane: number;
  speed: number;
  distance: number;
  nitro: number;
  integrity: number;
};

type TrafficCar = {
  id: number;
  lane: number;
  y: number;
  speed: number;
  color: string;
};

type Pickup = {
  id: number;
  lane: number;
  y: number;
  kind: 'nitro' | 'score';
};

const LANES = 3;
const ROAD_HEIGHT = 560;
const ROAD_WIDTH = 360;
const CAR_HEIGHT = 80;
const FINISH_DISTANCE = 6000;

const drivers: Driver[] = [
  { name: 'Nova Blaze', color: 'from-red-500 to-orange-400', maxSpeed: 240, acceleration: 145, handling: 0.18 },
  { name: 'Kai Drift', color: 'from-cyan-500 to-sky-400', maxSpeed: 225, acceleration: 165, handling: 0.22 },
  { name: 'Raven Volt', color: 'from-violet-500 to-fuchsia-400', maxSpeed: 255, acceleration: 130, handling: 0.14 },
];

const laneToX = (lane: number) => 20 + lane * ((ROAD_WIDTH - 40) / LANES);

const Game = () => {
  const navigate = useNavigate();
  const raceAreaRef = useRef<HTMLDivElement | null>(null);
  const pressedRef = useRef<Record<string, boolean>>({});
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const trafficIdRef = useRef(0);
  const pickupIdRef = useRef(0);
  const trafficSpawnRef = useRef(0);
  const pickupSpawnRef = useRef(0);
  const laneCooldownRef = useRef(0);

  const [selectedDriver, setSelectedDriver] = useState<Driver>(drivers[0]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('Press Enter or click Start to race.');

  const [player, setPlayer] = useState<PlayerCar>({ lane: 1, speed: 0, distance: 0, nitro: 100, integrity: 100 });
  const [traffic, setTraffic] = useState<TrafficCar[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);

  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const playerRef = useRef(player);
  const trafficRef = useRef(traffic);
  const pickupsRef = useRef(pickups);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    trafficRef.current = traffic;
  }, [traffic]);

  useEffect(() => {
    pickupsRef.current = pickups;
  }, [pickups]);

  const resetRace = useCallback(() => {
    setStarted(false);
    setFinished(false);
    setWon(false);
    setMessage('Press Enter or click Start to race.');
    setScore(0);
    setTimeElapsed(0);
    trafficSpawnRef.current = 0;
    pickupSpawnRef.current = 0;
    laneCooldownRef.current = 0;
    trafficIdRef.current = 0;
    pickupIdRef.current = 0;
    setPlayer({ lane: 1, speed: 0, distance: 0, nitro: 100, integrity: 100 });
    setTraffic([]);
    setPickups([]);
    pressedRef.current = {};
  }, []);

  const startRace = useCallback(() => {
    if (finished) {
      resetRace();
    }
    setStarted(true);
    setMessage('Race live! Dodge traffic, grab boosts, and hit the finish line.');
    raceAreaRef.current?.focus();
  }, [finished, resetRace]);

  useEffect(() => {
    raceAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      pressedRef.current[event.code] = true;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'ShiftLeft', 'ShiftRight', 'Enter', 'NumpadEnter', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyR'].includes(event.code)) {
        event.preventDefault();
      }
      if (!started && !finished && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
        startRace();
      }
      if (event.code === 'KeyR') {
        resetRace();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressedRef.current[event.code] = false;
    };

    const clearKeys = () => {
      pressedRef.current = {};
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    document.addEventListener('visibilitychange', clearKeys);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
      document.removeEventListener('visibilitychange', clearKeys);
    };
  }, [finished, resetRace, startRace, started]);

  useEffect(() => {
    if (!started || finished) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      laneCooldownRef.current = Math.max(0, laneCooldownRef.current - dt);

      let nextPlayer = { ...playerRef.current };
      const steeringLeft = pressedRef.current.ArrowLeft || pressedRef.current.KeyA;
      const steeringRight = pressedRef.current.ArrowRight || pressedRef.current.KeyD;

      if (steeringLeft && laneCooldownRef.current <= 0) {
        nextPlayer.lane = Math.max(0, nextPlayer.lane - 1);
        laneCooldownRef.current = selectedDriver.handling;
      }

      if (steeringRight && laneCooldownRef.current <= 0) {
        nextPlayer.lane = Math.min(LANES - 1, nextPlayer.lane + 1);
        laneCooldownRef.current = selectedDriver.handling;
      }

      const accelerating = pressedRef.current.ArrowUp || pressedRef.current.KeyW;
      const braking = pressedRef.current.ArrowDown || pressedRef.current.KeyS;
      const nitroPressed = pressedRef.current.Space || pressedRef.current.ShiftLeft || pressedRef.current.ShiftRight;
      const nitroActive = nitroPressed && nextPlayer.nitro > 0;

      const accel = accelerating ? selectedDriver.acceleration : selectedDriver.acceleration * 0.35;
      const brake = braking ? 220 : 90;
      const topSpeed = selectedDriver.maxSpeed + (nitroActive ? 45 : 0);

      nextPlayer.speed = Math.max(0, Math.min(topSpeed, nextPlayer.speed + accel * dt - brake * dt));
      if (nitroActive) {
        nextPlayer.nitro = Math.max(0, nextPlayer.nitro - 30 * dt);
      } else {
        nextPlayer.nitro = Math.min(100, nextPlayer.nitro + 12 * dt);
      }

      nextPlayer.distance += nextPlayer.speed * dt;

      trafficSpawnRef.current += dt;
      pickupSpawnRef.current += dt;

      let nextTraffic = trafficRef.current.map((car) => ({
        ...car,
        y: car.y + (120 + nextPlayer.speed * 0.65 - car.speed) * dt,
      }));

      if (trafficSpawnRef.current > 0.9) {
        trafficSpawnRef.current = 0;
        nextTraffic.push({
          id: trafficIdRef.current++,
          lane: Math.floor(Math.random() * LANES),
          y: -90,
          speed: 55 + Math.random() * 80,
          color: Math.random() > 0.5 ? 'bg-emerald-400' : 'bg-rose-400',
        });
      }

      nextTraffic = nextTraffic.filter((car) => car.y < ROAD_HEIGHT + 120);

      let nextPickups = pickupsRef.current.map((item) => ({
        ...item,
        y: item.y + (110 + nextPlayer.speed * 0.6) * dt,
      }));

      if (pickupSpawnRef.current > 2.2) {
        pickupSpawnRef.current = 0;
        nextPickups.push({
          id: pickupIdRef.current++,
          lane: Math.floor(Math.random() * LANES),
          y: -70,
          kind: Math.random() > 0.45 ? 'nitro' : 'score',
        });
      }

      nextPickups = nextPickups.filter((item) => item.y < ROAD_HEIGHT + 90);

      const playerY = ROAD_HEIGHT - CAR_HEIGHT - 30;

      const collidingCarIds = new Set<number>();
      nextTraffic.forEach((car) => {
        const sameLane = car.lane === nextPlayer.lane;
        const intersects = car.y > playerY - 40 && car.y < playerY + CAR_HEIGHT;
        if (sameLane && intersects) {
          collidingCarIds.add(car.id);
        }
      });

      if (collidingCarIds.size > 0) {
        nextPlayer.integrity = Math.max(0, nextPlayer.integrity - 28 * dt * collidingCarIds.size * 6);
        nextPlayer.speed = Math.max(0, nextPlayer.speed - 260 * dt);
      }

      const pickedIds = new Set<number>();
      nextPickups.forEach((item) => {
        const sameLane = item.lane === nextPlayer.lane;
        const intersects = item.y > playerY - 25 && item.y < playerY + CAR_HEIGHT;
        if (sameLane && intersects) {
          pickedIds.add(item.id);
          if (item.kind === 'nitro') {
            nextPlayer.nitro = Math.min(100, nextPlayer.nitro + 35);
          } else {
            setScore((prev) => prev + 140);
          }
        }
      });

      nextTraffic = nextTraffic.filter((car) => !collidingCarIds.has(car.id));
      nextPickups = nextPickups.filter((item) => !pickedIds.has(item.id));

      if (nextPlayer.integrity <= 0) {
        setStarted(false);
        setFinished(true);
        setWon(false);
        setMessage('Your car is wrecked. Press R or Start to race again.');
      }

      if (nextPlayer.distance >= FINISH_DISTANCE) {
        setStarted(false);
        setFinished(true);
        setWon(true);
        setMessage('Finish line crossed! You won this street sprint.');
        setScore((prev) => prev + 900);
      }

      setPlayer(nextPlayer);
      setTraffic(nextTraffic);
      setPickups(nextPickups);
      setTimeElapsed((prev) => prev + dt);
      setScore((prev) => prev + Math.round(nextPlayer.speed * dt * 0.35));

      if (started && !finished) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastTimeRef.current = 0;
    };
  }, [finished, selectedDriver.acceleration, selectedDriver.handling, selectedDriver.maxSpeed, started]);

  const progress = useMemo(() => Math.min((player.distance / FINISH_DISTANCE) * 100, 100), [player.distance]);

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
          <Button onClick={resetRace}>Reset Race (R)</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden border-slate-700 bg-slate-900">
            <div className="relative mx-auto mt-4 h-[560px] w-[360px] rounded-xl border-4 border-slate-500 bg-gradient-to-b from-slate-700 to-slate-900">
              <div className="absolute inset-0 opacity-40">
                {Array.from({ length: 14 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute left-1/2 h-12 w-2 -translate-x-1/2 rounded bg-yellow-300"
                    style={{ top: `${(index * 80 + (timeElapsed * 320) % 80) % 620 - 60}px` }}
                  />
                ))}
              </div>

              {traffic.map((car) => (
                <div
                  key={car.id}
                  className={`absolute h-16 w-[88px] rounded-md border-2 border-white/20 ${car.color}`}
                  style={{ left: laneToX(car.lane), top: car.y }}
                />
              ))}

              {pickups.map((item) => (
                <div
                  key={item.id}
                  className={`absolute h-10 w-10 rounded-full border-2 ${
                    item.kind === 'nitro' ? 'border-amber-100 bg-amber-400' : 'border-cyan-100 bg-cyan-400'
                  }`}
                  style={{ left: laneToX(item.lane) + 22, top: item.y }}
                />
              ))}

              <div
                className={`absolute h-20 w-24 rounded-lg border-2 border-white/40 bg-gradient-to-br ${selectedDriver.color} ${
                  pressedRef.current.Space ? 'shadow-[0_0_22px_4px_rgba(250,204,21,0.8)]' : ''
                }`}
                style={{
                  left: laneToX(player.lane) - 8,
                  top: ROAD_HEIGHT - CAR_HEIGHT - 30,
                  transition: `left ${selectedDriver.handling}s ease-out`,
                }}
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
                    <p className="text-lg font-bold text-cyan-200">Real race ready. Press Enter or click Start</p>
                    <p className="mt-1 text-sm text-slate-200">W/↑ accelerate • S/↓ brake • A,D or ←,→ steer • Space nitro • R reset</p>
                  </div>
                </button>
              )}

              {finished && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-center">
                  <div className="rounded-xl border border-cyan-300/60 bg-slate-900/90 p-6">
                    <p className="text-2xl font-black text-cyan-200">{won ? 'Victory!' : 'Game Over'}</p>
                    <p className="mt-2 text-sm text-slate-200">{message}</p>
                    <Button className="mt-4" onClick={startRace}>Start New Race</Button>
                  </div>
                </div>
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
                        setMessage(`${driver.name} selected. Ready to race.`);
                      }
                    }}
                    className={`rounded-lg border p-3 text-left transition ${
                      selectedDriver.name === driver.name ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-xs text-slate-300">
                      Top {driver.maxSpeed} km/h • Accel {driver.acceleration.toFixed(0)} • Handling {driver.handling.toFixed(2)}s
                    </p>
                  </button>
                ))}
              </div>
              <Button className="w-full" onClick={startRace} disabled={started && !finished}>
                {started ? 'Racing...' : finished ? 'Start New Race' : 'Start Race (Enter)'}
              </Button>
            </Card>

            <Card className="space-y-4 border-slate-700 bg-slate-900 p-5">
              <h2 className="text-xl font-bold">Race Dashboard</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-slate-800 p-3">
                  <p className="text-slate-300">Speedometer</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-cyan-300">
                    <Gauge className="h-5 w-5" />
                    {Math.round(player.speed)} km/h
                  </p>
                </div>
                <div className="rounded-md bg-slate-800 p-3">
                  <p className="text-slate-300">Integrity</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-emerald-300">
                    <Shield className="h-5 w-5" />
                    {Math.round(player.integrity)}%
                  </p>
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
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Nitro</span>
                  <span>{Math.round(player.nitro)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-500" style={{ width: `${player.nitro}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Finish Progress</span>
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
