'use client';

import { useRef, useState } from 'react';

export default function FireVideo() {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed inset-0 flex -top-20 items-center justify-center overflow-hidden bg-black">
      
      {/* BIGGER VIDEO - Starts at 110%, Grows to 130% */}
      <video
        ref={videoRef}
        src="/videos/fire.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={`
          absolute 
          min-w-[110vw] min-h-[110vh]   /* ← DEFAULT: 110% of screen */
          object-cover 
          transition-all duration-700 ease-out
          ${isHovered 
            ? 'min-w-[130vw] min-h-[130vh] scale-110 brightness-125' 
            : 'min-w-[110vw] min-h-[110vh] scale-100'
          }
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* <span className="text-9xl animate-pulse drop-shadow-2xl">🔥</span> */}
      </div>

      {/* Optional Text - Stays Centered */}
      {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white text-5xl font-bold tracking-widest drop-shadow-2xl">
        INFERNO MODE
      </div> */}
    </div>
  );
}