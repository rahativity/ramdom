import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { InstructionCycle } from '../components/diagrams/InstructionCycle';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide06WorkingTogetherProps {
  currentBeat: number;
  onSetBeat: (beat: number) => void;
}

export const Slide06WorkingTogether: React.FC<Slide06WorkingTogetherProps> = ({
  currentBeat,
  onSetBeat,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set('.work-head', { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.work-head',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-start lg:justify-between gap-2 lg:gap-3 px-2 sm:px-4 lg:px-4 xl:px-6 py-1 lg:py-2 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Integrated Formula Badge */}
      <div className="work-head w-full shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="font-heading font-bold text-[clamp(1.5rem,2vw+0.6rem,2.8rem)] text-[#102A50] tracking-tight leading-tight mb-0.5">
            One Instruction. A Coordinated Process.
          </h2>
          <p className="text-[clamp(0.9rem,0.75vw+0.5rem,1.25rem)] text-[#102A50]/75 font-normal">
            Watch the processor execute an instruction.
          </p>
        </div>

        {/* Highlighted Instruction Formula Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 lg:px-4 xl:px-5 py-1.5 lg:py-2 rounded-xl bg-white border border-[#2868E8]/20 shadow-xs self-start sm:self-auto shrink-0">
          <span className="text-[clamp(0.75rem,0.5vw+0.48rem,1.05rem)] font-mono font-semibold text-[#1B54C7]">
            ADD R1, R2, R3
          </span>
          <span className="text-[clamp(0.75rem,0.5vw+0.48rem,1.05rem)] font-mono text-[#102A50]/70" aria-hidden="true">•</span>
          <span className="text-[clamp(0.75rem,0.5vw+0.48rem,1.05rem)] font-mono font-bold text-[#102A50]">
            R1 ← 5 + 3 = 8
          </span>
        </div>
      </div>

      {/* Main Coordinated Instruction Execution Pipeline */}
      <div className="w-full lg:flex-1 lg:min-h-0 flex items-stretch justify-center">
        <InstructionCycle currentBeat={currentBeat} onSelectBeat={onSetBeat} />
      </div>
    </div>
  );
};
