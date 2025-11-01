// components/ThreeDScene.jsx
"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function GalacticModel() {
  const { scene, error } = useGLTF("/galactic_incident.glb");

  React.useEffect(() => {
    if (error) {
      console.error("GLB load failed:", error);
      return;
    }

    if (scene) {
      console.log("galactic_incident.glb loaded!");

      // Black & white theme
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const mat = child.material = child.material.clone();
          mat.color.set("#ffffff");
          mat.emissive?.set("#111111");
          mat.metalness = 0.1;
          mat.roughness = 0.9;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Auto-center
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      scene.position.y -= box.getSize(new THREE.Vector3()).y * 0.5;

      // Auto-scale
      const size = box.getSize(new THREE.Vector3()).length();
      const maxSize = 7;
      if (size > maxSize) {
        scene.scale.multiplyScalar(maxSize / size);
      }
    }
  }, [scene, error]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return <primitive object={scene} />;
}

export default function ThreeDScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        shadows
        camera={{ position: [0, 3, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 40]} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          }
        >
          <GalacticModel />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}