// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const FireFlameEffect = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x000000);
    
//     const camera = new THREE.PerspectiveCamera(
//       60,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 0, 15);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({ 
//       antialias: true,
//       alpha: true 
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     containerRef.current.appendChild(renderer.domElement);

//     // Create flame texture
//     const createFlameTexture = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = 128;
//       canvas.height = 128;
//       const ctx = canvas.getContext('2d');
      
//       const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
//       gradient.addColorStop(0, 'rgba(255,255,255,1)');
//       gradient.addColorStop(0.2, 'rgba(255,255,200,0.9)');
//       gradient.addColorStop(0.4, 'rgba(255,200,100,0.7)');
//       gradient.addColorStop(0.7, 'rgba(255,100,0,0.4)');
//       gradient.addColorStop(1, 'rgba(50,0,0,0)');
      
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, 128, 128);
      
//       const texture = new THREE.Texture(canvas);
//       texture.needsUpdate = true;
//       return texture;
//     };

//     const flameTexture = createFlameTexture();

//     // Multiple fire layers for realistic flames
//     const fireLayers = [];
//     const layerConfigs = [
//       { count: 200, spread: 1.5, height: 6, speed: 0.4, size: 1.5, color: [1.0, 0.9, 0.7] }, // Core hot flame
//       { count: 150, spread: 2.0, height: 7, speed: 0.35, size: 2.0, color: [1.0, 0.6, 0.2] }, // Mid flame
//       { count: 100, spread: 2.5, height: 8, speed: 0.3, size: 2.5, color: [1.0, 0.3, 0.0] }  // Outer flame
//     ];

//     layerConfigs.forEach((config, layerIndex) => {
//       const geometry = new THREE.BufferGeometry();
//       const positions = new Float32Array(config.count * 3);
//       const colors = new Float32Array(config.count * 3);
//       const sizes = new Float32Array(config.count);
//       const velocities = [];
//       const lifetimes = [];
//       const maxLifetimes = [];
//       const angles = [];

//       for (let i = 0; i < config.count; i++) {
//         const i3 = i * 3;
//         const angle = Math.random() * Math.PI * 2;
//         const radius = Math.random() * config.spread;
        
//         positions[i3] = Math.cos(angle) * radius;
//         positions[i3 + 1] = Math.random() * -1;
//         positions[i3 + 2] = Math.sin(angle) * radius;

//         // Color variation
//         colors[i3] = config.color[0] * (0.9 + Math.random() * 0.1);
//         colors[i3 + 1] = config.color[1] * (0.8 + Math.random() * 0.2);
//         colors[i3 + 2] = config.color[2] * (0.7 + Math.random() * 0.3);

//         sizes[i] = Math.random() * config.size + 0.5;

//         velocities.push({
//           x: (Math.random() - 0.5) * 0.05,
//           y: config.speed + Math.random() * 0.2,
//           z: (Math.random() - 0.5) * 0.05
//         });

//         lifetimes.push(Math.random() * 100);
//         maxLifetimes.push(80 + Math.random() * 40);
//         angles.push(angle);
//       }

//       geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//       geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//       const material = new THREE.PointsMaterial({
//         size: config.size,
//         map: flameTexture,
//         blending: THREE.AdditiveBlending,
//         depthWrite: false,
//         transparent: true,
//         vertexColors: true,
//         opacity: 0.9
//       });

//       const particles = new THREE.Points(geometry, material);
//       scene.add(particles);

//       fireLayers.push({
//         particles,
//         geometry,
//         velocities,
//         lifetimes,
//         maxLifetimes,
//         angles,
//         config
//       });
//     });

//     // Add glow lights
//     const coreLight = new THREE.PointLight(0xffaa00, 2, 20);
//     coreLight.position.set(0, 0, 0);
//     scene.add(coreLight);

//     const topLight = new THREE.PointLight(0xff6600, 1, 15);
//     topLight.position.set(0, 3, 0);
//     scene.add(topLight);

//     // Animation
//     let time = 0;
//     const animate = () => {
//       requestAnimationFrame(animate);
//       time += 0.016;

//       fireLayers.forEach((layer, layerIndex) => {
//         const positions = layer.geometry.attributes.position.array;
//         const colors = layer.geometry.attributes.color.array;
//         const sizes = layer.geometry.attributes.size.array;

//         for (let i = 0; i < layer.config.count; i++) {
//           const i3 = i * 3;
          
