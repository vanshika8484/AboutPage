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

    // ────── Fire Particles (unchanged) ──────
    const particles = [];
    const particleCount = 180;
    let time = 0;

    // ────── Phoenix System ──────
    const phoenix = {
      particles: [],
      glowParticles: [],
      featherParticles: [],
      time: 0,
      opacity: 0,
      centerX: canvas.width / 2,
      centerY: canvas.height * 0.25,
    };

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height * 0.5 + canvas.height * 0.5;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 10;
        this.size = Math.random() * 15 + 5;
        this.speedY = -Math.random() * 3 - 2;
        this.speedX = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.hue = Math.random() * 20 + 20; // Orange-red hue range
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.01;
        
        if (this.opacity <= 0 || this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.opacity;
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${this.hue + 10}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ────── HIGH-RES PHOENIX CLASSES ──────
    class BodyParticle {
      constructor(x, y, hue = 30) {
        this.x = x; this.y = y; this.hue = hue;
        this.size = Math.random() * 12 + 8;
        this.life = 1;
        this.trail = [];
      }
      update(t, cx, cy) {
        const dx = cx - this.x;
        const dy = cy - this.y;
        const dist = Math.hypot(dx, dy);
        const pull = Math.min(dist / 200, 1);
        this.x += dx * 0.02 * pull;
        this.y += dy * 0.02 * pull;

        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 12) this.trail.shift();

        const pulse = Math.sin(t * 8) * 0.2 + 0.8;
        this.size = (Math.random() * 12 + 8) * pulse;
      }
      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.life * phoenix.opacity;

        // Trail glow
        this.trail.forEach((p, i) => {
          ctx.globalAlpha = (i / this.trail.length) * 0.4 * phoenix.opacity;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, this.size * 0.8);
          grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, 0.9)`);
          grad.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(p.x - this.size, p.y - this.size, this.size * 2, this.size * 2);
        });

        // Core
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0,   `hsla(${this.hue}, 100%, 95%, 1)`);
        grad.addColorStop(0.3, `hsla(${this.hue}, 100%, 70%, 0.9)`);
        grad.addColorStop(0.7, `hsla(${this.hue + 20}, 100%, 50%, 0.6)`);
        grad.addColorStop(1,   `hsla(${this.hue + 40}, 100%, 30%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Sharp inner ember
        ctx.globalAlpha = phoenix.opacity;
        const inner = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 0.4);
        inner.addColorStop(0, 'rgba(255,255,255,1)');
        inner.addColorStop(1, 'rgba(255,220,150,0)');
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    class FeatherParticle {
      constructor(baseX, baseY, angle, length, side) {
        this.baseX = baseX; this.baseY = baseY;
        this.angle = angle; this.length = length; this.side = side;
        this.tipX = 0; this.tipY = 0;
        this.wave = Math.random() * Math.PI * 2;
      }
      update(t, cx, cy) {
        const flap = Math.sin(t * 5 + this.wave) * 15;
        const sway = Math.cos(t * 2) * 8;
        const angle = this.angle + flap * this.side + sway * 0.2;

        this.tipX = this.baseX + Math.cos(angle) * this.length;
        this.tipY = this.baseY + Math.sin(angle) * this.length;

        // Pull toward center
        this.tipX += (cx - this.tipX) * 0.015;
        this.tipY += (cy - this.tipY) * 0.015;
      }
      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = phoenix.opacity * 0.9;
        ctx.strokeStyle = `hsla(${25 + Math.sin(phoenix.time*3)*10}, 90%, 65%, 0.8)`;
        ctx.lineWidth = 3 + Math.sin(phoenix.time*10) * 1.5;
        ctx.lineCap = 'round';

        // Feather shaft
        ctx.beginPath();
        ctx.moveTo(this.baseX, this.baseY);
        ctx.quadraticCurveTo(
          (this.baseX + this.tipX) / 2,
          (this.baseY + this.tipY) / 2 - 10,
          this.tipX, this.tipY
        );
        ctx.stroke();

        // Barbs
        for (let i = 0; i < 8; i++) {
          const t = i / 7;
          const bx = this.baseX + (this.tipX - this.baseX) * t;
          const by = this.baseY + (this.tipY - this.baseY) * t;
          const barbLen = this.length * 0.25 * (1 - t);
          const barbAngle = this.angle + Math.PI/2 * this.side;

          ctx.globalAlpha = phoenix.opacity * (0.6 - t*0.4);
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(
            bx + Math.cos(barbAngle) * barbLen,
            by + Math.sin(barbAngle) * barbLen
          );
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ────── BUILD MAGNIFICENT PHOENIX ──────
    function forgePhoenix() {
      phoenix.particles.length = 0;
      phoenix.glowParticles.length = 0;
      phoenix.featherParticles.length = 0;

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.25;

      // === BODY (layered molten core) ===
      const bodyPoints = [
        [0,0], [10,-15], [15,-30], [12,-45], [0,-50], [-12,-45],
        [-15,-30], [-10,-15], [-8,-5], [8,-5]
      ];
      bodyPoints.forEach(([ox, oy], i) => {
        for (let j = 0; j < 6; j++) {
          const angle = (Math.PI*2 * j)/6;
          const r = 4 + j;
          phoenix.particles.push(new BodyParticle(
            cx + ox + Math.cos(angle)*r,
            cy + oy + Math.sin(angle)*r,
            15 + i*3
          ));
        }
      });

      // === HEAD & CREST (crown of fire) ===
      for (let i = 0; i < 30; i++) {
        const a = Math.PI * 1.3 + (i/30)*0.8;
        const r = 18 + Math.pow(i/30, 2)*25;
        phoenix.particles.push(new BodyParticle(
          cx + Math.cos(a)*r*0.6,
          cy - 55 + Math.sin(a)*r,
          35
        ));
      }

      // === WINGS (sweeping, layered feathers) ===
      const wingLayers = 5;
      for (let layer = 0; layer < wingLayers; layer++) {
        const spread = 80 + layer*25;
        const yOffset = layer*8;
        const hue = 20 + layer*8;
        const side = layer % 2 ? 1 : -1;

        for (let i = 0; i < 18; i++) {
          const t = i / 17;
          const baseX = cx + side * (40 + t*spread);
          const baseY = cy + yOffset + Math.sin(t*Math.PI)*30;
          const len = 60 + t*90 + layer*20;

          phoenix.featherParticles.push(new FeatherParticle(
            baseX, baseY,
            side * (Math.PI * 0.65 + t*0.3),
            len, side
          ));
        }
      }

      // === TAIL (flowing comet strands) ===
      for (let strand = 0; strand < 7; strand++) {
        const angle = -0.25 + strand*0.083;
        const hue = 5 + strand*6;
        for (let i = 0; i < 22; i++) {
          const t = i / 21;
          const len = 100 + strand*40 + t*120;
          phoenix.particles.push(new BodyParticle(
            cx + Math.sin(angle)*len * t,
            cy + 50 + Math.cos(angle)*len * t,
            hue
          ));
        }
      }

      // === EYE (sharp white-hot ember) ===
      phoenix.particles.push(new BodyParticle(cx + 8, cy - 38, 60));
      phoenix.particles.push(new BodyParticle(cx + 10, cy - 40, 60));
    }

    // ────── INITIALIZE ──────
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = canvas.height - Math.random() * canvas.height * 0.7;
      p.life = Math.random() * 0.8 + 0.2;
      particles.push(p);
    }

    setTimeout(() => {
      setPhoenixVisible(true);
      forgePhoenix();
    }, 2000);

    // ────── HEAT DISTORTION ──────
    function drawHeatDistortion() {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#2c1400';
      ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);
      ctx.restore();
    }

    // ────── ANIMATION LOOP ──────
    function animate() {
      time += 0.016;
      phoenix.time += 0.016;

      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawHeatDistortion();

      // Fire
      particles.forEach(p => { p.update(time); p.draw(); });

      // Phoenix
      if (phoenix.particles.length) {
        phoenix.opacity = Math.min(phoenix.opacity + 0.008, 1);
        const cx = canvas.width / 2;
        const cy = canvas.height * 0.25 + Math.sin(phoenix.time * 1.2) * 12;

        // Global phoenix glow
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
        glow.addColorStop(0, 'rgba(255,180,60,0.25)');
        glow.addColorStop(0.4, 'rgba(255,80,0,0.12)');
        glow.addColorStop(1, 'rgba(200,0,0,0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = phoenix.opacity * 0.4;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update & draw
        [...phoenix.particles, ...phoenix.featherParticles].forEach(p => {
          if (p.update) p.update(phoenix.time, cx, cy);
          p.draw();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    // ────── RESIZE ──────
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      phoenix.centerX = canvas.width / 2;
      phoenix.centerY = canvas.height * 0.25;
      if (phoenix.particles.length) forgePhoenix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Optional overlay text (uncomment if you want it back) */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-red-600 drop-shadow-2xl animate-pulse">
          PHOENIX
        </h1>
      </div> */}
    </section>
  );
}