import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ControllerDiagram } from '../components/diagrams/ControllerDiagram';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide04ControllerProps {
  currentBeat: number;
  isAutoPlay?: boolean;
}

export const Slide04Controller: React.FC<Slide04ControllerProps> = ({
  currentBeat,
  isAutoPlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set(['.ctrl-head', '.ctrl-panel', '.ctrl-bullet'], { opacity: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ctrl-head',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.ctrl-panel',
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, delay: 0.12, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.ctrl-bullet',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.25, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const beatBadgeText =
    currentBeat === 0
      ? 'Step 1/3 • Instruction Ready'
      : currentBeat === 1
      ? 'Step 2/3 • Opcode 0x01'
      : 'Step 3/3 • Signals Dispatched';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-start lg:justify-center gap-3.5 lg:gap-4 2xl:gap-6 px-4 sm:px-8 lg:px-8 xl:px-10 py-2 lg:py-3 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="ctrl-head w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] mx-auto shrink-0">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl xl:text-[40px] 2xl:text-[46px] text-[#102A50] tracking-tight mb-1">
          The Brain Behind Every Operation.
        </h2>
        <p className="text-sm sm:text-lg xl:text-xl text-[#102A50]/75 font-normal">
          The controller coordinates processor operations.
        </p>
      </div>

      {/* Main Composition: Equal-Height Educational Column + Enlarged Diagram */}
      <div className="w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 2xl:gap-7 items-stretch">
        {/* Left Side (4 cols): Concise Educational Bullet Points */}
        <div className="ctrl-panel lg:col-span-4 flex">
          <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 xl:p-7 rounded-2xl bg-white border border-[#2868E8]/20 shadow-sm">
            <div>
              <span className="text-xs xl:text-[13px] font-mono font-bold tracking-wider uppercase text-[#1B54C7] mb-2 sm:mb-3 block">
                Control Mechanics
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl xl:text-[22px] text-[#102A50] mb-3 sm:mb-4">
                Command Orchestration
              </h3>

              <ul className="space-y-3 xl:space-y-4 text-sm sm:text-[15px] xl:text-[17px] text-[#102A50]/85">
                <li className="ctrl-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#102A50] font-semibold">Fetches and decodes</strong> instructions.
                  </span>
                </li>
                <li className="ctrl-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 shrink-0" />
                  <span>
                    Generates <strong className="text-[#1B54C7] font-semibold">control signals</strong>.
                  </span>
                </li>
                <li className="ctrl-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#102A50] font-semibold">Coordinates</strong> datapath operations.
                  </span>
                </li>
                <li className="ctrl-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 shrink-0" />
                  <span>
                    Controls <strong className="text-[#1B54C7] font-semibold">execution sequence</strong>.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-[#102A50]/10 flex items-center justify-between text-xs xl:text-[13px] 2xl:text-sm font-mono">
              <span className="text-[#102A50]/75">ADD R1, R2, R3</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#102A50]/8 text-[#102A50] font-semibold">
                Stage {currentBeat + 1} / 3
              </span>
            </div>
          </div>
        </div>

        {/* Right Side (8 cols): Enlarged Controller Architecture Diagram */}
        <div className="lg:col-span-8 flex">
          <div className="w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-[#2868E8]/20 p-4 sm:p-5 xl:p-6 2xl:p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-[#102A50]/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#102A50] shrink-0" />
                <span className="text-xs xl:text-[13px] font-mono font-bold tracking-wider text-[#102A50] uppercase">
                  Command Plane • Opcode Decoding & Signal Dispatch
                </span>
              </div>
              <span className="text-[11px] xl:text-xs font-mono text-[#102A50] font-semibold bg-[#102A50]/10 px-2.5 py-0.5 rounded-full">
                {beatBadgeText}
              </span>
            </div>
            <ControllerDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} className="my-auto" />
          </div>
        </div>
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] mx-auto shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs xl:text-[13px] 2xl:text-sm font-mono text-[#102A50]/75 pt-2 border-t border-[#102A50]/12">
        <span>Includes: Instruction Decoder, State Machine, Control Logic</span>
        <span>Operations: Load, Store, Branch, Execute</span>
      </div>
    </div>
  );
};
