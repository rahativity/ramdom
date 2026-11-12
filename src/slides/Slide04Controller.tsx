import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ControllerDiagram } from '../components/diagrams/ControllerDiagram';

interface Slide04ControllerProps {
  currentBeat: number;
  isAutoPlay?: boolean;
}

export const Slide04Controller: React.FC<Slide04ControllerProps> = ({
  currentBeat,
  isAutoPlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ctrl-head',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-6"
    >
      {/* Slide Headline */}
      <div className="ctrl-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-2">
          The Brain Behind Every Operation.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          The controller coordinates processor operations.
        </p>
      </div>

      {/* Main Controller Diagram */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <ControllerDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} />
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="flex items-center justify-between text-xs font-mono text-[#102A50]/50 pt-2 border-t border-[#102A50]/10">
        <span>Includes: Instruction Decoder, State Machine, Control Logic</span>
        <span>Operations: Load, Store, Branch, Execute</span>
      </div>
    </div>
  );
};

