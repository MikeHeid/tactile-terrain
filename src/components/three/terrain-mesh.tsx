"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

// Pre-computed sweep gradient (branding colors sampled at 256 steps)
const SWEEP_LUT = new Float32Array(256 * 3);
{
  const colors = [
    [0.176, 0.478, 0.612],  // #2D7A9C accent blue
    [0.290, 0.557, 0.690],  // #4A8EB0 steel blue
    [0.788, 0.659, 0.298],  // #C9A84C gold
    [0.910, 0.835, 0.659],  // #E8D5A8 warm gold
    [0.424, 0.706, 0.831],  // #6CB4D4 light blue
  ];
  for (let i = 0; i < 256; i++) {
    const t = i / 255 * (colors.length - 1);
    const ci = Math.min(Math.floor(t), colors.length - 2);
    const f = t - ci;
    SWEEP_LUT[i * 3]     = colors[ci][0] + (colors[ci + 1][0] - colors[ci][0]) * f;
    SWEEP_LUT[i * 3 + 1] = colors[ci][1] + (colors[ci + 1][1] - colors[ci][1]) * f;
    SWEEP_LUT[i * 3 + 2] = colors[ci][2] + (colors[ci + 1][2] - colors[ci][2]) * f;
  }
}

export function TerrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const { size } = useThree();

  const { geometry, baseZ, baseColors, pulsePoints, normalizedZ } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 12, 64, 64);
    const noise2D = createNoise2D();
    const positions = geo.attributes.position;
    const basePositions = new Float32Array(positions.count);

    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      let elevation = 0;
      elevation += noise2D(x * 0.3, y * 0.3) * 1.44;
      elevation += noise2D(x * 0.6, y * 0.6) * 0.72;
      elevation += noise2D(x * 1.2, y * 1.2) * 0.32;

      const dist = Math.sqrt(x * x + y * y) / 6;
      const falloff = Math.max(0, 1 - dist * dist);
      elevation *= falloff;

      positions.setZ(i, elevation);
      basePositions[i] = elevation;
      if (elevation < minZ) minZ = elevation;
      if (elevation > maxZ) maxZ = elevation;
    }

    geo.computeVertexNormals();

    // Pre-compute normalized Z for each vertex (0-1)
    const zSpan = maxZ - minZ || 1;
    const normZ = new Float32Array(positions.count);
    for (let i = 0; i < positions.count; i++) {
      normZ[i] = (basePositions[i] - minZ) / zSpan;
    }

    // Base colors
    const colors = new Float32Array(positions.count * 3);
    const storedBase = new Float32Array(positions.count * 3);
    const deep = new THREE.Color("#1A2D42");
    const mid = new THREE.Color("#2E5470");
    const high = new THREE.Color("#4A8EB0");
    const peak = new THREE.Color("#6CB4D4");
    const tmpColor = new THREE.Color();

    for (let i = 0; i < positions.count; i++) {
      const t = (basePositions[i] + 0.5) / 2.5;
      if (t < 0.15) tmpColor.lerpColors(deep, mid, t / 0.15);
      else if (t < 0.4) tmpColor.lerpColors(mid, high, (t - 0.15) / 0.25);
      else tmpColor.lerpColors(high, peak, Math.min((t - 0.4) / 0.6, 1));

      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
      storedBase[i * 3] = tmpColor.r;
      storedBase[i * 3 + 1] = tmpColor.g;
      storedBase[i * 3 + 2] = tmpColor.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Pulse points
    const points: { index: number; phase: number; speed: number; amplitude: number; radius: number }[] = [];
    for (let p = 0; p < 80; p++) {
      points.push({
        index: Math.floor(Math.random() * positions.count),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        amplitude: 0.04 + Math.random() * 0.12,
        radius: 2 + Math.random() * 3,
      });
    }

    return { geometry: geo, baseZ: basePositions, baseColors: storedBase, pulsePoints: points, normalizedZ: normZ };
  }, []);

  useFrame((_state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    const positions = geometry.attributes.position;
    const colorsAttr = geometry.attributes.color;
    const colorsArray = colorsAttr.array as Float32Array;

    // === Vertex Z animation ===
    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, baseZ[i]);
    }

    for (const point of pulsePoints) {
      const wave = Math.sin(t * point.speed + point.phase) * point.amplitude;
      const cx = positions.getX(point.index);
      const cy = positions.getY(point.index);

      for (let i = 0; i < positions.count; i++) {
        const dx = positions.getX(i) - cx;
        const dy = positions.getY(i) - cy;
        const dist = dx * dx + dy * dy; // skip sqrt, compare squared
        const r2 = point.radius * point.radius;

        if (dist < r2) {
          const f = 1 - Math.sqrt(dist) / point.radius;
          positions.setZ(i, positions.getZ(i) + wave * f * f * (3 - 2 * f));
        }
      }
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    // === Color sweep (no allocations, LUT-based) ===
    const cycleDuration = 5.0;
    const sweepDuration = 1.5;
    const bandWidth = 0.3;
    const cycleTime = t % cycleDuration;

    if (cycleTime < sweepDuration + 0.5) {
      const sweepProgress = Math.min(cycleTime / sweepDuration, 1);
      const sweepCenter = -bandWidth + sweepProgress * (1 + 2 * bandWidth);
      const fadeOut = cycleTime > sweepDuration ? 1 - (cycleTime - sweepDuration) / 0.5 : 1;

      for (let i = 0; i < positions.count; i++) {
        const nz = normalizedZ[i];
        const distFromSweep = Math.abs(nz - sweepCenter);

        if (distFromSweep < bandWidth && fadeOut > 0) {
          const bandT = 1 - distFromSweep / bandWidth;
          const intensity = bandT * bandT * (3 - 2 * bandT) * 0.7 * fadeOut;

          // LUT lookup — no allocation
          const lutIdx = Math.min(Math.floor(nz * 255), 255) * 3;
          const sr = SWEEP_LUT[lutIdx];
          const sg = SWEEP_LUT[lutIdx + 1];
          const sb = SWEEP_LUT[lutIdx + 2];

          const bi = i * 3;
          colorsArray[bi]     = baseColors[bi]     + (sr - baseColors[bi])     * intensity;
          colorsArray[bi + 1] = baseColors[bi + 1] + (sg - baseColors[bi + 1]) * intensity;
          colorsArray[bi + 2] = baseColors[bi + 2] + (sb - baseColors[bi + 2]) * intensity;
        } else {
          const bi = i * 3;
          colorsArray[bi]     = baseColors[bi];
          colorsArray[bi + 1] = baseColors[bi + 1];
          colorsArray[bi + 2] = baseColors[bi + 2];
        }
      }
      colorsAttr.needsUpdate = true;
    }

    // === Rotation + mouse parallax ===
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.05;

      const targetX = mouseRef.current.y * 0.08;
      const targetY = mouseRef.current.x * 0.08;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -Math.PI / 2.2 + targetX,
        0.02
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.02
      );
    }
  });

  useMemo(() => {
    if (typeof window === "undefined") return;
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / size.width - 0.5) * 2;
      mouseRef.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [size]);

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2.2, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          vertexColors
          flatShading
          side={THREE.DoubleSide}
          roughness={0.75}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial
          wireframe
          color="#6CB4D4"
          opacity={0.08}
          transparent
        />
      </mesh>
    </group>
  );
}
