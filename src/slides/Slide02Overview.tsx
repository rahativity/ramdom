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
      <div className="flex-1 grid grid-cols-12 gap-5 lg:gap-8 items-center my-auto w-full max-w-6xl mx-auto">
        {/* Left Side: Data Path Card */}
        <div className="overview-card col-span-12 lg:col-span-3 flex flex-col">
          <div
            className={`p-5 lg:p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'datapath' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-md ring-2 ring-[#2868E8]/15'
                : 'bg-white/60 border-[#102A50]/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#2868E8]/10 text-[#2868E8] flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#102A50] leading-tight">
                  Data Path
                </h3>
                <span className="text-[11px] font-mono font-medium text-[#2868E8]">
                  Execution Plane
                </span>
              </div>
            </div>

            {/* Supporting Educational Bullets */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#102A50]/80 pt-1">
              <li className="overview-bullet flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Processes and moves</strong> data.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  Includes <strong className="text-[#2868E8] font-semibold">ALU</strong> and <strong className="text-[#2868E8] font-semibold">registers</strong>.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-[#102A50]/10 flex flex-wrap gap-1.5 text-[11px] font-mono text-[#2868E8]">
              <span className="px-2 py-0.5 rounded bg-[#2868E8]/8">Registers</span>
              <span className="px-2 py-0.5 rounded bg-[#2868E8]/8">ALU</span>
              <span className="px-2 py-0.5 rounded bg-[#2868E8]/8">Buses</span>
            </div>
          </div>
        </div>

        {/* Center: Enlarged Split CPU Architecture Visual (approx 25% larger) */}
        <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
          <CPUArchitecture
            mode="split"
            activeSection={activeSection}
            className="w-full max-w-[480px] scale-105"
          />
        </div>

        {/* Right Side: Controller Card */}
        <div className="overview-card col-span-12 lg:col-span-3 flex flex-col">
          <div
            className={`p-5 lg:p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'controller' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-md ring-2 ring-[#2868E8]/15'
                : 'bg-white/60 border-[#102A50]/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#102A50]/10 text-[#102A50] flex items-center justify-center shrink-0">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#102A50] leading-tight">
                  Controller
                </h3>
                <span className="text-[11px] font-mono font-medium text-[#102A50]/60">
                  Command Plane
                </span>
              </div>
            </div>

            {/* Supporting Educational Bullets */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#102A50]/80 pt-1">
              <li className="overview-bullet flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Decodes</strong> instructions.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  Generates <strong className="text-[#2868E8] font-semibold">control signals</strong>.
                </span>
              </li>
              <li className="overview-bullet flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2868E8] mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#102A50] font-semibold">Coordinates</strong> processor operations.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-[#102A50]/10 flex flex-wrap gap-1.5 text-[11px] font-mono text-[#102A50]/80">
              <span className="px-2 py-0.5 rounded bg-[#102A50]/5">Decoder</span>
              <span className="px-2 py-0.5 rounded bg-[#102A50]/5">Signals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
