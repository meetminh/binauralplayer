"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Props = {
  initialMinutes?: number;
  onExpire?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  autoStart?: boolean;
  attachToPlayer?: boolean; // purely visual hint for layout
};

export function SessionTimer({
  initialMinutes = 10,
  onExpire,
  onStart,
  onPause,
  autoStart = false,
  attachToPlayer = true,
}: Props) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);

  // RAF timer internals
  const startEpochRef = useRef<number | null>(null);
  const durationSecRef = useRef(initialMinutes * 60);
  const rafIdRef = useRef<number | null>(null);
  const prevMinutesRef = useRef(minutes);

  const tick = useCallback(
    (ts: number) => {
      if (startEpochRef.current == null) startEpochRef.current = ts;
      const elapsed = (ts - startEpochRef.current) / 1000;
      const remain = Math.max(0, durationSecRef.current - elapsed);
      setSecondsLeft(remain);

      if (remain <= 0) {
        setRunning(false);
        startEpochRef.current = null;
        durationSecRef.current = minutes * 60;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        onExpire?.();
        return;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    },
    [minutes, onExpire]
  );

  const start = useCallback(() => {
    if (running) return;
    // resume from remaining time if paused; otherwise from full duration already in state
    durationSecRef.current = Math.max(0, Math.ceil(secondsLeft));
    setSecondsLeft(durationSecRef.current);
    setRunning(true);
    onStart?.();
    startEpochRef.current = null;
    rafIdRef.current = requestAnimationFrame(tick);
  }, [running, secondsLeft, tick, onStart]);

  const stop = useCallback(() => {
    if (!running) return;
    // persist remaining so the next Start continues instead of resetting
    durationSecRef.current = Math.max(0, Math.ceil(secondsLeft));
    setRunning(false);
    onPause?.();
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  }, [running, secondsLeft, onPause]);

  const reset = useCallback(() => {
    stop();
    durationSecRef.current = minutes * 60;
    setSecondsLeft(durationSecRef.current);
  }, [minutes, stop]);

  useEffect(() => {
    if (autoStart) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep remaining time in sync only when *minutes actually changes* and timer is not running
  useEffect(() => {
    if (minutes !== prevMinutesRef.current && !running) {
      durationSecRef.current = minutes * 60;
      setSecondsLeft(durationSecRef.current);
    }
    prevMinutesRef.current = minutes;
  }, [minutes, running]);

  useEffect(
    () => () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    },
    []
  );

  // derive progress (0..1) for a subtle progress bar
  const totalSeconds = durationSecRef.current || minutes * 60;
  const progress = Math.max(0, Math.min(1, secondsLeft / totalSeconds));

  const mm = Math.floor(secondsLeft / 60);
  const ss = Math.floor(secondsLeft % 60);

  const applyPreset = (v: number) => {
    // adjust minutes and reset remaining; do not auto-start
    durationSecRef.current = v * 60;
    setMinutes(v);
    setSecondsLeft(durationSecRef.current);
    // if currently running, just pause to avoid abrupt jumps
    if (running) {
      stop();
    }
  };

  return (
    <Card
      className={cn(
        "border rounded-2xl shadow-sm bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40",
        attachToPlayer && "lg:sticky lg:top-4"
      )}
    >
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
          Session Timer
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Focus block countdown with quick presets.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mins">Minutes</Label>
            <span className="tabular-nums text-sm text-muted-foreground">
              {minutes} min
            </span>
          </div>
          <Slider
            id="mins"
            min={1}
            max={60}
            step={1}
            value={[minutes]}
            onValueChange={([v]) => setMinutes(v)}
            aria-label="Minutes slider"
            className="cursor-pointer"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={180}
              value={minutes}
              onChange={(e) => {
                const v = Math.max(
                  1,
                  Math.min(180, Number(e.target.value || 1))
                );
                setMinutes(v);
              }}
              aria-label="Minutes"
              className="cursor-pointer"
            />
            <Button
              variant="secondary"
              onClick={reset}
              className="cursor-pointer"
            >
              Set
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[5, 10, 15, 20, 25, 45, 60].map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === minutes ? "default" : "secondary"}
              className="rounded-full cursor-pointer"
              onClick={() => applyPreset(p)}
            >
              {p}m
            </Button>
          ))}
        </div>

        <div className="rounded-md bg-muted/40 px-3 py-2">
          <div className="flex items-baseline justify-between">
            <div className="text-sm text-muted-foreground">Remaining</div>
            <div
              aria-live="polite"
              className="text-3xl font-semibold tabular-nums"
            >
              {mm.toString().padStart(2, "0")}:{ss.toString().padStart(2, "0")}
            </div>
          </div>
          {/* progress track */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${(1 - progress) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!running ? (
            <Button
              className="w-full cursor-pointer"
              onClick={start}
              aria-label="Start timer"
            >
              Start
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={stop}
              aria-label="Pause timer"
            >
              Pause
            </Button>
          )}
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={reset}
            aria-label="Reset timer"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
