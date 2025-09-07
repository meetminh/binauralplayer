"use client";

import { useRef } from "react";
import { BinauralPlayer, type PlayerHandle } from "@/components/BinauralPlayer";
import { SessionTimer } from "@/components/SessionTimer";

export default function BinauralPage() {
  // Ref to control the BinauralPlayer
  const playerRef = useRef<PlayerHandle>(null);

  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <BinauralPlayer
          ref={playerRef}
          defaultBaseHz={220}
          defaultBeatHz={6}
          defaultVolume={0.22}
          defaultFadeSec={0.5}
          onStart={() => {
            // Optionally: auto-start timer here if desired (controlled in SessionTimer)
          }}
          onStop={() => {
            // no-op
          }}
        />
      </section>

      <aside className="lg:col-span-1">
        <SessionTimer
          initialMinutes={10}
          onStart={() => playerRef.current?.start()}
          onPause={() => playerRef.current?.stop()}
          onExpire={async () => {
            // call player stop when timer hits zero
            await playerRef.current?.stop();
          }}
        />
      </aside>
    </main>
  );
}
