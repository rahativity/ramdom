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
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.ctrl-panel',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.15, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.ctrl-bullet',
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
      <div className="ctrl-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1.5">
          The Brain Behind Every Operation.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          The controller coordinates processor operations.
        </p>
      </div>

      {/* Main Composition: 30-35% Educational Column + 65-70% Enlarged Diagram */}
      <div className="flex-1 grid grid-cols-12 gap-5 items-center my-auto w-full max-w-7xl mx-auto">
        {/* Left Side (32%): Concise Educational Bullet Points */}
        <div className="ctrl-panel col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#2868E8]/20 shadow-sm">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#2868E8] mb-3 block">
              Control Mechanics
            </span>
            <h3 className="font-heading font-bold text-xl text-[#102A50] mb-4">
              Command Orchestration
            </h3>

            <ul className="space-y-4 text-sm text-[#102A50]/80">
              <li className="ctrl-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Fetches and decodes</strong> instructions.
                </span>
              </li>
              <li className="ctrl-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  Generates <strong className="text-[#2868E8] font-semibold">control signals</strong>.
                </span>
              </li>
              <li className="ctrl-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Coordinates</strong> datapath operations.
                </span>
              </li>
              <li className="ctrl-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  Controls <strong className="text-[#2868E8] font-semibold">execution sequence</strong>.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side (68%): Enlarged Controller Architecture Diagram */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-center">
          <div className="w-full bg-white rounded-2xl border border-[#2868E8]/18 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#102A50]/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#102A50]" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#102A50] uppercase">
                  Command Plane • Opcode Decoding & Signal Dispatch
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#102A50] font-semibold bg-[#102A50]/10 px-2.5 py-0.5 rounded-full">
                Synchronized Timing Loop
              </span>
            </div>
            <ControllerDiagram currentBeat={currentBeat} isAutoPlay={isAutoPlay} />
          </div>
        </div>
      </div>

      {/* Discrete Bottom Technical Annotation */}
      <div className="flex items-center justify-between text-xs font-mono text-[#102A50]/50 pt-2 border-t border-[#102A50]/10">
        <span>Includes: Instruction Decoder, State Machine, Control Logic</span>
        <span>Operations: Load, Store, Branch, Execute</span>
      </div>
    </div>
  );
};
