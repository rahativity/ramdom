import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { CPUArchitecture } from '../components/diagrams/CPUArchitecture';

interface Slide01WelcomeProps {
  onExplore: () => void;
}

export const Slide01Welcome: React.FC<Slide01WelcomeProps> = ({ onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.welcome-badge',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
        .fromTo(
          '.welcome-title-line',
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.welcome-sub',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.welcome-btn',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.2'
        )
        .fromTo(
          '.welcome-chip',
          { scale: 0.92, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.7'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-6"
    >
      {/* Left Column: Editorial Typography matching Reference Image */}
      <div className="flex-1 max-w-xl z-10 flex flex-col justify-center">
        {/* Subtle Presentation Attribution Tag */}
        <div className="welcome-badge mb-4">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2868E8] bg-[#2868E8]/10 px-3 py-1 rounded-full border border-[#2868E8]/20">
            Computer Architecture
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-[#102A50] leading-[1.08] tracking-tight mb-5">
          <span className="welcome-title-line block">Data Path vs.</span>
          <span className="welcome-title-line block">Controller</span>
          <span className="welcome-title-line block text-[#2868E8]">Architecture</span>
        </h1>

        {/* Supporting Subtitle */}
        <div className="welcome-sub mb-8">
          <p className="text-lg sm:text-xl text-[#102A50]/75 font-normal">
            Understanding the Core of a Processor
          </p>
          <div className="w-16 h-[2px] bg-[#2868E8] mt-3 rounded-full" />
        </div>

        {/* Call to action "Let's Explore" matching Reference Image */}
        <div className="welcome-btn">
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-[#F8FAFF] text-[#102A50] font-heading font-semibold text-base border border-[#2868E8]/25 shadow-sm hover:shadow-md hover:border-[#2868E8]/50 transition-all duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#2868E8] flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
            <span>Let's Explore</span>
          </button>
        </div>
      </div>

      {/* Right Column: Isometric CPU Illustration */}
      <div className="welcome-chip flex-1 flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
        <CPUArchitecture mode="hero" className="w-full max-w-[440px]" />
      </div>
    </div>
  );
};

