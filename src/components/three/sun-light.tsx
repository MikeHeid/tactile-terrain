"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function SunLight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentPos = useRef(new THREE.Vector3(6, 6, 6));
  const { size } = useThree();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / size.width - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [size]);

  useFrame(() => {
    if (!lightRef.current) return;

    const angle = mouseRef.current.x * Math.PI * 0.7;
    const elevation = THREE.MathUtils.lerp(3, 8, (mouseRef.current.y + 1) * 0.5);
    const radius = 7;

    const targetPos = new THREE.Vector3(
      Math.sin(angle) * radius,
      elevation,
      Math.cos(angle) * radius
    );

    currentPos.current.lerp(targetPos, 0.025);
    lightRef.current.position.copy(currentPos.current);

    // Always aim at terrain center
    lightRef.current.target.position.set(0, 0, 0);
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      {/* Point-source spot light — tight cone, sharp shadows */}
      <spotLight
        ref={lightRef}
        position={[6, 6, 6]}
        intensity={40}
        color="#E8D5A8"
        angle={Math.PI / 5}
        penumbra={0.3}
        distance={25}
        decay={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-bias={-0.001}
      >
        <primitive object={new THREE.Object3D()} attach="target" />
      </spotLight>

      {/* Subtle cool fill — no shadows */}
      <directionalLight
        position={[-5, 4, -5]}
        intensity={0.15}
        color="#4A8EB0"
      />
    </>
  );
}
