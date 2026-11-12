import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Cpu, Settings2 } from 'lucide-react';
import { CPUArchitecture } from '../components/diagrams/CPUArchitecture';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide02OverviewProps {
  currentBeat: number; // 0: both/intro, 1: datapath focus, 2: controller focus
}

export const Slide02Overview: React.FC<Slide02OverviewProps> = ({ currentBeat }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set(['.overview-head', '.overview-card', '.overview-bullet'], {
        opacity: 1,
        x: 0,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.overview-head',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.overview-card',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, delay: 0.12, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.overview-bullet',
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.38, stagger: 0.06, delay: 0.3, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const activeSection = currentBeat === 1 ? 'datapath' : currentBeat === 2 ? 'controller' : 'both';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-start lg:justify-center gap-3.5 lg:gap-5 2xl:gap-7 px-4 sm:px-8 lg:px-8 xl:px-10 py-2 lg:py-3 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="overview-head w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] mx-auto shrink-0">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl xl:text-[40px] 2xl:text-[46px] text-[#102A50] tracking-tight mb-1">
          Two Components. One Processor.
        </h2>
        <p className="text-sm sm:text-lg xl:text-xl text-[#102A50]/75 font-normal">
          A CPU combines data processing and control.
        </p>
      </div>

      {/* Main Composition: Equal-Height Dual Cards + Center Split CPU Showcase */}
      <div className="w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 2xl:gap-8 items-stretch">
        {/* Left Side: Data Path Card */}
        <div className="overview-card lg:col-span-4 flex">
          <div
            className={`w-full h-full flex flex-col justify-between p-5 sm:p-6 xl:p-7 2xl:p-8 rounded-2xl border ${
              reducedMotion ? '' : 'transition-all duration-300'
            } ${
              activeSection === 'datapath' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-lg ring-2 ring-[#2868E8]/15'
                : 'bg-white/80 border-[#102A50]/15 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3.5 sm:mb-5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2868E8]/10 text-[#2868E8] flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl xl:text-[22px] 2xl:text-2xl text-[#102A50] leading-tight">
                    Data Path
                  </h3>
                  <span className="text-xs xl:text-[13px] font-mono font-semibold text-[#1B54C7]">
                    Execution Plane
                  </span>
                </div>
              </div>

              {/* Supporting Educational Bullets */}
              <ul className="space-y-3 xl:space-y-4 text-sm sm:text-base xl:text-[17px] 2xl:text-lg text-[#102A50]/85 pt-1">
                <li className="overview-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#102A50] font-semibold">Processes and moves</strong> data.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                  <span>
                    Includes <strong className="text-[#1B54C7] font-semibold">ALU</strong> and{' '}
                    <strong className="text-[#1B54C7] font-semibold">registers</strong>.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                  <span>
                    Operates on operands in <strong className="text-[#1B54C7] font-semibold">parallel</strong>.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 sm:mt-6 pt-3.5 border-t border-[#102A50]/12 flex flex-wrap gap-2 text-xs xl:text-[13px] font-mono text-[#1B54C7]">
              <span className="px-3 py-1.5 rounded-md bg-[#2868E8]/10 font-semibold">Registers</span>
              <span className="px-3 py-1.5 rounded-md bg-[#2868E8]/10 font-semibold">ALU</span>
              <span className="px-3 py-1.5 rounded-md bg-[#2868E8]/10 font-semibold">Data Buses</span>
            </div>
          </div>
        </div>

        {/* Center: Split CPU Architecture Visual */}
        <div className="overview-card lg:col-span-4 flex">
          <div className="w-full h-full flex flex-col items-center justify-between p-5 sm:p-6 xl:p-7 2xl:p-8 rounded-2xl bg-white/85 border border-[#2868E8]/20 shadow-sm">
            <div className="w-full flex items-center justify-center gap-2 pb-2 border-b border-[#102A50]/10">
              <span className="w-2 h-2 rounded-full bg-[#2868E8]" />
              <span className="text-[11px] xl:text-xs font-mono font-bold uppercase tracking-wider text-[#1B54C7]">
                Unified Silicon Die
              </span>
            </div>

            <CPUArchitecture
              mode="split"
              activeSection={activeSection}
              className="w-full max-w-[205px] sm:max-w-[270px] lg:max-w-[330px] xl:max-w-[370px] 2xl:max-w-[430px] my-2 sm:my-3"
            />

            <div className="px-3.5 py-1.5 rounded-full bg-[#2868E8]/10 border border-[#2868E8]/20 text-[11px] xl:text-xs font-mono font-semibold text-[#1B54C7]">
              {activeSection === 'both' && 'Active: Coordinated Dual Planes'}
              {activeSection === 'datapath' && 'Focus: Data Path Plane'}
              {activeSection === 'controller' && 'Focus: Controller Plane'}
            </div>
          </div>
        </div>

        {/* Right Side: Controller Card */}
        <div className="overview-card lg:col-span-4 flex">
          <div
            className={`w-full h-full flex flex-col justify-between p-5 sm:p-6 xl:p-7 2xl:p-8 rounded-2xl border ${
              reducedMotion ? '' : 'transition-all duration-300'
            } ${
              activeSection === 'controller' || activeSection === 'both'
                ? 'bg-white border-[#2868E8] shadow-lg ring-2 ring-[#2868E8]/15'
                : 'bg-white/80 border-[#102A50]/15 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3.5 sm:mb-5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#102A50]/10 text-[#102A50] flex items-center justify-center shrink-0">
                  <Settings2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl xl:text-[22px] 2xl:text-2xl text-[#102A50] leading-tight">
                    Controller
                  </h3>
                  <span className="text-xs xl:text-[13px] font-mono font-semibold text-[#102A50]/75">
                    Command Plane
                  </span>
                </div>
              </div>

              {/* Supporting Educational Bullets */}
              <ul className="space-y-3 xl:space-y-4 text-sm sm:text-base xl:text-[17px] 2xl:text-lg text-[#102A50]/85 pt-1">
                <li className="overview-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#102A50] font-semibold">Decodes</strong> instructions.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                  <span>
                    Generates <strong className="text-[#1B54C7] font-semibold">control signals</strong>.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] mt-2 shrink-0" />
                  <span>
                    Coordinates processor <strong className="text-[#102A50] font-semibold">operations</strong>.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 sm:mt-6 pt-3.5 border-t border-[#102A50]/12 flex flex-wrap gap-2 text-xs xl:text-[13px] font-mono text-[#102A50]">
              <span className="px-3 py-1.5 rounded-md bg-[#102A50]/8 font-semibold">Decoder</span>
              <span className="px-3 py-1.5 rounded-md bg-[#102A50]/8 font-semibold">Signals</span>
              <span className="px-3 py-1.5 rounded-md bg-[#102A50]/8 font-semibold">Sequencer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
