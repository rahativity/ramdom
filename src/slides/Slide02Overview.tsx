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
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.overview-card',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.2, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeSection = currentBeat === 1 ? 'datapath' : currentBeat === 2 ? 'controller' : 'both';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-6"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="overview-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-2">
          Two Components. One Processor.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          A CPU combines data processing and control.
        </p>
      </div>

      {/* Main Composition: Interactive Dual Cards + Center Split Die */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
        {/* Left Side: Data Path Card */}
        <div className="overview-card lg:col-span-3 flex flex-col">
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'datapath' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-md ring-2 ring-[#2868E8]/15'
                : 'bg-white/60 border-[#102A50]/10'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#2868E8]/10 text-[#2868E8] flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#102A50] mb-1">
              Data Path
            </h3>
            <p className="text-sm text-[#102A50]/70 font-medium">
              Handles data
            </p>
            <div className="mt-4 pt-3 border-t border-[#102A50]/10 flex flex-wrap gap-2 text-xs font-mono text-[#2868E8]">
              <span className="px-2 py-0.5 rounded bg-[#2868E8]/8">Registers</span>
              <span className="px-2 py-0.5 rounded bg-[#2868E8]/8">ALU</span>
              <span className="px-2 py-0.5 rounded bg-[#2868E8]/8">Buses</span>
            </div>
          </div>
        </div>

        {/* Center: Split CPU Architecture Visual */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <CPUArchitecture
            mode="split"
            activeSection={activeSection}
            className="w-full max-w-[420px]"
          />
        </div>

        {/* Right Side: Controller Card */}
        <div className="overview-card lg:col-span-3 flex flex-col">
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'controller' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-md ring-2 ring-[#2868E8]/15'
                : 'bg-white/60 border-[#102A50]/10'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#102A50]/10 text-[#102A50] flex items-center justify-center mb-4">
              <Settings2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#102A50] mb-1">
              Controller
            </h3>
            <p className="text-sm text-[#102A50]/70 font-medium">
              Manages everything
            </p>
            <div className="mt-4 pt-3 border-t border-[#102A50]/10 flex flex-wrap gap-2 text-xs font-mono text-[#102A50]/80">
              <span className="px-2 py-0.5 rounded bg-[#102A50]/5">Instruction Decoder</span>
              <span className="px-2 py-0.5 rounded bg-[#102A50]/5">Control Signals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

