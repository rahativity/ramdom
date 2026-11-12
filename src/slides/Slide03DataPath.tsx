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
      className="w-full h-full flex flex-col justify-start lg:justify-between gap-2.5 lg:gap-3.5 2xl:gap-4 px-2 sm:px-4 lg:px-4 xl:px-6 py-1 lg:py-2 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="dp-head w-full shrink-0">
        <h2 className="font-heading font-bold text-[clamp(1.65rem,2.3vw+0.65rem,3.25rem)] text-[#102A50] tracking-tight leading-[1.12] mb-1">
          Where Data Comes to Life.
        </h2>
        <p className="text-[clamp(0.95rem,0.85vw+0.5rem,1.4rem)] text-[#102A50]/75 font-normal">
          The datapath moves and processes data.
        </p>
      </div>

      {/* Main Composition: Equal-Height Educational Column + Enlarged Diagram */}
      <div className="w-full lg:flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-7 items-stretch">
        {/* Left Side (4 cols): Concise Educational Bullet Points */}
        <div className="dp-panel lg:col-span-4 flex min-h-0">
          <div className="w-full h-full min-h-0 flex flex-col justify-between p-5 sm:p-6 lg:p-6 xl:p-7 2xl:p-9 rounded-2xl bg-white border border-[#2868E8]/20 shadow-sm">
            <div>
              <span className="text-[clamp(0.72rem,0.45vw+0.48rem,0.92rem)] font-mono font-bold tracking-wider uppercase text-[#1B54C7] mb-2 sm:mb-3 2xl:mb-4 block">
                Core Mechanisms
              </span>
              <h3 className="font-heading font-bold text-[clamp(1.15rem,1.1vw+0.55rem,1.7rem)] text-[#102A50] mb-3 sm:mb-4 2xl:mb-5">
                Data Flow Pipeline
              </h3>

              <ul className="space-y-3 lg:space-y-3.5 2xl:space-y-5 text-[clamp(0.92rem,0.9vw+0.45rem,1.38rem)] text-[#102A50]/85">
                <li className="dp-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-2 xl:mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">Registers</strong> store temporary data.
                  </span>
                </li>
                <li className="dp-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-2 xl:mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">ALU</strong> performs arithmetic and logic.
                  </span>
                </li>
                <li className="dp-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-2 xl:mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">Buses</strong> transfer data between components.
                  </span>
                </li>
                <li className="dp-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-2 xl:mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#1B54C7] font-semibold">Results</strong> move to destination registers.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-3 pt-2.5 2xl:mt-4 2xl:pt-3.5 border-t border-[#102A50]/10 flex items-center justify-between text-[clamp(0.75rem,0.45vw+0.55rem,0.98rem)] font-mono shrink-0">
              <span className="text-[#102A50]/75">Op: 5 + 3 = 8</span>
              <span className="px-2.5 xl:px-3 py-0.5 xl:py-1 rounded-full bg-[#2868E8]/10 text-[#1B54C7] font-semibold">
                Stage {currentBeat + 1} / 4
              </span>
            </div>
          </div>
        </div>

        {/* Right Side (8 cols): Enlarged Vector Datapath Diagram */}
        <div className="lg:col-span-8 flex min-h-0">
          <div className="w-full h-full min-h-0 flex flex-col justify-between bg-white rounded-2xl border border-[#2868E8]/20 p-4 sm:p-5 lg:p-6 xl:p-7 shadow-sm">
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-[#102A50]/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2868E8] shrink-0" />
                <span className="text-[clamp(0.7rem,0.45vw+0.48rem,0.92rem)] font-mono font-bold tracking-wider text-[#102A50] uppercase">
                  Execution Plane • 32-Bit Datapath Pipeline
                </span>
              </div>
              <span className="text-[clamp(0.68rem,0.42vw+0.45rem,0.88rem)] font-mono text-[#1B54C7] font-semibold bg-[#2868E8]/10 px-2.5 xl:px-3 py-0.5 xl:py-1 rounded-full">
                {beatBadgeText}
              </span>
            </div>
            <DataPathDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} className="flex-1 min-h-0 w-full my-1" />
          </div>
        </div>
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="w-full shrink-0 flex flex-wrap items-center justify-between gap-2 text-[clamp(0.75rem,0.45vw+0.55rem,0.95rem)] font-mono text-[#102A50]/75 pt-2 border-t border-[#102A50]/12">
        <span>Includes: ALU, Registers, Internal Data Buses</span>
        <span>Example: 5 + 3 = 8</span>
      </div>
    </div>
  );
};
