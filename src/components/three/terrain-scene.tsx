"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { TerrainMesh } from "./terrain-mesh";
import { SunLight } from "./sun-light";

function TerrainFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0E1219] via-[#1A2D42] to-[#0E1219]" />
  );
}

export function TerrainScene() {
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebglAvailable(false);
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  if (!webglAvailable) {
    return <TerrainFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ background: "#0E1219" }}
      >
        <Suspense fallback={null}>
          {/* Low ambient — the sun does the work */}
          <ambientLight intensity={0.15} color="#1A2D42" />

          {/* Subtle fixed fill from below/behind so geometry is never fully black */}
          <hemisphereLight
            color="#4A8EB0"
            groundColor="#0E1219"
            intensity={0.3}
          />

          {/* Mouse-driven sun */}
          <SunLight />

          <TerrainMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
