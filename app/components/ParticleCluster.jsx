'use client';

import { useEffect, useRef } from 'react';

export default function ParticleCluster() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

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
        this.hoverSpeed = (Math.random() - 0.5) * 8;
      }

      update(centerX, centerY) {
        // Floating animation
        this.angle += this.angleSpeed;
        let targetX = this.baseX + Math.sin(this.angle) * 30;
        let targetY = this.baseY + Math.cos(this.angle) * 30;

        // HOVER EFFECT - calculate offset from center
        const mouseOffsetX = mouseX - centerX;
        const mouseOffsetY = mouseY - centerY;
        
        // Apply horizontal movement based on mouse position
        const horizontalStrength = mouseOffsetX / (canvas.width / 2);
        targetX += horizontalStrength * Math.abs(this.hoverSpeed) * 3;
        
        // Apply vertical movement based on mouse position
        const verticalStrength = mouseOffsetY / (canvas.height / 2);
        targetY += verticalStrength * Math.abs(this.hoverSpeed) * 1.5;

        // Set position
        this.x = targetX;
        this.y = targetY;

        // Mouse repulsion
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 15;
          this.y -= Math.sin(angle) * force * 15;
        }

        // Gentle pull back to base position
        const distFromBase = Math.sqrt(Math.pow(this.x - this.baseX, 2) + Math.pow(this.y - this.baseY, 2));
        if (distFromBase > 80) {
          const pullAngle = Math.atan2(this.baseY - this.y, this.baseX - this.x);
          this.x += Math.cos(pullAngle) * 0.5;
          this.y += Math.sin(pullAngle) * 0.5;
        }
      }

      draw() {
        ctx.save();
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
        ctx.restore();
      }

      updateBasePosition(oldCenterX, oldCenterY, newCenterX, newCenterY) {
        const offsetX = this.baseX - oldCenterX;
        const offsetY = this.baseY - oldCenterY;
        this.baseX = newCenterX + offsetX;
        this.baseY = newCenterY + offsetY;
      }
    }

    const particles = [];

    function initParticles() {
      particles.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Layer 1: Core - 80 particles within 60px
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 60 * Math.pow(Math.random(), 2.5);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = Math.random() * 6 + 2;
        const speedX = (Math.random() - 0.5) * 0.3;
        const speedY = (Math.random() - 0.5) * 0.3;
        const opacity = Math.random() * 0.3 + 0.6;

        particles.push(new Particle(x, y, size, speedX, speedY, opacity));
      }

      // Layer 2: Inner - 120 particles 60-120px (more spread)
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 60 + Math.random() * 60 * Math.pow(Math.random(), 1.5);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = Math.random() * 5 + 1.5;
        const speedX = (Math.random() - 0.5) * 0.4;
        const speedY = (Math.random() - 0.5) * 0.4;
        const opacity = Math.random() * 0.3 + 0.4;

        particles.push(new Particle(x, y, size, speedX, speedY, opacity));
      }

      // Layer 3: Middle - 150 particles 120-200px (looser)
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 80 * Math.pow(Math.random(), 1.2);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = Math.random() * 4 + 1;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        const opacity = Math.random() * 0.3 + 0.3;

        particles.push(new Particle(x, y, size, speedX, speedY, opacity));
      }

      // Layer 4: Outer - 100 particles 200-280px (very spread)
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 200 + Math.random() * 80;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = Math.random() * 3 + 1;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        const opacity = Math.random() * 0.3 + 0.2;

        particles.push(new Particle(x, y, size, speedX, speedY, opacity));
      }
    }

    initParticles();

    function animate() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // FIXED: Clear with solid black to prevent trails
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update(centerX, centerY);
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      console.log('Mouse:', mouseX, mouseY, 'Center:', canvas.width/2, canvas.height/2); // Debug
    };

    const handleResize = () => {
      const oldCenterX = canvas.width / 2;
      const oldCenterY = canvas.height / 2;
      
      resizeCanvas();
      
      const newCenterX = canvas.width / 2;
      const newCenterY = canvas.height / 2;
      
      particles.forEach(particle => {
        particle.updateBasePosition(oldCenterX, oldCenterY, newCenterX, newCenterY);
      });
      
      mouseX = newCenterX;
      mouseY = newCenterY;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        cursor: 'pointer',
        background: '#0a0a0a',
      }}
    />
  );
}