import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { InstructionCycle } from '../components/diagrams/InstructionCycle';

interface Slide06WorkingTogetherProps {
  currentBeat: number;
  onSetBeat: (beat: number) => void;
}

export const Slide06WorkingTogether: React.FC<Slide06WorkingTogetherProps> = ({
  currentBeat,
  onSetBeat,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.work-head',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-4"
    >
      {/* Slide Headline & Integrated Formula Badge */}
      <div className="work-head flex flex-col sm:flex-row sm:items-end justify-between gap-2 max-w-6xl w-full mx-auto">
        <div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1">
            One Instruction. A Coordinated Process.
          </h2>
          <p className="text-sm sm:text-base text-[#102A50]/70 font-normal">
            Watch the processor execute an instruction.
          </p>
        </div>

        {/* Highlighted Instruction Formula Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#2868E8]/20 shadow-xs">
          <span className="text-xs font-mono font-semibold text-[#2868E8]">
            ADD R1, R2, R3
          </span>
          <span className="text-xs font-mono text-[#102A50]/40">•</span>
          <span className="text-xs font-mono font-bold text-[#102A50]">
            R1 ← 5 + 3 = 8
          </span>
        </div>
      </div>

      {/* Main Coordinated Instruction Execution Pipeline */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <InstructionCycle currentBeat={currentBeat} onSelectBeat={onSetBeat} />
      </div>
    </div>
  );
};
