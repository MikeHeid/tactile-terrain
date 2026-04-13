"use client";

import dynamic from "next/dynamic";

const TerrainScene = dynamic(
  () => import("./terrain-scene").then((mod) => ({ default: mod.TerrainScene })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function TerrainHero() {
  return <TerrainScene />;
}
