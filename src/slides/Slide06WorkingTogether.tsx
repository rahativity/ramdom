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
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-5"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="work-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1.5">
          One Instruction. A Coordinated Process.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          Watch the processor execute an instruction.
        </p>
      </div>

      {/* Main Coordinated Instruction Execution Pipeline */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <InstructionCycle currentBeat={currentBeat} onSelectBeat={onSetBeat} />
      </div>

      {/* Discrete Bottom Architecture Summary */}
      <div className="flex items-center justify-between text-xs font-mono text-[#102A50]/60 pt-2 border-t border-[#102A50]/10">
        <span className="font-semibold text-[#2868E8]">
          Instruction: ADD R1, R2, R3 (R2=5, R3=3)
        </span>
        <span className="font-bold text-[#102A50]">
          Result: R1 ← 5 + 3 = 8
        </span>
      </div>
    </div>
  );
};

