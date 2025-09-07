"use client";

import { useBinauralBeat } from "@/hooks/useBinauralBeat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

export type PlayerHandle = {
  start: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
};

type Props = {
  defaultBaseHz?: number;
  defaultBeatHz?: number;
  defaultVolume?: number;
  defaultFadeSec?: number;
  onStart?: () => void;
  onStop?: () => void;
};

const BinauralPlayerInner = (
  {
    defaultBaseHz = 220,
    defaultBeatHz = 6,
    defaultVolume = 0.2,
    defaultFadeSec = 0.5,
    onStart,
    onStop,
  }: Props,
  ref: React.Ref<PlayerHandle>
) => {
  const { params, setParams, isRunning, start, stop } = useBinauralBeat({
    baseHz: defaultBaseHz,
    beatHz: defaultBeatHz,
    volume: defaultVolume,
    fadeSec: defaultFadeSec,
  });

  // Optional: “safety” low-latency mode toggle (no-op placeholder for future)
  const [lowLatency, setLowLatency] = useState(true);

  const PRESETS = [
    // Evidence suggests theta (~6 Hz) is useful for anxiety reduction; alpha is mixed. See citations in code review.
    {
      key: "Reduce Anxiety 🧘",
      baseHz: 200,
      beatHz: 6,
      volume: 0.2,
      fadeSec: 1.0,
    },
    // Sleep onset / unwind benefits are often in lower theta/delta; keep volume gentle.
    {
      key: "Unwind & Sleep 🌙",
      baseHz: 210,
      beatHz: 4.5,
      volume: 0.18,
      fadeSec: 1.2,
    },
    // Working memory / focus shows best signals around ~15 Hz beta in several studies.
    {
      key: "Deep Focus 💡",
      baseHz: 240,
      beatHz: 15,
      volume: 0.3,
      fadeSec: 0.5,
    },
  ] as const;

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    // override only relevant player params; keep other state intact
    setParams((cur) => ({
      ...cur,
      baseHz: p.baseHz,
      beatHz: p.beatHz,
      volume: p.volume,
      fadeSec: p.fadeSec,
    }));
    setActivePreset(p.key);
  };

  useEffect(() => {
    // Here you could adjust internal settings if lowLatency toggles in future.
  }, [lowLatency]);

  // Expose imperative controls so external timer can stop the sound
  useImperativeHandle(
    ref,
    () => ({
      start: async () => {
        await start();
        onStart?.();
      },
      pause: async () => {
        await stop();
        onStop?.();
      },
      stop: async () => {
        await stop();
        onStop?.();
      },
    }),
    [start, stop, onStart, onStop]
  );

  return (
    <Card className="border rounded-xl shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">Binaural Beat Player</CardTitle>
        <p className="text-sm text-muted-foreground">
          Headphones required. You’re generating a {params.beatHz} Hz beat
          (theta: ~4–8 Hz).
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Preset badges */}
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant={activePreset === p.key ? "default" : "secondary"}
              className="rounded-full cursor-pointer"
              onClick={() => applyPreset(p)}
              aria-label={`Apply ${p.key} preset`}
            >
              {p.key}
            </Button>
          ))}
        </div>

        {/* Base Frequency */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="base">Base frequency</Label>
            <span className="tabular-nums text-sm text-muted-foreground">
              {params.baseHz} Hz
            </span>
          </div>
          <Slider
            id="base"
            min={180}
            max={500}
            step={1}
            value={[params.baseHz]}
            onValueChange={([v]) => setParams((p) => ({ ...p, baseHz: v }))}
          />
        </div>

        {/* Beat Frequency */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="beat">Beat frequency</Label>
            <span className="tabular-nums text-sm text-muted-foreground">
              {params.beatHz.toFixed(1)} Hz
            </span>
          </div>
          <Slider
            id="beat"
            min={0.5}
            max={20}
            step={0.1}
            value={[params.beatHz]}
            onValueChange={([v]) => setParams((p) => ({ ...p, beatHz: v }))}
          />
        </div>

        {/* Volume */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="vol">Volume</Label>
            <span className="tabular-nums text-sm text-muted-foreground">
              {Math.round(params.volume * 100)}%
            </span>
          </div>
          <Slider
            id="vol"
            min={0}
            max={1}
            step={0.01}
            value={[params.volume]}
            onValueChange={([v]) => setParams((p) => ({ ...p, volume: v }))}
          />
        </div>

        {/* Fade */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fade">Fade</Label>
            <span className="tabular-nums text-sm text-muted-foreground">
              {params.fadeSec.toFixed(2)} s
            </span>
          </div>
          <Slider
            id="fade"
            min={0.05}
            max={2}
            step={0.05}
            value={[params.fadeSec]}
            onValueChange={([v]) => setParams((p) => ({ ...p, fadeSec: v }))}
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Low-latency mode</div>
            <div className="text-xs text-muted-foreground">
              Keeps the graph lean and responsive.
            </div>
          </div>
          <Switch checked={lowLatency} onCheckedChange={setLowLatency} />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <Button
              className="w-full cursor-pointer"
              onClick={async () => {
                await start();
                onStart?.();
              }}
            >
              Start
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={async () => {
                await stop();
                onStop?.();
              }}
            >
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const BinauralPlayer = forwardRef<PlayerHandle, Props>(
  BinauralPlayerInner
);
