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
      className="w-full h-full flex flex-col justify-start lg:justify-between gap-2.5 lg:gap-2.5 xl:gap-3 2xl:gap-4 px-2 sm:px-4 lg:px-4 xl:px-6 py-1 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="overview-head w-full shrink-0">
        <h2 className="font-heading font-bold text-[clamp(1.5rem,2.1vw+0.55rem,3rem)] text-[#102A50] tracking-tight leading-[1.12] mb-0.5">
          Two Components. One Processor.
        </h2>
        <p className="text-[clamp(0.9rem,0.75vw+0.48rem,1.3rem)] text-[#102A50]/75 font-normal">
          A CPU combines data processing and control.
        </p>
      </div>

      {/* Main Composition: Dominant Top Diagram Showcase + Two Compact Cards Below */}
      <div className="w-full lg:flex-1 lg:min-h-0 flex flex-col gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-5">
        {/* Top Row: Big Diagram Showcase */}
        <div className="overview-card lg:flex-1 lg:min-h-0 flex">
          <div className="w-full h-full min-h-[260px] lg:min-h-0 flex flex-col justify-between p-3.5 sm:p-4 lg:p-3.5 xl:p-4 2xl:p-6 rounded-2xl bg-white/90 border border-[#2868E8]/20 shadow-sm">
            <div className="w-full shrink-0 flex flex-wrap items-center justify-between gap-2 pb-2 2xl:pb-2.5 border-b border-[#102A50]/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2868E8] shrink-0" />
                <span className="text-[clamp(0.72rem,0.42vw+0.48rem,0.92rem)] font-mono font-bold uppercase tracking-wider text-[#1B54C7]">
                  Unified Silicon Die • Split Plane Topology
                </span>
              </div>
              <div className="shrink-0 px-3 xl:px-3.5 py-0.5 2xl:py-1.5 rounded-full bg-[#2868E8]/10 border border-[#2868E8]/20 text-[clamp(0.72rem,0.42vw+0.48rem,0.92rem)] font-mono font-semibold text-[#1B54C7]">
                {activeSection === 'both' && 'Active: Coordinated Dual Planes'}
                {activeSection === 'datapath' && 'Focus: Data Path Plane'}
                {activeSection === 'controller' && 'Focus: Controller Plane'}
              </div>
            </div>

            <CPUArchitecture
              mode="split"
              activeSection={activeSection}
              className="w-full lg:flex-1 lg:min-h-0 mt-1.5 2xl:mt-2"
            />
          </div>
        </div>

        {/* Bottom Row: Two Compact Equal-Height Cards */}
        <div className="shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-4 xl:gap-4 2xl:gap-6 items-stretch">
          {/* Left Card: Data Path */}
          <div className="overview-card flex min-h-0">
            <div
              className={`w-full h-full flex flex-col gap-2 2xl:gap-3 p-3.5 sm:p-4 lg:p-3.5 xl:p-4 2xl:p-5 rounded-2xl border ${
                reducedMotion ? '' : 'transition-all duration-300'
              } ${
                activeSection === 'datapath' || activeSection === 'both'
                  ? 'bg-white border-[#2868E8] shadow-lg ring-2 ring-[#2868E8]/15'
                  : 'bg-white/80 border-[#102A50]/15 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 2xl:pb-2.5 border-b border-[#102A50]/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-11 2xl:h-11 rounded-xl bg-[#2868E8]/10 text-[#2868E8] flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[clamp(1.1rem,1.05vw+0.5rem,1.65rem)] text-[#102A50] leading-tight">
                      Data Path
                    </h3>
                    <span className="text-[clamp(0.72rem,0.42vw+0.48rem,0.92rem)] font-mono font-semibold text-[#1B54C7]">
                      Execution Plane
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 xl:gap-2 text-[clamp(0.72rem,0.42vw+0.46rem,0.9rem)] font-mono text-[#1B54C7] shrink-0">
                  <span className="px-2.5 xl:px-3 py-1 rounded-md bg-[#2868E8]/10 font-semibold">Registers</span>
                  <span className="px-2.5 xl:px-3 py-1 rounded-md bg-[#2868E8]/10 font-semibold">ALU</span>
                  <span className="px-2.5 xl:px-3 py-1 rounded-md bg-[#2868E8]/10 font-semibold">Data Buses</span>
                </div>
              </div>

              <ul className="space-y-1 xl:space-y-1.5 2xl:space-y-2 text-[clamp(0.9rem,0.78vw+0.45rem,1.28rem)] text-[#102A50]/85">
                <li className="overview-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 2xl:mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#102A50] font-semibold">Processes and moves</strong> data.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 2xl:mt-2.5 shrink-0" />
                  <span>
                    Includes <strong className="text-[#1B54C7] font-semibold">ALU</strong> and{' '}
                    <strong className="text-[#1B54C7] font-semibold">registers</strong>.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 2xl:mt-2.5 shrink-0" />
                  <span>
                    Operates on operands in <strong className="text-[#1B54C7] font-semibold">parallel</strong>.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Card: Controller */}
          <div className="overview-card flex min-h-0">
            <div
              className={`w-full h-full flex flex-col gap-2 2xl:gap-3 p-3.5 sm:p-4 lg:p-3.5 xl:p-4 2xl:p-5 rounded-2xl border ${
                reducedMotion ? '' : 'transition-all duration-300'
              } ${
                activeSection === 'controller' || activeSection === 'both'
                  ? 'bg-white border-[#2868E8] shadow-lg ring-2 ring-[#2868E8]/15'
                  : 'bg-white/80 border-[#102A50]/15 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 2xl:pb-2.5 border-b border-[#102A50]/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-11 2xl:h-11 rounded-xl bg-[#102A50]/10 text-[#102A50] flex items-center justify-center shrink-0">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[clamp(1.1rem,1.05vw+0.5rem,1.65rem)] text-[#102A50] leading-tight">
                      Controller
                    </h3>
                    <span className="text-[clamp(0.72rem,0.42vw+0.48rem,0.92rem)] font-mono font-semibold text-[#102A50]/75">
                      Command Plane
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 xl:gap-2 text-[clamp(0.72rem,0.42vw+0.46rem,0.9rem)] font-mono text-[#102A50] shrink-0">
                  <span className="px-2.5 xl:px-3 py-1 rounded-md bg-[#102A50]/8 font-semibold">Decoder</span>
                  <span className="px-2.5 xl:px-3 py-1 rounded-md bg-[#102A50]/8 font-semibold">Signals</span>
                  <span className="px-2.5 xl:px-3 py-1 rounded-md bg-[#102A50]/8 font-semibold">Sequencer</span>
                </div>
              </div>

              <ul className="space-y-1 xl:space-y-1.5 2xl:space-y-2 text-[clamp(0.9rem,0.78vw+0.45rem,1.28rem)] text-[#102A50]/85">
                <li className="overview-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 2xl:mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-[#102A50] font-semibold">Decodes</strong> instructions.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 2xl:mt-2.5 shrink-0" />
                  <span>
                    Generates <strong className="text-[#1B54C7] font-semibold">control signals</strong>.
                  </span>
                </li>
                <li className="overview-bullet flex items-start gap-2.5 xl:gap-3">
                  <span className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-[#2868E8] mt-1.5 xl:mt-2 2xl:mt-2.5 shrink-0" />
                  <span>
                    Coordinates processor <strong className="text-[#102A50] font-semibold">operations</strong>.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
