import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { CPUArchitecture } from '../components/diagrams/CPUArchitecture';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide01WelcomeProps {
  onExplore: () => void;
}

export const Slide01Welcome: React.FC<Slide01WelcomeProps> = ({ onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set(
        ['.welcome-badge', '.welcome-title-line', '.welcome-sub', '.welcome-btn', '.welcome-highlights', '.welcome-chip'],
        { opacity: 1, x: 0, y: 0, scale: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.welcome-badge',
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
      )
        .fromTo(
          '.welcome-title-line',
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          '-=0.25'
        )
        .fromTo(
          '.welcome-sub',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.welcome-btn',
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' },
          '-=0.25'
        )
        .fromTo(
          '.welcome-highlights',
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.25'
        )
        .fromTo(
          '.welcome-chip',
          { scale: 0.94, opacity: 0, y: 22 },
          { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          0.1
        );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-8 xl:px-10 py-2 lg:py-3 overflow-y-auto lg:overflow-hidden"
    >
      <div className="w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-10 2xl:gap-12 items-center">
        {/* Left Column: Editorial Typography */}
        <div className="lg:col-span-6 z-10 flex flex-col justify-center">
          {/* Presentation Attribution Tag */}
          <div className="welcome-badge mb-3 sm:mb-4">
            <span className="inline-block text-xs xl:text-[13px] uppercase tracking-wider font-mono font-semibold text-[#1B54C7] bg-[#2868E8]/10 px-3.5 py-1 rounded-full border border-[#2868E8]/25">
              Computer Architecture
            </span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-[#102A50] leading-[1.08] tracking-tight mb-3.5 sm:mb-5">
            <span className="welcome-title-line block">Data Path vs.</span>
            <span className="welcome-title-line block">Controller</span>
            <span className="welcome-title-line block text-[#2868E8]">Architecture</span>
          </h1>

          {/* Supporting Subtitle */}
          <div className="welcome-sub mb-5 sm:mb-7">
            <p className="text-base sm:text-xl xl:text-[22px] 2xl:text-2xl text-[#102A50]/75 font-normal">
              Understanding the Core of a Processor
            </p>
            <div className="w-16 xl:w-20 h-[2px] bg-[#2868E8] mt-2.5 sm:mt-3 rounded-full" />
          </div>

          {/* Call to Action "Let's Explore" */}
          <div className="welcome-btn">
            <button
              type="button"
              onClick={onExplore}
              className={`group inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 xl:py-4 rounded-full bg-white hover:bg-[#F8FAFF] text-[#102A50] font-heading font-semibold text-sm sm:text-base xl:text-lg border border-[#2868E8]/25 shadow-sm hover:shadow-md hover:border-[#2868E8]/50 ${
                reducedMotion ? '' : 'transition-all duration-200'
              } cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2868E8] focus-visible:ring-offset-2`}
            >
              <div
                className={`w-8 h-8 rounded-full bg-[#2868E8] flex items-center justify-center text-white ${
                  reducedMotion ? '' : 'transition-transform group-hover:translate-x-1'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Let's Explore</span>
            </button>
          </div>

          {/* Topic Highlights */}
          <div className="welcome-highlights mt-5 sm:mt-7 pt-3.5 sm:pt-4 border-t border-[#102A50]/12 flex flex-wrap gap-2 text-xs sm:text-[13px] xl:text-sm font-mono text-[#102A50]/75">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 shadow-xs">
              01 • Execution vs Control
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 shadow-xs">
              02 • ALU & Registers
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 shadow-xs">
              03 • Instruction Cycle
            </span>
          </div>
        </div>

        {/* Right Column: Isometric CPU Illustration */}
        <div className="welcome-chip lg:col-span-6 flex items-center justify-center lg:justify-end">
          <CPUArchitecture
            mode="hero"
            className="w-full max-w-[240px] sm:max-w-[350px] lg:max-w-[490px] xl:max-w-[560px] 2xl:max-w-[650px]"
          />
        </div>
      </div>
    </div>
  );
};

