import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { DataPathDiagram } from '../components/diagrams/DataPathDiagram';

interface Slide03DataPathProps {
  currentBeat: number;
  isAutoPlay?: boolean;
}

export const Slide03DataPath: React.FC<Slide03DataPathProps> = ({
  currentBeat,
  isAutoPlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dp-head',
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
      <div className="dp-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-2">
          Where Data Comes to Life.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          The datapath moves and processes data.
        </p>
      </div>

      {/* Main Vector Architectural Pipeline Diagram */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <DataPathDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} />
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="flex items-center justify-between text-xs font-mono text-[#102A50]/50 pt-2 border-t border-[#102A50]/10">
        <span>Includes: ALU, Registers, Internal Data Buses</span>
        <span>Example: 5 + 3 = 8</span>
      </div>
    </div>
  );
};

