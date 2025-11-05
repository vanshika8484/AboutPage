'use client';

import { useState, useRef } from 'react';

export default function FullScreenFire() {
  const [mouseX, setMouseX] = useState(0);     // -1 ~ +1
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const power = (e.clientX - centerX) / (rect.width / 2);
    setMouseX(power);

    // Spawn 3 fiery sparks
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const s = {
          id: Date.now() + i,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          vx: power * 60 + (Math.random() - 0.5) * 40,
        };
        setSparks(p => [...p, s]);
        setTimeout(() => setSparks(p => p.filter(x => x.id !== s.id)), 1800);
      }, i * 100);
    }
  };

  return (
    <>
      {/* FULL-SCREEN CONTAINER */}
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden cursor-none"
        onMouseMove={handleMove}
        onMouseLeave={() => { setMouseX(0); setSparks([]); }}
      >
        {/* 1. FULL-SCREEN FIRE VIDEO */}
        <video
          src="/videos/fire.mp4"
          autoPlay muted loop playsInline
          className="fixed inset-0 w-screen h-screen object-cover"
          style={{
            transform: `
              translateX(${mouseX * 16}%)
              translateY(calc(${-Math.abs(mouseX) * 12}% - 10vh))
              scale(${1 + Math.abs(mouseX) * 0.4})
            `,
            filter: `
              brightness(${1 + Math.abs(mouseX) * 0.7})
              contrast(1.5)
              hue-rotate(${mouseX * 25}deg)
              saturate(1.4)
            `,
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* 2. GLOBAL SVG FILTER — Affects EVERYTHING */}
        <svg width="0" height="0" className="fixed inset-0">
          <defs>
            <filter id="fullFire">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="7">
                <animate attributeName="baseFrequency" values="0.04;0.07;0.04" dur="5s" repeatCount="indefinite"/>
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                scale={Math.abs(mouseX) * 90}
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feOffset dx={mouseX * 50} dy={-Math.abs(mouseX) * 60} />
              <feGaussianBlur stdDeviation="6"/>
            </filter>
          </defs>
        </svg>

        {/* 3. FULL-SCREEN HEAT GLOW */}
        <div
          className="fixed inset-0 pointer-events-none mix-blend-screen"
          style={{
            background: `
              radial-gradient(circle at ${48 + mouseX * 42}% ${65}%, 
                #ff9500cc, #ff440088 25%, #ff110044 50%, transparent 80%)
            `,
            filter: 'url(#fullFire) blur(12px)',
          }}
        />

        {/* 4. FLYING EMBERS — EVERYWHERE */}
        {sparks.map(s => (
          <div
            key={s.id}
            className="fixed w-4 h-4 rounded-full pointer-events-none"
            style={{
              left: s.x,
              top: s.y,
              background: '#ffff99',
              boxShadow: '0 0 30px #ff6600, 0 0 60px #ff2200',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="ember" style={{ '--vx': `${s.vx}px` }} />
          </div>
        ))}

        {/* 5. INVISIBLE WIND TORCH (your cursor) */}
        <div
          className="fixed w-32 h-64 rounded-full blur-3xl opacity-75 pointer-events-none mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #ffaa00, #ff5500, transparent)',
            left: '50%',
            top: '60%',
            transform: `translateX(${mouseX * 400}px) translateY(-50%) scale(${1 + Math.abs(mouseX) * 0.5})`,
            transition: 'transform 0.4s ease-out',
            filter: 'url(#fullFire)',
          }}
        />
      </div>

      {/* FULL-SCREEN INSTRUCTION */}
      {/* <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-10 text-5xl font-black tracking-widest text-orange-200/90">
        ← BLOW THE FLAMES →
      </div> */}

      {/* CSS */}
      <style jsx>{`
        @keyframes emberFly {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--vx)), -400px) scale(0); opacity: 0; }
        }
        .ember {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: inherit;
          box-shadow: inherit;
          animation: emberFly 1.8s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }
        .ember::before,
        .ember::after {
          content: '';
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 20px #ff9900;
          animation: emberFly 1.8s 0.1s forwards;
        }
        .ember::before  { left: -15px; }
        .ember::after   { right: -15px; }
      `}</style>
    </>
  );
}