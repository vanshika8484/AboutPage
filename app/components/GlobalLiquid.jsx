"use client";
import { useEffect, useState, useRef } from "react";
export default function GlobalLiquidHover() {
    const [ripples, setRipples] = useState([]);
   const audioContextRef = useRef(null);
   // Initialize Web Audio API
   const initAudio = () => {
     if (!audioContextRef.current) {
       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
     }return audioContextRef.current;
   };
   // Play a subtle liquid "blip" sound (generated tone: soft sine wave)
   const playLiquidSound = () => {
     const audioContext = initAudio();
     if (!audioContext) return;
     const oscillator = audioContext.createOscillator();
     const gainNode = audioContext.createGain();
     oscillator.connect(gainNode);
     gainNode.connect(audioContext.destination);
     oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High, soft tone
     oscillator.type = 'sine';
     gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
     oscillator.start(audioContext.currentTime);
     oscillator.stop(audioContext.currentTime + 0.2);
   };
   useEffect(() => {
     let timeout = null;
     const addRipple = (x, y) => {
       if (timeout) return;
       playLiquidSound(); // Add sound here!
       const id = Date.now() + Math.random();
       setRipples((prev) => [...prev, { id, x, y }]);
       setTimeout(() => {
         setRipples((prev) => prev.filter((r) => r.id !== id));
       }, 1000);
       timeout = setTimeout(() => {
         timeout = null;
       }, 60);
     };
     const onMove = (e) => addRipple(e.clientX, e.clientY);
     const onTouch = (e) => {
       const t = e.touches[0];
       addRipple(t.clientX, t.clientY);
     };
     window.addEventListener("mousemove", onMove);
     window.addEventListener("touchstart", onTouch);
     return () => {
       window.removeEventListener("mousemove", onMove);
       window.removeEventListener("touchstart", onTouch);
       if (timeout) clearTimeout(timeout);
     };
   }, []);
   return (
     <>
       {/* SVG Filter for Liquid Effect */}
       <svg width="0" height="0" className="absolute">
         <defs>
           <filter id="liquid-filter">
             <feTurbulence
               type="fractalNoise"
               baseFrequency="0.02"
               numOctaves="3"
               result="noise"
             />
             <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
             <feDisplacementMap
               in="SourceGraphic"
               in2="noise"
               scale="30"
               xChannelSelector="R"
               yChannelSelector="G"
             />
             <feComponentTransfer>
               <feFuncA type="table" tableValues="0 0.4 0.6 1" />
             </feComponentTransfer>
           </filter>
         </defs>
         </svg>
       <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
         {ripples.map((r) => (
           <div
             key={r.id}
             className="liquid-blob"
             style={{
               left: r.x,
               top: r.y,
               animation: "blob 1s ease-out forwards",
             }}
           />
         ))}
       </div>
       <style jsx>{`
@keyframes blob {
0% {
transform: translate(-50%, -50%) scale(0.1);
opacity: 0.8;
}
100% {
transform: translate(-50%, -50%) scale(8);
opacity: 0;
}
}
.liquid-blob {
position: absolute;
width: 30px;
height: 30px;
background: radial-gradient(circle at center,rgba(255, 255, 255, 0.9) 0%,rgba(255, 255, 255, 0.4) 50%,transparent 80%);
border-radius: 50%;
filter: url(#liquid-filter) blur(1px);
transform: translate(-50%, -50%) scale(0.1);
pointer-events: none;
box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
mix-blend-mode: screen;
}
`}</style>
</>
);
}