//           layer.lifetimes[i] += 1;
//           const lifeRatio = layer.lifetimes[i] / layer.maxLifetimes[i];

//           // Spiral upward motion
//           const spiralSpeed = 2 + layerIndex;
//           const newAngle = layer.angles[i] + time * spiralSpeed;
//           const heightFactor = positions[i3 + 1] / layer.config.height;
//           const radius = (1 - heightFactor) * layer.config.spread * 0.5;

//           positions[i3] += layer.velocities[i].x + Math.cos(newAngle) * 0.02;
//           positions[i3 + 1] += layer.velocities[i].y;
//           positions[i3 + 2] += layer.velocities[i].z + Math.sin(newAngle) * 0.02;

//           // Turbulence
//           positions[i3] += Math.sin(time * 3 + i * 0.1) * 0.01;
//           positions[i3 + 2] += Math.cos(time * 3 + i * 0.1) * 0.01;

//           // Fade and change color as flame rises
//           if (lifeRatio > 0.3) {
//             const fade = (lifeRatio - 0.3) / 0.7;
//             colors[i3] = layer.config.color[0] * (1 - fade * 0.5);
//             colors[i3 + 1] = layer.config.color[1] * (1 - fade * 0.7);
//             colors[i3 + 2] = layer.config.color[2] * (1 - fade * 0.9);
            
//             sizes[i] = 0.98; // Shrink as it fades
//           }

//           // Reset particle
//           if (layer.lifetimes[i] > layer.maxLifetimes[i] || positions[i3 + 1] > layer.config.height) {
//             const angle = Math.random() * Math.PI * 2;
//             const radius = Math.random() * layer.config.spread;
            
//             positions[i3] = Math.cos(angle) * radius;
//             positions[i3 + 1] = Math.random() * -1;
//             positions[i3 + 2] = Math.sin(angle) * radius;

//             layer.velocities[i].x = (Math.random() - 0.5) * 0.05;
//             layer.velocities[i].y = layer.config.speed + Math.random() * 0.02;
//             layer.velocities[i].z = (Math.random() - 0.5) * 0.08;

//             colors[i3] = layer.config.color[0] * (0.9 + Math.random() * 0.1);
//             colors[i3 + 1] = layer.config.color[1] * (0.8 + Math.random() * 0.2);
//             colors[i3 + 2] = layer.config.color[2] * (0.7 + Math.random() * 0.3);

//             sizes[i] = Math.random() * layer.config.size + 0.5;

//             layer.lifetimes[i] = 0;
//             layer.maxLifetimes[i] = 80 + Math.random() * 40;
//             layer.angles[i] = angle;
//           }
//         }

//         layer.geometry.attributes.position.needsUpdate = true;
//         layer.geometry.attributes.color.needsUpdate = true;
//         layer.geometry.attributes.size.needsUpdate = true;
//       });

//       // Animate lights for flickering effect
//       coreLight.intensity = 2 + Math.sin(time * 8) * 0.6;
//       topLight.intensity = 1 + Math.sin(time * 6) * 0.2;

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//       fireLayers.forEach(layer => {
//         layer.geometry.dispose();
//         layer.particles.material.dispose();
//       });
//       flameTexture.dispose();
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <div 
//       ref={containerRef} 
//       style={{ 
//         width: '100vw', 
//         height: '100vh', 
//         margin: 0, 
//         padding: 0, 
//         overflow: 'hidden',
//         background: '#000'
//       }} 
//     />
//   );
// };

// export default FireFlameEffect;




// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const FireFlameEffect = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a0a0a); // almost black

//     const camera = new THREE.PerspectiveCamera(
//       60,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 1, 18);
//     camera.lookAt(0, 2, 0);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     containerRef.current.appendChild(renderer.domElement);

//     // Softer, darker flame texture
//     const createFlameTexture = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = 128;
//       canvas.height = 128;
//       const ctx = canvas.getContext('2d');

//       const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
//       gradient.addColorStop(0,   'rgba(192, 155, 106, 0.9)');   // warm core
//       gradient.addColorStop(0.3, 'rgba(235, 144, 98, 0.7)');
//       gradient.addColorStop(0.6, 'rgba(231, 142, 118, 0.4)');
//       gradient.addColorStop(1,   'rgba(40,0,0,0)');       // fades to black

//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, 128, 128);

