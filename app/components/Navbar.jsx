"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function LusionNavbar() {
  // ---- 1. Start muted -------------------------------------------------
  const [soundOn, setSoundOn] = useState(false);   // ← changed to false
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef(null);

  // -----------------------------------------------------------------
  // 1. Create the Audio element once (on mount) and keep it in a ref
  // -----------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/sounds/audio.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // -----------------------------------------------------------------
  // 2. Play / pause when `soundOn` changes
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!audioRef.current) return;

    if (soundOn) {
      audioRef.current
        .play()
        .catch((e) => console.warn("Audio play failed (user interaction required?)", e));
    } else {
      audioRef.current.pause();
    }
  }, [soundOn]);

  // -----------------------------------------------------------------
  // 3. UI
  // -----------------------------------------------------------------
  return (
    <>
      {/* LEFT SIDE VERTICAL LOGO */}
      <div className="fixed left-16 top-12 z-50">
        <h1 className="text-white text-[22px] font-bold leading-none rotate-0">
          HEYFYNIX
        </h1>
      </div>

      {/* RIGHT SIDE BUTTON GROUP */}
      <div className="fixed right-10 top-10 z-50 flex flex-row items-center space-x-6">
        {/* SOUND BUTTON */}
       
       <button
  onClick={() => setSoundOn((prev) => !prev)}
  className="relative w-10 h-10 flex items-center justify-center rounded-full 
             bg-gray-200 backdrop-blur-md border border-white/30 
             text-black text-2xl transition cursor-pointer hover:bg-blue-500"
  aria-label={soundOn ? "Mute" : "Unmute"}
>
  {/* Sound wave icon when on */}
  {soundOn ? (
    <Image src="/Activity.svg" alt="Sound on" width={24} height={24}   />
  ) : (
    // Diagonal line when muted
    <div className="relative w-6 h-6">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-black transform " />
    </div>
  )}
</button>



     
       {/* LET'S TALK */}

       <button className="group relative px-6 py-2 rounded-full bg-white/20 backdrop-blur-md 
                            text-white font-bold tracking-tighter
                           hover:bg-blue-500 transition-all duration-300 flex items-center gap-4">
          <span>LET'S TALK</span>
       </button>


        {/* MENU BUTTON */}
       <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="px-6 py-2 rounded-full bg-gray-200 backdrop-blur-md 
                     border border-white text-black font-semibold tracking-wider 
                     hover:bg-white transition-all duration-300 flex items-center gap-2"
        >
          MENU
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            
          </span>
        </button>
      </div>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40" />
      )}
    </>
  );
}