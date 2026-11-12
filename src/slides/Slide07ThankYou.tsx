import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { RotateCcw } from 'lucide-react';
import { CPUArchitecture } from '../components/diagrams/CPUArchitecture';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide07ThankYouProps {
  onRestart: () => void;
}

export const Slide07ThankYou: React.FC<Slide07ThankYouProps> = ({ onRestart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set(['.ty-chip', '.ty-title', '.ty-sub', '.ty-btn', '.ty-summary'], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.ty-chip',
        { scale: 0.92, opacity: 0, y: 14 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
        0
      )
        .fromTo(
          '.ty-title',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
          0.15
        )
        .fromTo(
          '.ty-sub',
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
          0.25
        )
        .fromTo(
          '.ty-btn',
          { scale: 0.94, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.35
        )
        .fromTo(
          '.ty-summary',
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
          0.45
        );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 lg:px-8 xl:px-10 py-2 lg:py-3 overflow-y-auto lg:overflow-hidden select-none"
    >
      <div className="my-auto flex flex-col items-center justify-center max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] w-full mx-auto">
        {/* Central Chip Mascot */}
        <div className="ty-chip mb-3 sm:mb-4">
          <CPUArchitecture
            mode="mascot"
            className="w-[200px] sm:w-[270px] lg:w-[310px] xl:w-[340px] 2xl:w-[400px]"
          />
        </div>

        {/* Main Headline */}
        <h1 className="ty-title font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-[66px] 2xl:text-[74px] text-[#102A50] tracking-tight mb-2.5 sm:mb-3">
          Thank You!
        </h1>

        {/* Subtitle with accent line */}
        <div className="ty-sub flex items-center justify-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 sm:w-10 h-[2px] bg-[#2868E8] rounded-full" />
          <p className="text-lg sm:text-2xl xl:text-[26px] font-heading font-medium text-[#102A50]/75">
            Any Questions?
          </p>
          <div className="w-8 sm:w-10 h-[2px] bg-[#2868E8] rounded-full" />
        </div>

        {/* Replay Presentation Button */}
        <div className="ty-btn mb-4 sm:mb-5">
          <button
            type="button"
            onClick={onRestart}
            className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-[#F8FAFF] text-[#102A50] hover:text-[#1B54C7] font-heading font-semibold text-sm sm:text-base xl:text-lg border border-[#2868E8]/25 shadow-sm hover:shadow ${
              reducedMotion ? '' : 'transition-all duration-200'
            } cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2868E8] focus-visible:ring-offset-2`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Presentation</span>
          </button>
        </div>

        {/* Presentation Summary Capsule */}
        <div className="ty-summary flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm xl:text-[15px] font-mono text-[#102A50]">
          <span className="px-4 py-2 rounded-xl bg-white border border-[#2868E8]/20 shadow-xs font-medium">
            Data Path: Raw Execution
          </span>
          <span className="text-[#1B54C7] font-bold hidden sm:inline" aria-hidden="true">•</span>
          <span className="px-4 py-2 rounded-xl bg-white border border-[#2868E8]/20 shadow-xs font-medium">
            Controller: System Orchestration
          </span>
        </div>
      </div>
    </div>
  );
};