//       const tex = new THREE.Texture(canvas);
//       tex.needsUpdate = true;
//       return tex;
//     };
//     const flameTexture = createFlameTexture();

//     // FOUR layers → the last one is the BIG one
//     const fireLayers = [];
//     const layerConfigs = [
//       { count: 180, spread: 1.2, height: 5,  speed: 0.35, size: 1.2, color: [1.0, 0.7, 0.3] },
//       { count: 140, spread: 1.8, height: 6,  speed: 0.30, size: 1.6, color: [1.0, 0.5, 0.1] },
//       { count: 100, spread: 2.4, height: 7,  speed: 0.25, size: 2.0, color: [0.9, 0.3, 0.0] },
//       // ←←← BIG LAYER
//       { count: 400, spread: 4.0, height: 9,  speed: 0.18, size: 3.5, color: [0.7, 0.2, 0.0] }
//     ];

//     layerConfigs.forEach((config, idx) => {
//       const geometry = new THREE.BufferGeometry();
//       const positions = new Float32Array(config.count * 3);
//       const colors    = new Float32Array(config.count * 3);
//       const sizes     = new Float32Array(config.count);
//       const velocities = [];
//       const lifetimes = [];
//       const maxLifetimes = [];
//       const angles = [];

//       for (let i = 0; i < config.count; i++) {
//         const i3 = i * 3;
//         const angle = Math.random() * Math.PI * 2;
//         const radius = Math.random() * config.spread;

//         positions[i3]     = Math.cos(angle) * radius;
//         positions[i3 + 1] = -0.5 - Math.random() * 0.5;
//         positions[i3 + 2] = Math.sin(angle) * radius;

//         // duller colors
//         const rand = 0.8 + Math.random() * 0.2;
//         colors[i3]     = config.color[0] * rand;
//         colors[i3 + 1] = config.color[1] * rand;
//         colors[i3 + 2] = config.color[2] * rand;

//         sizes[i] = Math.random() * config.size + 0.5;

//         velocities.push({
//           x: (Math.random() - 0.5) * 0.04,
//           y: config.speed + Math.random() * 0.08,
//           z: (Math.random() - 0.5) * 0.04
//         });

//         lifetimes.push(0);
//         maxLifetimes.push(100 + Math.random() * 60);
//         angles.push(angle);
//       }

//       geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
//       geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

//       const material = new THREE.PointsMaterial({
//         size: config.size,
//         map: flameTexture,
//         blending: THREE.AdditiveBlending,
//         depthWrite: false,
//         transparent: true,
//         vertexColors: true,
//         opacity: idx === 3 ? 0.6 : 0.75   // big layer slightly more transparent
//       });

//       const points = new THREE.Points(geometry, material);
//       scene.add(points);

//       fireLayers.push({ points, geometry, velocities, lifetimes, maxLifetimes, angles, config });
//     });

//     // Dim lights
//     const coreLight = new THREE.PointLight(0xff5500, 1.2, 18);
//     coreLight.position.set(0, 0, 0);
//     scene.add(coreLight);

//     const topLight = new THREE.PointLight(0xff3300, 0.6, 12);
//     topLight.position.set(0, 4, 0);
//     scene.add(topLight);

//     // Animation
//     let time = 0;
//     const animate = () => {
//       requestAnimationFrame(animate);
//       time += 0.016;

//       fireLayers.forEach(layer => {
//         const pos = layer.geometry.attributes.position.array;
//         const col = layer.geometry.attributes.color.array;
//         const sz  = layer.geometry.attributes.size.array;

//         for (let i = 0; i < layer.config.count; i++) {
//           const i3 = i * 3;
//           layer.lifetimes[i]++;

//           const life = layer.lifetimes[i] / layer.maxLifetimes[i];

//           // Spiral + turbulence
//           const angle = layer.angles[i] + time * (1.5 + layer.config.spread * 0.3);
//           pos[i3]     += layer.velocities[i].x + Math.cos(angle) * 0.015;
//           pos[i3 + 1] += layer.velocities[i].y;
//           pos[i3 + 2] += layer.velocities[i].z + Math.sin(angle) * 0.015;

//           pos[i3]     += Math.sin(time * 2.5 + i) * 0.008;
//           pos[i3 + 2] += Math.cos(time * 2.5 + i) * 0.008;

