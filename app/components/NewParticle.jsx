// app/about/page.js   (NO TypeScript!)
'use client';

import { useEffect, useRef } from 'react';

export default function ParticleAbout() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // === RESIZE ===
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // === MOUSE ===
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let isHovering = false;

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    canvas.addEventListener('mouseenter', () => (isHovering = true));
    canvas.addEventListener('mouseleave', () => (isHovering = false));

    // === PARTICLE CLASS ===
    class Particle {
      constructor(x, y, size, speedX, speedY, opacity) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = opacity;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.hoverOffset = 0;
        this.hoverSpeed = (Math.random() - 0.5) * 3;
      }

      update(centerX, centerY) {
        this.angle += this.angleSpeed;
        this.x = this.baseX + Math.sin(this.angle) * 20;
        this.y = this.baseY + Math.cos(this.angle) * 20;

        if (isHovering) {
          this.hoverOffset += this.hoverSpeed;
          this.x += this.hoverOffset * 0.5;
          this.hoverOffset *= 0.95;
        } else {
          this.hoverOffset *= 0.9;
          this.x += this.hoverOffset * 0.3;
        }

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = 150;
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 10;
          this.y -= Math.sin(angle) * force * 10;
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.size > 3) {
          ctx.globalAlpha = this.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      updateBase(oldX, oldY, newX, newY) {
        this.baseX = newX + (this.baseX - oldX);
        this.baseY = newY + (this.baseY - oldY);
      }
    }

    // === CREATE PARTICLES ===
    const particles = [];
    const initParticles = () => {
      particles.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 200 outer particles
      for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 300 * Math.pow(Math.random(), 0.5);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        particles.push(
          new Particle(
            x,
            y,
            Math.random() * 6 + 1,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            Math.random() * 0.6 + 0.2
          )
        );
      }

      // 30 bright core particles
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 100;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        particles.push(
          new Particle(
            x,
            y,
            Math.random() * 4 + 2,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.4 + 0.6
          )
        );
      }
    };

    initParticles();

    // === HANDLE RESIZE ===
    const handleResize = () => {
      const oldX = canvas.width / 2;
      const oldY = canvas.height / 2;
      resizeCanvas();
      const newX = canvas.width / 2;
      const newY = canvas.height / 2;
      particles.forEach(p => p.updateBase(oldX, oldY, newX, newY));
      mouseX = newX;
      mouseY = newY;
    };
    window.addEventListener('resize', handleResize);

    // === ANIMATION LOOP ===
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach(p => {
        p.update(centerX, centerY);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // === CLEANUP ===
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          cursor: 'pointer',
          background: '#0a0a0a',
        }}
      />

      {/* === YOUR HEYFYnix TEXT OVERLAY === */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '2rem',
          zIndex: 10,
        }}
      >
        {/* <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          Heyfynix
        </h1> */}
        {/* <p style={{ fontSize: '1.5rem', maxWidth: '600px', lineHeight: '1.6' }}>
          Like a phoenix rising, we help brands rebuild and shine brighter through visuals that connect on a real level.
        </p> */}
        {/* <button
          onClick={() => alert('Let’s rise together!')}
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            background: '#ff4d4d',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          Start Your Rise */}
        {/* </button> */}
      </div>
    </>
  );
}