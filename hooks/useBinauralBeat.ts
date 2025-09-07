"use client";

import { useEffect, useRef, useState } from "react";

export type BinauralParams = {
  baseHz: number;
  beatHz: number;
  volume: number; // 0..1
  fadeSec: number; // 0.05..2
};

export function useBinauralBeat(initial: BinauralParams) {
  const [params, setParams] = useState<BinauralParams>(initial);
  const [isRunning, setIsRunning] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const leftGainRef = useRef<GainNode | null>(null);
  const rightGainRef = useRef<GainNode | null>(null);
  const leftPanRef = useRef<StereoPannerNode | null>(null);
  const rightPanRef = useRef<StereoPannerNode | null>(null);

  const buildGraph = async () => {
    if (audioCtxRef.current) return;
    const Ctx = (window.AudioContext ||
      (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx({ latencyHint: "interactive" });

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    // left
    const leftOsc = ctx.createOscillator();
    leftOsc.type = "sine";
    const leftGain = ctx.createGain();
    leftGain.gain.value = 0.5;
    const leftPan = ctx.createStereoPanner();
    leftPan.pan.value = -1;
    leftOsc.connect(leftGain).connect(leftPan).connect(master);

    // right
    const rightOsc = ctx.createOscillator();
    rightOsc.type = "sine";
    const rightGain = ctx.createGain();
    rightGain.gain.value = 0.5;
    const rightPan = ctx.createStereoPanner();
    rightPan.pan.value = 1;
    rightOsc.connect(rightGain).connect(rightPan).connect(master);

    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    leftOscRef.current = leftOsc;
    rightOscRef.current = rightOsc;
    leftGainRef.current = leftGain;
    rightGainRef.current = rightGain;
    leftPanRef.current = leftPan;
    rightPanRef.current = rightPan;

    const now = ctx.currentTime;
    leftOsc.frequency.setValueAtTime(params.baseHz, now);
    rightOsc.frequency.setValueAtTime(params.baseHz + params.beatHz, now);
  };

  const start = async () => {
    await buildGraph();
    const ctx = audioCtxRef.current!;
    const master = masterGainRef.current!;
    const leftOsc = leftOscRef.current!;
    const rightOsc = rightOscRef.current!;

    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    try {
      leftOsc.start(now);
    } catch {}
    try {
      rightOsc.start(now);
    } catch {}

    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(params.volume, now + params.fadeSec);

    setIsRunning(true);
  };

  const stop = async () => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;

    if (!ctx || !master) {
      setIsRunning(false);
      return;
    }

    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.0001, now + params.fadeSec);

    window.setTimeout(() => {
      try {
        leftOscRef.current?.stop();
      } catch {}
      try {
        rightOscRef.current?.stop();
      } catch {}
      leftOscRef.current?.disconnect();
      rightOscRef.current?.disconnect();
      leftGainRef.current?.disconnect();
      rightGainRef.current?.disconnect();
      leftPanRef.current?.disconnect();
      rightPanRef.current?.disconnect();
      master.disconnect();
      ctx.close().catch(() => {});

      audioCtxRef.current = null;
      masterGainRef.current = null;
      leftOscRef.current = null;
      rightOscRef.current = null;
      leftGainRef.current = null;
      rightGainRef.current = null;
      leftPanRef.current = null;
      rightPanRef.current = null;

      setIsRunning(false);
    }, Math.ceil(params.fadeSec * 1000) + 30);
  };

  // live param updates (click-free)
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    leftOscRef.current?.frequency.setTargetAtTime(params.baseHz, now, 0.015);
    rightOscRef.current?.frequency.setTargetAtTime(
      params.baseHz + params.beatHz,
      now,
      0.015
    );
    if (masterGainRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setTargetAtTime(params.volume, now, 0.03);
    }
  }, [params.baseHz, params.beatHz, params.volume]);

  // hard cleanup (safety)
  useEffect(
    () => () => {
      if (isRunning) {
        void stop();
      }
    },
    [isRunning]
  );

  return {
    params,
    setParams,
    isRunning,
    start,
    stop,
  };
}
