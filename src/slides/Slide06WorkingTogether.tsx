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
      className="w-full h-full flex flex-col justify-start lg:justify-center gap-2 lg:gap-3 px-5 sm:px-10 lg:px-14 xl:px-16 py-2 lg:py-3 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Integrated Formula Badge */}
      <div className="work-head flex flex-col sm:flex-row sm:items-end justify-between gap-2 max-w-[1160px] w-full mx-auto shrink-0">
        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] text-[#102A50] tracking-tight leading-tight mb-0.5">
            One Instruction. A Coordinated Process.
          </h2>
          <p className="text-sm sm:text-base text-[#102A50]/75 font-normal">
            Watch the processor execute an instruction.
          </p>
        </div>

        {/* Highlighted Instruction Formula Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#2868E8]/20 shadow-xs self-start sm:self-auto shrink-0">
          <span className="text-xs font-mono font-semibold text-[#1B54C7]">
            ADD R1, R2, R3
          </span>
          <span className="text-xs font-mono text-[#102A50]/70" aria-hidden="true">•</span>
          <span className="text-xs font-mono font-bold text-[#102A50]">
            R1 ← 5 + 3 = 8
          </span>
        </div>
      </div>

      {/* Main Coordinated Instruction Execution Pipeline */}
      <div className="w-full min-h-0 flex items-center justify-center">
        <InstructionCycle currentBeat={currentBeat} onSelectBeat={onSetBeat} />
      </div>
    </div>
  );
};
