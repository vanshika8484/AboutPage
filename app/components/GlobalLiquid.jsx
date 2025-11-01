// GlobalLiquidHover.jsx
"use client";

import { useEffect, useState, useRef } from "react";

export default function GlobalLiquidHover() {
  const [ripples, setRipples] = useState([]);
  const debounceRef = useRef(null);

  // ---------- Ripple handling ----------
  const addRipple = (x, y) => {
    if (debounceRef.current) return; // 60 ms debounce

    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);

    // Remove after animation finishes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1100);

    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
    }, 60);
  };

  useEffect(() => {
    const onMouse = (e) => addRipple(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      addRipple(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ---------- Render ----------
  return (
    <>
      {/* SVG filter – identical to Lusion */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="lusion-liquid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="8"
              seed="3"
              result="turb"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.38 0.62 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Ripples container */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {ripples.map((r) => (
          <div
            key={r.id}
            className="lusion-blob"
            style={{
              left: r.x,
              top: r.y,
            }}
          />
        ))}
      </div>



      {/* Inline CSS for animation */}
      <style jsx>{`
        @keyframes lusionBlob {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.85;
          }
          100% {
            transform: translate(-50%, -50%) scale(9);
            opacity: 0;
          }
        }

        .lusion-blob {
          position: absolute;
          width: 70px;
          height: 10px;
          background: radial-gradient(
            circle at center,
            rgba(229, 233, 233, 0.92) 0%,
            rgba(61, 60, 60, 0.45) 45%,
            transparent 90%
          );
          border-radius: 50%;
          filter: url(#lusion-liquid) blur(0.8px);
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
          box-shadow: 0 0 22px rgba(105, 104, 104, 0.7);
          mix-blend-mode: screen;
          animation: lusionBlob 1.1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
}