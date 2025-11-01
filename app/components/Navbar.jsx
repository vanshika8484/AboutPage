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
          LUSION
        </h1>
      </div>

      {/* RIGHT SIDE BUTTON GROUP */}
      <div className="fixed right-20 top-10 z-50 flex flex-row items-center space-x-6">
        {/* SOUND BUTTON */}
        <button
          onClick={() => setSoundOn((prev) => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-full 
                     bg-gray-900 backdrop-blur-md border border-white/30 
                     text-black text-2xl hover:bg-white/30 transition"
          aria-label={soundOn ? "Mute" : "Unmute"}
        >
          {/* 2. Show Minus when muted, Activity when playing */}
          {soundOn ? (
            <Image src="/Activity.svg" alt="Sound on" width={24} height={24} />
          ) : (
            <Image src="/Minus.svg" alt="Sound off" width={24} height={24} />
          )}
        </button>

        {/* LET'S TALK */}
        <button
          className="px-6 py-2 rounded-full bg-gray-900 backdrop-blur-md 
                     border border-white/30 text-white text-sm tracking-wider 
                     hover:bg-white/30 transition"
        >
          LET'S TALK
        </button>

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="px-6 py-2 rounded-full bg-white backdrop-blur-md 
                     border border-white/30 text-black text-sm tracking-wider 
                     hover:bg-white/30 transition"
        >
          MENU
        </button>
      </div>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40" />
      )}
    </>
  );
}