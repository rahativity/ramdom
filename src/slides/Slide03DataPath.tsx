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
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.dp-panel',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.15, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.dp-bullet',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
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
      <div className="dp-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1.5">
          Where Data Comes to Life.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          The datapath moves and processes data.
        </p>
      </div>

      {/* Main Composition: 30-35% Educational Column + 65-70% Enlarged Diagram */}
      <div className="flex-1 grid grid-cols-12 gap-5 items-center my-auto w-full max-w-7xl mx-auto">
        {/* Left Side (32%): Concise Educational Bullet Points */}
        <div className="dp-panel col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#2868E8]/20 shadow-sm">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#2868E8] mb-3 block">
              Core Mechanisms
            </span>
            <h3 className="font-heading font-bold text-xl text-[#102A50] mb-4">
              Data Flow Pipeline
            </h3>

            <ul className="space-y-4 text-sm text-[#102A50]/80">
              <li className="dp-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#2868E8] font-semibold">Registers</strong> store temporary data.
                </span>
              </li>
              <li className="dp-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#2868E8] font-semibold">ALU</strong> performs arithmetic and logic.
                </span>
              </li>
              <li className="dp-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#2868E8] font-semibold">Buses</strong> transfer data between components.
                </span>
              </li>
              <li className="dp-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#2868E8] font-semibold">Results</strong> move to destination registers.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side (68%): Enlarged Vector Datapath Diagram */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-center">
          <div className="w-full bg-white rounded-2xl border border-[#2868E8]/18 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#102A50]/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2868E8]" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#102A50] uppercase">
                  Execution Plane • 32-Bit Datapath Pipeline
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#2868E8] font-semibold bg-[#2868E8]/10 px-2.5 py-0.5 rounded-full">
                Active Operation: 5 + 3 = 8
              </span>
            </div>
            <DataPathDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} />
          </div>
        </div>
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="flex items-center justify-between text-xs font-mono text-[#102A50]/50 pt-2 border-t border-[#102A50]/10">
        <span>Includes: ALU, Registers, Internal Data Buses</span>
        <span>Example: 5 + 3 = 8</span>
      </div>
    </div>
  );
};
