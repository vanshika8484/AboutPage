// src/app/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ParticleGround from "./components/ParticleGround";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";

export default function Home() {

  return (
    <div className="relative bg-black text-white min-h-screen w-screen overflow-x-hidden">

      {/* ----- Nav ----- */}
      {/* <nav className="fixed inset-x-0 top-0 z-50 bg-black/50 backdrop-blur-md p-4 flex justify-between items-center">
        <span className="text-xl font-bold">HEYFYNIX</span>
        <div className="flex space-x-6">
          {["Home", "About", "Services", "Contact"].map((l) => (
            <a key={l} href="#" className="text-white hover:text-gray-300 transition">
              {l}
            </a>
          ))}
        </div>
      </nav> */}
<Navbar />
      {/* ----- Hero ----- */}
      <div className="relative z-10 pt-6">
        <ParticleGround />
        <Particles />

        {/* Title */}
        <h1
          className="text-[270px] font-bold text-white pl-[20px] pr-[20px] pt-[240px] mb-0"
        >
          HEYFYNIX
        </h1>

        <h2 className="text-[30px] font-bold text-white text-right pr-[40px] -mt-20">
          SCROLL TO EXPLORE
        </h2>

       
        {/* Extra scroll space */}
        <div className="h-screen" />
      </div>
    </div>
  );
}