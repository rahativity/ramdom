import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Cpu, Settings2 } from 'lucide-react';
import { CPUArchitecture } from '../components/diagrams/CPUArchitecture';

interface Slide02OverviewProps {
  currentBeat: number; // 0: both/intro, 1: datapath focus, 2: controller focus
}

export const Slide02Overview: React.FC<Slide02OverviewProps> = ({ currentBeat }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.overview-head',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.overview-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.15, delay: 0.15, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.overview-bullet',
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.35, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeSection = currentBeat === 1 ? 'datapath' : currentBeat === 2 ? 'controller' : 'both';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-5"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="overview-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1.5">
          Two Components. One Processor.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          A CPU combines data processing and control.
        </p>
      </div>

      {/* Main Composition: Interactive Dual Cards + Enlarged Center Split Die */}
      <div className="flex-1 grid grid-cols-12 gap-6 items-center my-auto w-full max-w-7xl mx-auto">
        {/* Left Side: Data Path Card */}
        <div className="overview-card col-span-12 lg:col-span-4 flex flex-col">
          <div
            className={`p-6 lg:p-7 rounded-2xl border transition-all duration-300 ${
              activeSection === 'datapath' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-lg ring-2 ring-[#2868E8]/15'
                : 'bg-white/70 border-[#102A50]/10 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#2868E8]/10 text-[#2868E8] flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-[#102A50] leading-tight">
                  Data Path
                </h3>
                <span className="text-xs font-mono font-medium text-[#2868E8]">
                  Execution Plane
                </span>
              </div>
            </div>

            {/* Supporting Educational Bullets */}
            <ul className="space-y-3 text-sm sm:text-base text-[#102A50]/80 pt-1">
              <li className="overview-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Processes and moves</strong> data.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                <span>
                  Includes <strong className="text-[#2868E8] font-semibold">ALU</strong> and <strong className="text-[#2868E8] font-semibold">registers</strong>.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                <span>
                  Operates on operands in <strong className="text-[#2868E8] font-semibold">parallel</strong>.
                </span>
              </li>
            </ul>

            <div className="mt-5 pt-3.5 border-t border-[#102A50]/10 flex flex-wrap gap-2 text-xs font-mono text-[#2868E8]">
              <span className="px-2.5 py-1 rounded-md bg-[#2868E8]/8 font-medium">Registers</span>
              <span className="px-2.5 py-1 rounded-md bg-[#2868E8]/8 font-medium">ALU</span>
              <span className="px-2.5 py-1 rounded-md bg-[#2868E8]/8 font-medium">Data Buses</span>
            </div>
          </div>
        </div>

        {/* Center: Enlarged Split CPU Architecture Visual */}
        <div className="col-span-12 lg:col-span-4 flex items-center justify-center">
          <CPUArchitecture
            mode="split"
            activeSection={activeSection}
            className="w-full max-w-[420px] scale-105"
          />
        </div>

        {/* Right Side: Controller Card */}
        <div className="overview-card col-span-12 lg:col-span-4 flex flex-col">
          <div
            className={`p-6 lg:p-7 rounded-2xl border transition-all duration-300 ${
              activeSection === 'controller' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-lg ring-2 ring-[#2868E8]/15'
                : 'bg-white/70 border-[#102A50]/10 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#102A50]/10 text-[#102A50] flex items-center justify-center shrink-0">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-[#102A50] leading-tight">
                  Controller
                </h3>
                <span className="text-xs font-mono font-medium text-[#102A50]/60">
                  Command Plane
                </span>
              </div>
            </div>

            {/* Supporting Educational Bullets */}
            <ul className="space-y-3 text-sm sm:text-base text-[#102A50]/80 pt-1">
              <li className="overview-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Decodes</strong> instructions.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                <span>
                  Generates <strong className="text-[#2868E8] font-semibold">control signals</strong>.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                <span>
                  Coordinates processor <strong className="text-[#102A50] font-semibold">operations</strong>.
                </span>
              </li>
            </ul>

            <div className="mt-5 pt-3.5 border-t border-[#102A50]/10 flex flex-wrap gap-2 text-xs font-mono text-[#102A50]/80">
              <span className="px-2.5 py-1 rounded-md bg-[#102A50]/5 font-medium">Decoder</span>
              <span className="px-2.5 py-1 rounded-md bg-[#102A50]/5 font-medium">Signals</span>
              <span className="px-2.5 py-1 rounded-md bg-[#102A50]/5 font-medium">Sequencer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