//           // Fade & cool down
//           if (life > 0.4) {
//             const fade = (life - 0.4) / 0.6;
//             col[i3]     *= 1 - fade * 0.6;
//             col[i3 + 1] *= 1 - fade * 0.8;
//             col[i3 + 2] *= 1 - fade * 0.9;
//             sz[i]       *= 0.98;
//           }

//           // Respawn
//           if (layer.lifetimes[i] > layer.maxLifetimes[i] || pos[i3 + 1] > layer.config.height) {
//             const a = Math.random() * Math.PI * 2;
//             const r = Math.random() * layer.config.spread;
//             pos[i3]     = Math.cos(a) * r;
//             pos[i3 + 1] = -0.5 - Math.random() * 0.3;
//             pos[i3 + 2] = Math.sin(a) * r;

//             layer.velocities[i] = {
//               x: (Math.random() - 0.5) * 0.04,
//               y: layer.config.speed + Math.random() * 0.06,
//               z: (Math.random() - 0.5) * 0.04
//             };

//             const rand = 0.8 + Math.random() * 0.2;
//             col[i3]     = layer.config.color[0] * rand;
//             col[i3 + 1] = layer.config.color[1] * rand;
//             col[i3 + 2] = layer.config.color[2] * rand;

//             sz[i] = Math.random() * layer.config.size + 0.5;
//             layer.lifetimes[i] = 0;
//             layer.maxLifetimes[i] = 100 + Math.random() * 60;
//             layer.angles[i] = a;
//           }
//         }

//         layer.geometry.attributes.position.needsUpdate = true;
//         layer.geometry.attributes.color.needsUpdate = true;
//         layer.geometry.attributes.size.needsUpdate = true;
//       });

//       // Flicker
//       coreLight.intensity = 1.2 + Math.sin(time * 7) * 0.3;
//       topLight.intensity  = 0.6 + Math.sin(time * 5) * 0.15;

//       renderer.render(scene, camera);
//     };
//     animate();

//     // Resize
//     const onResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', onResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', onResize);
//       containerRef.current?.removeChild(renderer.domElement);
//       fireLayers.forEach(l => {
//         l.geometry.dispose();
//         l.points.material.dispose();
//       });
//       flameTexture.dispose();
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: 'fixed',
//         inset: 0,
//         background: '#000',
//         overflow: 'hidden'
//       }}
//     />
//   );
// };

// export default FireFlameEffect;





















