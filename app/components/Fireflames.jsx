
"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Fireflames() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [phoenixVisible, setPhoenixVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fire particles
    const particles = [];
    const particleCount = 150;
    let time = 0;

    // Controlled spawn: 30% early, rest staggered
    let spawnedCount = 0;
    const totalToSpawn = Math.floor(particleCount * 0.3);
    const spawnInterval = 60;
    let spawnTimer = 0;

    // Phoenix
    const phoenixParticles = [];
    let phoenixTime = 0;
    let phoenixOpacity = 0;

    // -----------------------------------------------------------------
    // PARTICLE CLASS
    // -----------------------------------------------------------------
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

        if (this.life <= 0 || this.y < -100) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = this.life * this.flicker;

        const layers = 3;
        for (let layer = 0; layer < layers; layer++) {
          const layerSize = this.size * (1 - layer * 0.2);
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, layerSize);

          if (this.life > 0.8) {
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.2, "rgba(255, 255, 200, 0.9)");
            gradient.addColorStop(0.4, "rgba(255, 200, 0, 0.7)");
            gradient.addColorStop(0.7, "rgba(255, 100, 0, 0.4)");
            gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
          } else if (this.life > 0.5) {
            gradient.addColorStop(0, "rgba(255, 255, 100, 0.9)");
            gradient.addColorStop(0.3, "rgba(255, 150, 0, 0.8)");
            gradient.addColorStop(0.6, "rgba(255, 80, 0, 0.5)");
            gradient.addColorStop(0.85, "rgba(200, 0, 0, 0.2)");
            gradient.addColorStop(1, "rgba(100, 0, 0, 0)");
          } else if (this.life > 0.2) {
            gradient.addColorStop(0, "rgba(255, 120, 0, 0.7)");
            gradient.addColorStop(0.4, "rgba(220, 50, 0, 0.5)");
            gradient.addColorStop(0.7, "rgba(150, 0, 0, 0.3)");
            gradient.addColorStop(1, "rgba(80, 0, 0, 0)");
          } else {
            gradient.addColorStop(0, "rgba(100, 30, 0, 0.4)");
            gradient.addColorStop(0.5, "rgba(60, 20, 20, 0.2)");
            gradient.addColorStop(1, "rgba(40, 40, 40, 0)");
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, layerSize, 0, Math.PI * 2);
          ctx.fill();
        }

        if (this.life > 0.6) {
          ctx.globalAlpha = (this.life - 0.6) * 0.3 * this.flicker;
          const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.5);
          glow.addColorStop(0, "rgba(255, 200, 100, 0.3)");
          glow.addColorStop(0.5, "rgba(255, 100, 0, 0.1)");
          glow.addColorStop(1, "rgba(255, 0, 0, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // -----------------------------------------------------------------
    // PHOENIX PARTICLE CLASS
    // -----------------------------------------------------------------
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
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();
        this.size = (Math.random() * 8 + 4) * (0.5 + pulse * 0.5);
        this.life = 0.8 + pulse * 0.2;
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < this.trail.length; i++) {
          const p = this.trail[i];
          const a = (i / this.trail.length) * this.life * phoenixOpacity * 0.3;
          ctx.globalAlpha = a;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, this.size);
          g.addColorStop(0, "rgba(255,200,0,1)");
          g.addColorStop(0.5, "rgba(255,100,0,0.5)");
          g.addColorStop(1, "rgba(255,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = this.life * phoenixOpacity;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        g.addColorStop(0, "rgba(255,255,200,1)");
        g.addColorStop(0.3, "rgba(255,200,0,0.9)");
        g.addColorStop(0.6, "rgba(255,100,0,0.6)");
        g.addColorStop(1, "rgba(200,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // -----------------------------------------------------------------
    // FULL PHOENIX CREATION — RESTORED & COMPLETE
    // -----------------------------------------------------------------
    function createPhoenix() {
      phoenixParticles.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.25;

      // Body - elongated
      for (let i = 0; i < 25; i++) {
        const t = i / 25;
        const bodyY = centerY - 20 + t * 60;
        const bodyWidth = 20 * Math.sin(t * Math.PI);
        for (let j = -1; j <= 1; j += 0.5) {
          phoenixParticles.push(
            new PhoenixParticle(centerX + j * bodyWidth, bodyY, Math.atan2(j, t), 5 + Math.random() * 3)
          );
        }
      }

      // Head
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        phoenixParticles.push(
          new PhoenixParticle(centerX + Math.cos(angle) * 8, centerY - 30 + Math.sin(angle) * 8, angle, 8)
        );
      }

      // Beak
      for (let i = 0; i < 5; i++) {
        phoenixParticles.push(new PhoenixParticle(centerX + 12 + i * 3, centerY - 30, 0, 3));
      }

      // Left Wing
      for (let i = 0; i < 60; i++) {
        const t = i / 60;
        const wingCurve = Math.sin(t * Math.PI) * 80;
        const wingX = centerX - 25 - t * 100;
        const wingY = centerY - wingCurve * 0.3;
        phoenixParticles.push(new PhoenixParticle(wingX, wingY, Math.PI + t * 0.5, wingCurve * 0.3, true));
      }

      // Right Wing
      for (let i = 0; i < 60; i++) {
        const t = i / 60;
        const wingCurve = Math.sin(t * Math.PI) * 80;
        const wingX = centerX + 25 + t * 100;
        const wingY = centerY - wingCurve * 0.3;
        phoenixParticles.push(new PhoenixParticle(wingX, wingY, -t * 0.5, wingCurve * 0.3, true));
      }

      // Tail
      for (let strand = 0; strand < 5; strand++) {
        const strandAngle = -0.3 + strand * 0.15;
        for (let i = 0; i < 30; i++) {
          const t = i / 30;
          const tailLength = 80 + strand * 20;
          const tailX = centerX + Math.sin(strandAngle) * t * tailLength;
          const tailY = centerY + 40 + Math.cos(strandAngle) * t * tailLength;
          phoenixParticles.push(new PhoenixParticle(tailX, tailY, strandAngle + Math.PI * 0.5, 10 * (1 - t)));
        }
      }

      // Crest
      for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const crestAngle = -Math.PI * 0.5 + (t - 0.5) * 0.8;
        const crestLength = 20 + Math.sin(t * Math.PI) * 15;
        phoenixParticles.push(
          new PhoenixParticle(
            centerX + Math.sin(crestAngle) * crestLength * 0.5,
            centerY - 35 - Math.cos(crestAngle) * crestLength,
            crestAngle,
            crestLength * 0.3
          )
        );
      }
    }

    // -----------------------------------------------------------------
    // INITIALIZE PARTICLES (30% early spawn)
    // -----------------------------------------------------------------
    for (let i = 0; i < totalToSpawn; i++) {
      const p = new Particle();
      p.y = canvas.height + 20;
      p.life = 1;
      particles.push(p);
      spawnedCount++;
    }

    for (let i = spawnedCount; i < particleCount; i++) {
      const p = new Particle();
      p.y = canvas.height + 20;
      p.life = 0;
      particles.push(p);
    }

    // Show phoenix after 2s
    setTimeout(() => {
      setPhoenixVisible(true);
      createPhoenix();
    }, 2000);

    // -----------------------------------------------------------------
    // HEAT DISTORTION
    // -----------------------------------------------------------------
    function drawHeatDistortion() {
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "#1a0a00";
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
      ctx.restore();
    }

    // -----------------------------------------------------------------
    // ANIMATION LOOP
    // -----------------------------------------------------------------
    let lastTime = performance.now();

    function animate() {
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      time += 0.02;

      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHeatDistortion();

      // Staggered spawn
      spawnTimer += delta;
      if (spawnTimer > spawnInterval && spawnedCount < particleCount) {
        const p = particles[spawnedCount];
        p.y = canvas.height + 20;
        p.life = 1;
        p.reset();
        spawnedCount++;
        spawnTimer = 0;
      }

      particles.sort((a, b) => a.life - b.life);
      particles.forEach((p) => p.life > 0 && p.update(time) && p.draw());

      // Phoenix
      if (phoenixParticles.length > 0) {
        phoenixTime += 0.02;
        if (phoenixOpacity < 1) phoenixOpacity += 0.01;

        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.25 + Math.sin(phoenixTime) * 10;

        phoenixParticles.forEach((p) => {
          p.baseX = centerX + (p.baseX - canvas.width / 2);
          p.baseY = centerY + (p.baseY - canvas.height * 0.25);
          p.update(phoenixTime, centerX, centerY);
          p.draw();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // -----------------------------------------------------------------
    // RESIZE
    // -----------------------------------------------------------------
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      spawnedCount = 0;
      particles.forEach((p, i) => {
        p.baseY = canvas.height + 20;
        p.y = p.baseY;
        p.life = i < totalToSpawn ? 1 : 0;
      });
      if (phoenixParticles.length > 0) createPhoenix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-900/5 to-transparent pointer-events-none" />
    </section>
  );
}