"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function ParticleField({ count = 6000 }) {
  const ref = useRef();
  const mouse = useRef([0, 0]);
  const originalY = useRef(new Float32Array(count)); // Store original Y

  // Generate particles + store original Y
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 2 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;

      // Save original Y
      originalY.current[i] = pos[i * 3 + 1];
    }
    return pos;
  }, [count]);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];

      // Mouse influence
      const mx = mouse.current[0] * 20;
      const mz = mouse.current[1] * 20;
      const dx = x - mx;
      const dz = z - mz;
      const dist = Math.hypot(dx, dz);
      const lift = dist < 8 ? (8 - dist) * 0.6 : 0;

      // Gentle wave
      const wave = Math.sin(time * 2 + i * 0.02) * 0.1;

      // Target Y = original + lift + wave
      const targetY = originalY.current[i] + lift + wave;

      // Smooth interpolation (GSAP ease-out)
      positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * 0.12;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = time * 0.03;
  });

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.85}
        emissive="#ffffff"
        emissiveIntensity={0.2}
      />
    </Points>
  );
}

export default function ParticleGround() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 50]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />

        <ParticleField count={6000} />

        {/* Subtle ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </Canvas>
    </div>
  );
}