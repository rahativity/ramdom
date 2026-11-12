import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { RotateCcw } from 'lucide-react';
import { CPUArchitecture } from '../components/diagrams/CPUArchitecture';

interface Slide07ThankYouProps {
  onRestart: () => void;
}

export const Slide07ThankYou: React.FC<Slide07ThankYouProps> = ({ onRestart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.ty-chip',
        { scale: 0.9, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' }
      )
        .fromTo(
          '.ty-title',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.ty-sub',
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.ty-btn',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' },
          '-=0.2'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center text-center px-6 py-2 select-none"
    >
      {/* Central Chip Mascot matching Reference Image */}
      <div className="ty-chip mb-4">
        <CPUArchitecture mode="mascot" className="w-[300px] max-w-[300px]" />
      </div>

      {/* Main Headline matching Reference Image */}
      <h1 className="ty-title font-heading font-bold text-5xl sm:text-6xl text-[#102A50] tracking-tight mb-3">
        Thank You!
      </h1>

      {/* Subtitle with accent line */}
      <div className="ty-sub flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-[2px] bg-[#2868E8] rounded-full" />
        <p className="text-xl sm:text-2xl font-heading font-medium text-[#102A50]/75">
          Any Questions?
        </p>
        <div className="w-10 h-[2px] bg-[#2868E8] rounded-full" />
      </div>

      {/* Replay Presentation Button */}
      <div className="ty-btn mb-4">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#F8FAFF] text-[#102A50] hover:text-[#2868E8] font-heading font-semibold text-base border border-[#2868E8]/20 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Presentation</span>
        </button>
      </div>

      {/* Presentation Summary Capsule */}
      <div className="flex items-center justify-center gap-2.5 text-xs font-mono text-[#102A50]/75">
        <span className="px-3 py-1.5 rounded-xl bg-white border border-[#2868E8]/15 shadow-xs font-medium">
          Data Path: Raw Execution
        </span>
        <span className="text-[#2868E8] font-bold">•</span>
        <span className="px-3 py-1.5 rounded-xl bg-white border border-[#2868E8]/15 shadow-xs font-medium">
          Controller: System Orchestration
        </span>
      </div>
    </div>
  );
};
