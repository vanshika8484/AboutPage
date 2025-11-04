import React, { useEffect, useRef, useState } from 'react';

export default function Fireflames() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [phoenixVisible, setPhoenixVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fire particles
    const particles = [];
    const particleCount = 150;
    let time = 0;

    // Phoenix particles
    const phoenixParticles = [];
    let phoenixTime = 0;
    let phoenixOpacity = 0;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.baseY = canvas.height + 20;
        this.y = this.baseY;
        this.size = Math.random() * 60 + 30;
        this.baseSpeedY = Math.random() * 2 + 1.5;
        this.speedY = this.baseSpeedY;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.004;
        this.turbulence = Math.random() * 0.5 + 0.3;
        this.offset = Math.random() * Math.PI * 2;
        this.flicker = Math.random() * 0.3 + 0.7;
      }

      update(t) {
        const turbulenceX = Math.sin(t * this.turbulence + this.offset) * 2;
        const turbulenceY = Math.cos(t * this.turbulence * 0.5 + this.offset) * 0.5;
        
        this.y -= this.speedY + turbulenceY;
        this.x += this.speedX + turbulenceX;
        
        this.speedY = this.baseSpeedY * (1 + (1 - this.life) * 0.5);
        
        this.life -= this.decay;
        this.size *= 0.985;
        
        this.flicker = 0.7 + Math.sin(t * 10 + this.offset) * 0.3;

        if (this.life <= 0 || this.y < -100) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.life * this.flicker;

        const layers = 3;
        for (let layer = 0; layer < layers; layer++) {
          const layerSize = this.size * (1 - layer * 0.2);
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, layerSize
          );

          if (this.life > 0.8) {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(255, 255, 200, 0.9)');
            gradient.addColorStop(0.4, 'rgba(255, 200, 0, 0.7)');
            gradient.addColorStop(0.7, 'rgba(255, 100, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          } else if (this.life > 0.5) {
            gradient.addColorStop(0, 'rgba(255, 255, 100, 0.9)');
            gradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.8)');
            gradient.addColorStop(0.6, 'rgba(255, 80, 0, 0.5)');
            gradient.addColorStop(0.85, 'rgba(200, 0, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(100, 0, 0, 0)');
          } else if (this.life > 0.2) {
            gradient.addColorStop(0, 'rgba(255, 120, 0, 0.7)');
            gradient.addColorStop(0.4, 'rgba(220, 50, 0, 0.5)');
            gradient.addColorStop(0.7, 'rgba(150, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(80, 0, 0, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(100, 30, 0, 0.4)');
            gradient.addColorStop(0.5, 'rgba(60, 20, 20, 0.2)');
            gradient.addColorStop(1, 'rgba(40, 40, 40, 0)');
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, layerSize, 0, Math.PI * 2);
          ctx.fill();
        }

        if (this.life > 0.6) {
          ctx.globalAlpha = (this.life - 0.6) * 0.3 * this.flicker;
          const glowGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 1.5
          );
          glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
          glowGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.1)');
          glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Phoenix particle class
    class PhoenixParticle {
      constructor(x, y, angle, speed, isWing = false) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.size = Math.random() * 8 + 4;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.offset = Math.random() * Math.PI * 2;
        this.isWing = isWing;
        this.trail = [];
      }

      update(t, centerX, centerY) {
        const pulse = Math.sin(t * 2 + this.offset) * 0.5 + 0.5;
        const wingFlap = this.isWing ? Math.sin(t * 4) * 20 : 0;
        
        this.x = this.baseX + Math.cos(this.angle + t * 0.5) * (this.speed + wingFlap);
        this.y = this.baseY + Math.sin(this.angle + t * 0.5) * (this.speed * 0.5);
        
        // Add to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
          this.trail.shift();
        }
        
        this.size = (Math.random() * 8 + 4) * (0.5 + pulse * 0.5);
        this.life = 0.8 + pulse * 0.2;
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          const trailAlpha = (i / this.trail.length) * this.life * phoenixOpacity * 0.3;
          ctx.globalAlpha = trailAlpha;
          
          const gradient = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, this.size);
          gradient.addColorStop(0, 'rgba(255, 200, 0, 1)');
          gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
          gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw main particle
        ctx.globalAlpha = this.life * phoenixOpacity;
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.9)');
        gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Create Phoenix shape - more bird-like silhouette
    function createPhoenix() {
      phoenixParticles.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.25;
      
      // Body - elongated and streamlined
      for (let i = 0; i < 25; i++) {
        const t = i / 25;
        const bodyY = centerY - 20 + t * 60;
        const bodyWidth = 20 * Math.sin(t * Math.PI); // Oval body shape
        
        for (let j = -1; j <= 1; j += 0.5) {
          phoenixParticles.push(new PhoenixParticle(
            centerX + j * bodyWidth, 
            bodyY, 
            Math.atan2(j, t), 
            5 + Math.random() * 3
          ));
        }
      }
      
      // Head - smaller and defined
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        phoenixParticles.push(new PhoenixParticle(
          centerX + Math.cos(angle) * 8, 
          centerY - 30 + Math.sin(angle) * 8, 
          angle, 
          8
        ));
      }
      
      // Beak
      for (let i = 0; i < 5; i++) {
        phoenixParticles.push(new PhoenixParticle(
          centerX + 12 + i * 3, 
          centerY - 30, 
          0, 
          3
        ));
      }
      
      // Left Wing - swept back arc
      for (let i = 0; i < 60; i++) {
        const t = i / 60;
        const wingCurve = Math.sin(t * Math.PI) * 80;
        const wingX = centerX - 25 - t * 100;
        const wingY = centerY - wingCurve * 0.3;
        
        phoenixParticles.push(new PhoenixParticle(
          wingX, 
          wingY, 
          Math.PI + t * 0.5, 
          wingCurve * 0.3, 
          true
        ));
      }
      
      // Right Wing - swept back arc
      for (let i = 0; i < 60; i++) {
        const t = i / 60;
        const wingCurve = Math.sin(t * Math.PI) * 80;
        const wingX = centerX + 25 + t * 100;
        const wingY = centerY - wingCurve * 0.3;
        
        phoenixParticles.push(new PhoenixParticle(
          wingX, 
          wingY, 
          -t * 0.5, 
          wingCurve * 0.3, 
          true
        ));
      }
      
      // Tail feathers - elegant flowing strands
      for (let strand = 0; strand < 5; strand++) {
        const strandAngle = -0.3 + strand * 0.15;
        for (let i = 0; i < 30; i++) {
          const t = i / 30;
          const tailLength = 80 + strand * 20;
          const tailX = centerX + Math.sin(strandAngle) * t * tailLength;
          const tailY = centerY + 40 + Math.cos(strandAngle) * t * tailLength;
          
          phoenixParticles.push(new PhoenixParticle(
            tailX, 
            tailY, 
            strandAngle + Math.PI * 0.5, 
            10 * (1 - t)
          ));
        }
      }
      
      // Head crest - flame crown
      for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const crestAngle = -Math.PI * 0.5 + (t - 0.5) * 0.8;
        const crestLength = 20 + Math.sin(t * Math.PI) * 15;
        
        phoenixParticles.push(new PhoenixParticle(
          centerX + Math.sin(crestAngle) * crestLength * 0.5, 
          centerY - 35 - Math.cos(crestAngle) * crestLength, 
          crestAngle, 
          crestLength * 0.3
        ));
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
      particles[i].y = canvas.height - Math.random() * canvas.height * 0.8;
      particles[i].life = Math.random();
    }

    // Show phoenix after 2 seconds
    setTimeout(() => {
      setPhoenixVisible(true);
      createPhoenix();
    }, 2000);

    function drawHeatDistortion() {
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#1a0a00';
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
      ctx.restore();
    }

    // Animation loop
    function animate() {
      time += 0.02;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHeatDistortion();

      particles.sort((a, b) => a.life - b.life);

      particles.forEach(particle => {
        particle.update(time);
        particle.draw();
      });

      // Animate Phoenix
      if (phoenixParticles.length > 0) {
        phoenixTime += 0.02;
        
        // Fade in phoenix
        if (phoenixOpacity < 1) {
          phoenixOpacity += 0.01;
        }
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.25 + Math.sin(phoenixTime) * 10;
        
        phoenixParticles.forEach(particle => {
          particle.baseX = centerX + (particle.baseX - canvas.width / 2);
          particle.baseY = centerY + (particle.baseY - canvas.height * 0.25);
          particle.update(phoenixTime, centerX, centerY);
          particle.draw();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (phoenixParticles.length > 0) {
        createPhoenix();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Fire Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-900/5 to-transparent pointer-events-none" />

      {/* Phoenix Badge */}
      {/* {phoenixVisible && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-white font-semibold">Phoenix Rising</span>
          </div>
        </div>
      )} */}

      {/* Content Overlay */}
      {/* <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center mt-32">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl" style={{textShadow: '0 0 30px rgba(255, 150, 0, 0.5), 0 0 60px rgba(255, 100, 0, 0.3)'}}>
            Rise from the Ashes
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg">
            Witness the majestic phoenix soar through flames
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/50 transform hover:scale-105">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30 hover:border-orange-400/50">
              Learn More
            </button>
          </div>
        </div>
      </div> */}

      {/* Bottom gradient overlay */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-5" /> */}
    </section>
  );
}















// "use client";

// import React, { useEffect, useRef, useState } from "react";

// export default function Fireflames() {
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);
//   const [phoenixVisible, setPhoenixVisible] = useState(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     // Fire particles
//     const particles = [];
//     const particleCount = 150;
//     let time = 0;

//     // NEW: Controlled spawn
//     let spawnedCount = 0;
//     const totalToSpawn = Math.floor(particleCount * 0.3); // 30% spawn early
//     const spawnInterval = 60; // ms
//     let spawnTimer = 0;

//     // Phoenix
//     const phoenixParticles = [];
//     let phoenixTime = 0;
//     let phoenixOpacity = 0;

//     // -----------------------------------------------------------------
//     // PARTICLE CLASS
//     // -----------------------------------------------------------------
//     class Particle {
//       constructor() {
//         this.reset();
//       }

//       reset() {
//         this.x = Math.random() * canvas.width;
//         this.baseY = canvas.height + 20;
//         this.y = this.baseY;
//         this.size = Math.random() * 60 + 30;
//         this.baseSpeedY = Math.random() * 2 + 1.5;
//         this.speedY = this.baseSpeedY;
//         this.speedX = (Math.random() - 0.5) * 1.5;
//         this.life = 1;
//         this.decay = Math.random() * 0.008 + 0.004;
//         this.turbulence = Math.random() * 0.5 + 0.3;
//         this.offset = Math.random() * Math.PI * 2;
//         this.flicker = Math.random() * 0.3 + 0.7;
//       }

//       update(t) {
//         const turbulenceX = Math.sin(t * this.turbulence + this.offset) * 2;
//         const turbulenceY = Math.cos(t * this.turbulence * 0.5 + this.offset) * 0.5;

//         this.y -= this.speedY + turbulenceY;
//         this.x += this.speedX + turbulenceX;

//         this.speedY = this.baseSpeedY * (1 + (1 - this.life) * 0.5);
//         this.life -= this.decay;
//         this.size *= 0.985;
//         this.flicker = 0.7 + Math.sin(t * 10 + this.offset) * 0.3;

//         if (this.life <= 0 || this.y < -100) {
//           this.reset();
//         }
//       }

//       draw() {
//         ctx.save();
//         ctx.globalCompositeOperation = "lighter";
//         ctx.globalAlpha = this.life * this.flicker;

//         const layers = 3;
//         for (let layer = 0; layer < layers; layer++) {
//           const layerSize = this.size * (1 - layer * 0.2);
//           const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, layerSize);

//           if (this.life > 0.8) {
//             gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
//             gradient.addColorStop(0.2, "rgba(255, 255, 200, 0.9)");
//             gradient.addColorStop(0.4, "rgba(255, 200, 0, 0.7)");
//             gradient.addColorStop(0.7, "rgba(255, 100, 0, 0.4)");
//             gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
//           } else if (this.life > 0.5) {
//             gradient.addColorStop(0, "rgba(255, 255, 100, 0.9)");
//             gradient.addColorStop(0.3, "rgba(255, 150, 0, 0.8)");
//             gradient.addColorStop(0.6, "rgba(255, 80, 0, 0.5)");
//             gradient.addColorStop(0.85, "rgba(200, 0, 0, 0.2)");
//             gradient.addColorStop(1, "rgba(100, 0, 0, 0)");
//           } else if (this.life > 0.2) {
//             gradient.addColorStop(0, "rgba(255, 120, 0, 0.7)");
//             gradient.addColorStop(0.4, "rgba(220, 50, 0, 0.5)");
//             gradient.addColorStop(0.7, "rgba(150, 0, 0, 0.3)");
//             gradient.addColorStop(1, "rgba(80, 0, 0, 0)");
//           } else {
//             gradient.addColorStop(0, "rgba(100, 30, 0, 0.4)");
//             gradient.addColorStop(0.5, "rgba(60, 20, 20, 0.2)");
//             gradient.addColorStop(1, "rgba(40, 40, 40, 0)");
//           }

//           ctx.fillStyle = gradient;
//           ctx.beginPath();
//           ctx.arc(this.x, this.y, layerSize, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         if (this.life > 0.6) {
//           ctx.globalAlpha = (this.life - 0.6) * 0.3 * this.flicker;
//           const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.5);
//           glow.addColorStop(0, "rgba(255, 200, 100, 0.3)");
//           glow.addColorStop(0.5, "rgba(255, 100, 0, 0.1)");
//           glow.addColorStop(1, "rgba(255, 0, 0, 0)");
//           ctx.fillStyle = glow;
//           ctx.beginPath();
//           ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         ctx.restore();
//       }
//     }

//     // -----------------------------------------------------------------
//     // PHOENIX PARTICLE (unchanged)
//     // -----------------------------------------------------------------
//     class PhoenixParticle {
//       constructor(x, y, angle, speed, isWing = false) {
//         this.baseX = x;
//         this.baseY = y;
//         this.x = x;
//         this.y = y;
//         this.angle = angle;
//         this.speed = speed;
//         this.size = Math.random() * 8 + 4;
//         this.life = 1;
//         this.decay = Math.random() * 0.02 + 0.01;
//         this.offset = Math.random() * Math.PI * 2;
//         this.isWing = isWing;
//         this.trail = [];
//       }

//       update(t, centerX, centerY) {
//         const pulse = Math.sin(t * 2 + this.offset) * 0.5 + 0.5;
//         const wingFlap = this.isWing ? Math.sin(t * 4) * 20 : 0;
//         this.x = this.baseX + Math.cos(this.angle + t * 0.5) * (this.speed + wingFlap);
//         this.y = this.baseY + Math.sin(this.angle + t * 0.5) * (this.speed * 0.5);
//         this.trail.push({ x: this.x, y: this.y });
//         if (this.trail.length > 10) this.trail.shift();
//         this.size = (Math.random() * 8 + 4) * (0.5 + pulse * 0.5);
//         this.life = 0.8 + pulse * 0.2;
//       }

//       draw() {
//         ctx.save();
//         ctx.globalCompositeOperation = "lighter";
//         for (let i = 0; i < this.trail.length; i++) {
//           const p = this.trail[i];
//           const a = (i / this.trail.length) * this.life * phoenixOpacity * 0.3;
//           ctx.globalAlpha = a;
//           const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, this.size);
//           g.addColorStop(0, "rgba(255,200,0,1)");
//           g.addColorStop(0.5, "rgba(255,100,0,0.5)");
//           g.addColorStop(1, "rgba(255,0,0,0)");
//           ctx.fillStyle = g;
//           ctx.beginPath();
//           ctx.arc(p.x, p.y, this.size * 0.5, 0, Math.PI * 2);
//           ctx.fill();
//         }
//         ctx.globalAlpha = this.life * phoenixOpacity;
//         const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
//         g.addColorStop(0, "rgba(255,255,200,1)");
//         g.addColorStop(0.3, "rgba(255,200,0,0.9)");
//         g.addColorStop(0.6, "rgba(255,100,0,0.6)");
//         g.addColorStop(1, "rgba(200,0,0,0)");
//         ctx.fillStyle = g;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//       }
//     }

//     // -----------------------------------------------------------------
//     // CREATE PHOENIX (same)
//     // -----------------------------------------------------------------
//     function createPhoenix() {
//       phoenixParticles.length = 0;
//       const centerX = canvas.width / 2;
//       const centerY = canvas.height * 0.25;
//       // ... (your full phoenix creation code)
//       // (Copy-paste from previous version – unchanged)
//     }

//     // -----------------------------------------------------------------
//     // INITIALIZE: Only spawn 30% early
//     // -----------------------------------------------------------------
//     for (let i = 0; i < totalToSpawn; i++) {
//       const p = new Particle();
//       p.y = canvas.height + 20;
//       p.life = 1;
//       particles.push(p);
//       spawnedCount++;
//     }

//     // Rest will spawn gradually
//     for (let i = spawnedCount; i < particleCount; i++) {
//       const p = new Particle();
//       p.y = canvas.height + 20;
//       p.life = 0; // Hidden until spawned
//       particles.push(p);
//     }

//     // Show phoenix after 2s
//     setTimeout(() => {
//       setPhoenixVisible(true);
//       createPhoenix();
//     }, 2000);

//     // -----------------------------------------------------------------
//     // HEAT DISTORTION
//     // -----------------------------------------------------------------
//     function drawHeatDistortion() {
//       ctx.save();
//       ctx.globalAlpha = 0.05;
//       ctx.fillStyle = "#1a0a00";
//       ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
//       ctx.restore();
//     }

//     // -----------------------------------------------------------------
//     // ANIMATION LOOP – with staggered spawn
//     // -----------------------------------------------------------------
//     let lastTime = performance.now();

//     function animate() {
//       const now = performance.now();
//       const delta = now - lastTime;
//       lastTime = now;

//       time += 0.02;

//       // Clear with fade
//       ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       drawHeatDistortion();

//       // === STAGGERED SPAWN ===
//       spawnTimer += delta;
//       if (spawnTimer > spawnInterval && spawnedCount < particleCount) {
//         const p = particles[spawnedCount];
//         p.y = canvas.height + 20;
//         p.life = 1;
//         p.reset(); // Ensure fresh values
//         spawnedCount++;
//         spawnTimer = 0;
//       }

//       // Update & draw
//       particles.sort((a, b) => a.life - b.life);
//       particles.forEach((particle) => {
//         if (particle.life > 0) {
//           particle.update(time);
//           particle.draw();
//         }
//       });

//       // Phoenix
//       if (phoenixParticles.length > 0) {
//         phoenixTime += 0.02;
//         if (phoenixOpacity < 1) phoenixOpacity += 0.01;

//         const centerX = canvas.width / 2;
//         const centerY = canvas.height * 0.25 + Math.sin(phoenixTime) * 10;

//         phoenixParticles.forEach((particle) => {
//           particle.baseX = centerX + (particle.baseX - canvas.width / 2);
//           particle.baseY = centerY + (particle.baseY - canvas.height * 0.25);
//           particle.update(phoenixTime, centerX, centerY);
//           particle.draw();
//         });
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     }

//     animate();

//     // -----------------------------------------------------------------
//     // RESIZE
//     // -----------------------------------------------------------------
//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;

//       // Reset spawn
//       spawnedCount = 0;
//       particles.forEach((p, i) => {
//         p.baseY = canvas.height + 20;
//         p.y = p.baseY;
//         p.life = i < totalToSpawn ? 1 : 0;
//       });

//       if (phoenixParticles.length > 0) createPhoenix();
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, []);

//   return (
//     <section className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
//       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
//       <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-900/5 to-transparent pointer-events-none" />
//     </section>
//   );
// }
