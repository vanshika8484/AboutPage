// src/app/page.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ParticleGround from "./components/ParticleGround";
import Particles from "./components/Particles";
import Navbar from "./components/Navbar";
import Fireflames from "./components/Fireflames";
import Fire from "./components/Fire";
import NewFireFlames from "./components/NewFireFlames";
import FireVideo from "./components/FireVedio";



// In page.js
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;  
      const maxScroll = windowHeight * 1.5;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);

      // Track scroll state
      if (scrollY > 0 && !hasScrolled) setHasScrolled(true);
      if (scrollY < 10) setIsAtTop(true);
      else setIsAtTop(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Control which content to show
  const showInitialContent = !hasScrolled || isAtTop;
  const showSecondContent = scrollProgress > 0.6; // Trigger after 60% scroll
  const overlayOpacity = Math.min(scrollProgress * 2, 1);

  return (
    <div className="relative bg-black text-white min-h-screen w-screen overflow-x-hidden">
      <Navbar />


      {/* Particles Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
       {/* <NewFireFlames /> */}
        {/* <Fireflames /> */}
   {/* <Fire /> */}
   <FireVideo />
      </div>

      {/* Initial Title (Fades out on scroll) */}
      <div
        className={`relative z-10 pt-6 transition-opacity duration-700 ${
          showInitialContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="text-[clamp(100px,20vw,270px)] font-bold text-white pl-5 pr-5 pt-[300px] leading-none  ">
          HEYFYNIX
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white text-right pr-10 -mt-16 md:-mt-5">
          SCROLL TO EXPLORE
        </h2>
      </div>

      {/* Scroll-Revealed Background + Content */}
      <div className="fixed inset-0 z-10 overflow-hidden">
        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9))",
            opacity: overlayOpacity,
          }}
        />

        {/* Background Image */}
        <Image
          src="/img.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
          style={{
            opacity: overlayOpacity,
            transform: `scale(${1 + scrollProgress * 0.15})`,
            transition: "opacity 0.5s ease, transform 0.8s ease-out",
          }}
        />

        {/* First Text: "A Creative non-agency..." */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-700"
          style={{
            opacity: scrollProgress > 0.1 && !showSecondContent ? 1 : 0,
            transform: `translateY(${scrollProgress > 0.1 && !showSecondContent ? 0 : 30}px)`,
          }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            A Creative non-agency
          </h2>
          <p className="text-lg md:text-2xl text-white max-w-3xl">
            We’re A Creative Space, A group of Genius Individuals.
          </p>
        </div>

        {/* Second Text: "Who We Are..." (Replaces the first) */}
       {/* Second Text: "Who We Are..." (Replaces the first) */}
<div
  className="absolute inset-0 px-6 mt-[350px] transition-all duration-700"
  style={{
    opacity: showSecondContent ? 1 : 0,
    transform: `translateY(${showSecondContent ? 0 : -40}px)`,
  }}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
    {/* Left Column - Who We Are */}
    <div>
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Who We Are
      </h2>
      <p className="text-base md:text-lg text-white leading-relaxed">
        We're Heyfynix. A team of passionate creators who turn ideas into stories that stick. 
        Like a phoenix rising, we help brands rebuild and shine brighter through visuals, 
        edits, and rhythms that connect on a real level. We solve creative challenges with heart, 
        turning visions into experiences that engage and inspire.
      </p>
    </div>

    {/* Right Column - Hey, Nice to Meet You! */}
    <div className="flex flex-col mt-[100px] items-start md:items-end justify-start">
      <div className="text-right">
        <h3 className="text-6xl md:text-7xl font-medium text-white mb-6">
          Hey, Nice to Meet You!
        </h3>
        {/* Add any additional content you want on the right side */}
      </div>
    </div>
  </div>
</div>
      </div>

      {/* Extra Scroll Space */}
      <div className="h-[300vh]" />
    </div>
  );
}