"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";

function ParticleField({ count = 4000 }) {
  const ref = useRef();
  const mouse = useRef([0, 0]);

  // Centered, tighter cluster
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const centerRadius = 15; // Tighter cluster
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * centerRadius;
      const height = Math.random() * 0.8 - 0.4; // Low to ground

      pos[i * 3] = Math.cos(angle) * radius;           // x
      pos[i * 3 + 1] = height;                         // y
      pos[i * 3 + 2] = Math.sin(angle) * radius;       // z
    }
    return pos;
  }, [count]);

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // GSAP-style smooth lift + wave
  useFrame((state) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const baseY = positions[i * 3 + 1];

      // Mouse influence
      const mx = mouse.current[0] * 12;
      const my = mouse.current[1] * 12;
      const dx = x - mx;
      const dz = z - my;
      const dist = Math.hypot(dx, dz);
      const lift = dist < 6 ? (6 - dist) * 0.8 : 0;

      // Gentle wave
      const wave = Math.sin(time * 2 + i * 0.02) * 0.15;

      // Target Y
      const targetY = baseY + lift + wave;

      // Smooth interpolation (GSAP ease)
      positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * 0.12;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = time * 0.03; // Slow orbit
  });

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.9}
        emissive="#ffffff"
        emissiveIntensity={0.3}
        // Soft glow
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            "gl_FragColor = vec4( finalColor, opacity );",
            `
            float dist = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.0, dist) * opacity;
            gl_FragColor = vec4(finalColor.rgb + vec3(0.3), alpha);
            `
          );
        }}
      />
    </Points>
  );
}

export default function ParticleGround() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 4, 18], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 15, 40]} />

        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ffffff" />

        {/* Centered Particle Field */}
        <ParticleField count={4000} />

        {/* Subtle ground reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#0a0a0a"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  );
}