import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FireFlameEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 18);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Flame texture
    const createFlameTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0,   'rgba(192,155,106,0.9)');
      grad.addColorStop(0.3, 'rgba(235,144,98,0.7)');
      grad.addColorStop(0.6, 'rgba(231,142,118,0.4)');
      grad.addColorStop(1,   'rgba(40,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.Texture(canvas);
      tex.needsUpdate = true;
      return tex;
    };
    const flameTexture = createFlameTexture();

    const fireLayers = [];
    const layerConfigs = [
      { count: 180, spread: 1.2, height: 5,  speed: 0.35, size: 1.2, color: [1.0, 0.7, 0.3] },
      { count: 140, spread: 1.8, height: 6,  speed: 0.30, size: 1.6, color: [1.0, 0.5, 0.1] },
      { count: 100, spread: 2.4, height: 7,  speed: 0.25, size: 2.0, color: [0.9, 0.3, 0.0] },
      { count: 400, spread: 4.0, height: 9,  speed: 0.18, size: 3.5, color: [0.7, 0.2, 0.0] }
    ];

    layerConfigs.forEach((config, idx) => {
      const geometry = new THREE.BufferGeometry();
      const pos = new Float32Array(config.count * 3);
      const col = new Float32Array(config.count * 3);
      const sz  = new Float32Array(config.count);
      const velocities = [];
      const lifetimes = [];
      const maxLifetimes = [];
      const angles = [];

      for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;

        // 1. Pre-age: random lifetime + matching Y position
        const preAge = Math.random() * 80;           // 0~80 frames old
        const lifeRatio = preAge / 100;
        const y = -0.5 + lifeRatio * config.height;  // already part-way up

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * config.spread * (1 - lifeRatio * 0.5);

        pos[i3]     = Math.cos(angle) * radius + Math.sin(preAge * 0.1) * 0.3;
        pos[i3 + 1] = y;
        pos[i3 + 2] = Math.sin(angle) * radius + Math.cos(preAge * 0.1) * 0.3;

        const rand = 0.8 + Math.random() * 0.2;
        col[i3]     = config.color[0] * rand;
        col[i3 + 1] = config.color[1] * rand;
        col[i3 + 2] = config.color[2] * rand;

        sz[i] = (Math.random() * config.size + 0.5) * (1 - lifeRatio * 0.3);

        velocities.push({
          x: (Math.random() - 0.5) * 0.04,
          y: config.speed + Math.random() * 0.06,
          z: (Math.random() - 0.5) * 0.04
        });

        lifetimes.push(preAge);
        maxLifetimes.push(100 + Math.random() * 60);
        angles.push(angle);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      geometry.setAttribute('size',     new THREE.BufferAttribute(sz, 1));

      const material = new THREE.PointsMaterial({
        size: config.size,
        map: flameTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true,
        opacity: idx === 3 ? 0.6 : 0.75
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      fireLayers.push({ points, geometry, velocities, lifetimes, maxLifetimes, angles, config });
    });

    // Lights
    const coreLight = new THREE.PointLight(0xff5500, 1.2, 18);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);
    const topLight = new THREE.PointLight(0xff3300, 0.6, 12);
    topLight.position.set(0, 4, 0);
    scene.add(topLight);

    // 2. Warm-up: 1 second invisible render
    let warmedUp = false;
    let time = 0;
    const warmupFrames = 60;
    let frame = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      if (!warmedUp && frame++ > warmupFrames) {
        warmedUp = true; // now visible
      }

      fireLayers.forEach(layer => {
        const pos = layer.geometry.attributes.position.array;
        const col = layer.geometry.attributes.color.array;
        const sz  = layer.geometry.attributes.size.array;

        for (let i = 0; i < layer.config.count; i++) {
          const i3 = i * 3;
          if (warmedUp) layer.lifetimes[i]++;

          const life = layer.lifetimes[i] / layer.maxLifetimes[i];
          const angle = layer.angles[i] + time * (1.5 + layer.config.spread * 0.3);

          pos[i3]     += layer.velocities[i].x + Math.cos(angle) * 0.015;
          pos[i3 + 1] += layer.velocities[i].y;
          pos[i3 + 2] += layer.velocities[i].z + Math.sin(angle) * 0.015;

          pos[i3]     += Math.sin(time * 2.5 + i) * 0.008;
          pos[i3 + 2] += Math.cos(time * 2.5 + i) * 0.008;

          if (life > 0.4) {
            const fade = (life - 0.4) / 0.6;
            col[i3]     *= 1 - fade * 0.6;
            col[i3 + 1] *= 1 - fade * 0.8;
            col[i3 + 2] *= 1 - fade * 0.9;
            sz[i]       *= 0.98;
          }

          if (layer.lifetimes[i] > layer.maxLifetimes[i] || pos[i3 + 1] > layer.config.height) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * layer.config.spread;
            pos[i3]     = Math.cos(a) * r;
            pos[i3 + 1] = -0.5 - Math.random() * 0.3;
            pos[i3 + 2] = Math.sin(a) * r;

            layer.velocities[i] = {
              x: (Math.random() - 0.5) * 0.04,
              y: layer.config.speed + Math.random() * 0.06,
              z: (Math.random() - 0.5) * 0.04
            };

            const rand = 0.8 + Math.random() * 0.2;
            col[i3]     = layer.config.color[0] * rand;
            col[i3 + 1] = layer.config.color[1] * rand;
            col[i3 + 2] = layer.config.color[2] * rand;

            sz[i] = Math.random() * layer.config.size + 0.5;
            layer.lifetimes[i] = 0;
            layer.maxLifetimes[i] = 100 + Math.random() * 60;
            layer.angles[i] = a;
          }
        }

        layer.geometry.attributes.position.needsUpdate = true;
        layer.geometry.attributes.color.needsUpdate = true;
        layer.geometry.attributes.size.needsUpdate = true;
      });

      coreLight.intensity = 1.2 + Math.sin(time * 7) * 0.3;
      topLight.intensity  = 0.6 + Math.sin(time * 5) * 0.15;

      // Hide first 60 frames (1 sec)
      renderer.domElement.style.opacity = warmedUp ? '1' : '0';
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      containerRef.current?.removeChild(renderer.domElement);
      fireLayers.forEach(l => {
        l.geometry.dispose();
        l.points.material.dispose();
      });
      flameTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden'
      }}
    />
  );
};

export default FireFlameEffect;