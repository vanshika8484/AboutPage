// app/about/page.js   ← NO TypeScript! Just pure JS + React
'use client';

import { useEffect, useRef } from 'react';

export default function ParticlePhoenix() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let isHovering = false;

    canvas.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    canvas.addEventListener('mouseenter', () => isHovering = true);
    canvas.addEventListener('mouseleave', () => isHovering = false);

    // Particle Class
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
        this.angleSpeed = (Math.random() - 0.5) * 0.08;
        this.hoverOffset = 0;
        this.hoverSpeed = (Math.random() - 0.5) * 8;
        this.velocityX = (Math.random() - 0.5) * 2;
        this.velocityY = (Math.random() - 0.5) * 2;
      }

      update(centerX, centerY) {
        this.angle += this.angleSpeed;
        this.x = this.baseX + Math.sin(this.angle) * 40;
        this.y = this.baseY + Math.cos(this.angle) * 40;

        this.baseX += this.velocityX * 0.3;
        this.baseY += this.velocityY * 0.3;

        const distFromCenter = Math.hypot(this.baseX - centerX, this.baseY - centerY);
        if (distFromCenter > 350) {
          const angleToCenter = Math.atan2(centerY - this.baseY, centerX - this.baseX);
          this.velocityX = Math.cos(angleToCenter) * 2;
          this.velocityY = Math.sin(angleToCenter) * 2;
        }

        if (isHovering) {
          this.hoverOffset += this.hoverSpeed;
          this.x += this.hoverOffset * 1.2;
          this.hoverOffset *= 0.92;
        } else {
          this.hoverOffset *= 0.85;
          this.x += this.hoverOffset * 0.5;
        }

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = 200;
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 20;
          this.y -= Math.sin(angle) * force * 20;
          this.velocityX -= Math.cos(angle) * force * 0.5;
          this.velocityY -= Math.sin(angle) * force * 0.5;
        }

        this.velocityX *= 0.98;
        this.velocityY *= 0.98;
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

      updateBase(oldCX, oldCY, newCX, newCY) {
        this.baseX = newCX + (this.baseX - oldCX);
        this.baseY = newCY + (this.baseY - oldCY);
      }
    }

    const particles = [];

    const initParticles = () => {
      particles.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 250 tight outer particles
      for (let i = 0; i < 250; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 150 * Math.pow(Math.random(), 2);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        particles.push(new Particle(
          x, y,
          Math.random() * 5 + 1,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          Math.random() * 0.5 + 0.3
        ));
      }

      // 50 bright core
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 60;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        particles.push(new Particle(
          x, y,
          Math.random() * 6 + 2,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          Math.random() * 0.3 + 0.7
        ));
      }
    };
    initParticles();

    // Resize handler
    const handleResize = () => {
      const oldCX = canvas.width / 6;
      const oldCY = canvas.height / 6;
      resize();
      const newCX = canvas.width / 6;
      const newCY = canvas.height / 6;
      particles.forEach(p => p.updateBase(oldCX, oldCY, newCX, newCY));
      mouseX = newCX;
      mouseY = newCY;
      initParticles(); // Re-center cluster
    };
    window.addEventListener('resize', handleResize);

    // Animation
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach(p => {
        p.update(centerX, centerY);
        p.draw();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Full-screen canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#0a0a0a',
          cursor: 'pointer',
        }}
      />

      {/* Heyfynix Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        color: 'white',
        textAlign: 'center',
        zIndex: 10,
        padding: '2rem',
      }}>
        {/* <h1 style={{
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          fontWeight: 900,
          letterSpacing: '0.05em',
          textShadow: '0 0 40px rgba(255,255,255,0.8)',
          marginBottom: '1rem',
        }}>
          HEYFYNIX
        </h1> */}
        {/* <p style={{
          fontSize: '1.4rem',
          maxWidth: '700px',
          lineHeight: '1.7',
          opacity: 0.9,
          marginBottom: '2rem',
        }}>
          A Creative Space where engineers become storytellers. 
          We turn code into cameras, ideas into fire.
        </p> */}
        {/* <button style={{
          padding: '1rem 3rem',
          fontSize: '1.3rem',
          background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
          border: 'none',
          borderRadius: '50px',
          color: 'white',
          cursor: 'pointer',
          pointerEvents: 'auto',
          boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
          transition: 'all 0.3s',
        }}
        onMouseOver={e => e.target.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.target.style.transform = 'translateY(0)'}
        >
          Rise With Us
        </button> */}
      </div>
    </>
  );
}