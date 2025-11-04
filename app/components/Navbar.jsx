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
      <div className="fixed left-16 top-10 z-50">
        <h1 className="text-white text-[30px] font-bold leading-none rotate-0">
          HEYFYNIX
        </h1>
      </div>

      {/* RIGHT SIDE BUTTON GROUP */}
      <div className="fixed right-20 top-10 z-50 flex flex-row items-center space-x-6">
        {/* SOUND BUTTON */}
        {/* <button
          onClick={() => setSoundOn((prev) => !prev)}
          className="w-12 h-12 flex items-center justify-center rounded-full 
                     bg-gray-200 backdrop-blur-md border border-white/30 
                     text-black text-2xl  transition cursor-pointer hover:bg-blue-500"
          aria-label={soundOn ? "Mute" : "Unmute"}
        >
          {/* 2. Show Minus when muted, Activity when playing */}
          {/* {soundOn ? (
            <Image src="/Activity.svg" alt="Sound on" width={24} height={24} className="invert-0"   />
          ) : (
            <Image src="/Minus.svg" alt="Sound off" width={24} height={24} className="invert-0" />
          )}
        </button> */} 

       <button
  onClick={() => setSoundOn((prev) => !prev)}
  className="relative w-12 h-12 flex items-center justify-center rounded-full 
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
       {/* LET'S TALK */}
<button
  className="flex items-center h-12 gap-4 px-6 py-2 p-4 rounded-full bg-gray-700 backdrop-blur-md 
              text-white text-md font-semibold tracking-wider 
             hover:bg-white/30 transition group"
>
  <span className="relative">
    LET'S TALK
    <span className="absolute top-3 -right-4 w-1 h-1 bg-white rounded-full 
                    group-hover:animate-pulse"></span>
  </span>
</button>

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="px-6 py-2 h-10 rounded-full bg-gray-200 backdrop-blur-md 
                     border border-white/30 text-black text-md font-bold tracking-wider 
                     hover:bg-white/30 transition"
        >
         <span className="relative">
    MENU
    <span className="absolute top-2 -right-4 w-1 h-1 bg-black rounded-full 
                    group-hover:animate-pulse"></span>
                    <span className="absolute top-2 -right-2 w-1 h-1 bg-black rounded-full 
                    group-hover:animate-pulse"></span>
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