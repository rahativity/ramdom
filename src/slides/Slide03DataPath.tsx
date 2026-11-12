import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { DataPathDiagram } from '../components/diagrams/DataPathDiagram';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide03DataPathProps {
  currentBeat: number;
  isAutoPlay?: boolean;
}

export const Slide03DataPath: React.FC<Slide03DataPathProps> = ({
  currentBeat,
  isAutoPlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set(['.dp-head', '.dp-panel', '.dp-bullet'], { opacity: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dp-head',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.dp-panel',
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, delay: 0.12, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.dp-bullet',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.25, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const beatBadgeText =
    currentBeat === 0
      ? 'Step 0/3 • Inputs: 5, 3'
      : currentBeat === 1
      ? 'Step 1/3 • Latch R2=5, R3=3'
      : currentBeat === 2
      ? 'Step 2/3 • ALU: 5 + 3'
      : 'Step 3/3 • Result: 8';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-start lg:justify-center gap-3.5 lg:gap-5 px-5 sm:px-10 lg:px-14 xl:px-16 py-3 lg:py-4 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="dp-head w-full max-w-[1160px] mx-auto shrink-0">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#102A50] tracking-tight mb-1">
          Where Data Comes to Life.
        </h2>
        <p className="text-sm sm:text-lg text-[#102A50]/75 font-normal">
          The datapath moves and processes data.
        </p>
      </div>

      {/* Main Composition: Equal-Height Educational Column + Enlarged Diagram */}
      <div className="w-full max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Left Side (4 cols): Concise Educational Bullet Points */}
        <div className="dp-panel lg:col-span-4 flex">
          <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-7 rounded-2xl bg-white border border-[#2868E8]/20 shadow-sm">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#1B54C7] mb-2 sm:mb-3 block">
                Core Mechanisms
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#102A50] mb-3 sm:mb-4">
                Data Flow Pipeline
              </h3>

              <ul className="space-y-2.5 sm:space-y-4 text-sm text-[#102A50]/85">
                <li className="dp-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">Registers</strong> store temporary data.
                  </span>
                </li>
                <li className="dp-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">ALU</strong> performs arithmetic and logic.
                  </span>
                </li>
                <li className="dp-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">Buses</strong> transfer data between components.
                  </span>
                </li>
                <li className="dp-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">Results</strong> move to destination registers.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-[#102A50]/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[#102A50]/75">Op: 5 + 3 = 8</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2868E8]/10 text-[#1B54C7] font-semibold">
                Stage {currentBeat + 1} / 4
              </span>
            </div>
          </div>
        </div>

        {/* Right Side (8 cols): Enlarged Vector Datapath Diagram */}
        <div className="lg:col-span-8 flex">
          <div className="w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-[#2868E8]/20 p-4 sm:p-5 lg:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-[#102A50]/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2868E8] shrink-0" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#102A50] uppercase">
                  Execution Plane • 32-Bit Datapath Pipeline
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#1B54C7] font-semibold bg-[#2868E8]/10 px-2.5 py-0.5 rounded-full">
                {beatBadgeText}
              </span>
            </div>
            <DataPathDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} className="my-auto" />
          </div>
        </div>
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="w-full max-w-[1160px] mx-auto shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#102A50]/75 pt-2 border-t border-[#102A50]/12">
        <span>Includes: ALU, Registers, Internal Data Buses</span>
        <span>Example: 5 + 3 = 8</span>
      </div>
    </div>
  );
};
