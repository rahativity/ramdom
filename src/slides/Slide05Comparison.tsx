import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Database,
  Cpu,
  Calculator,
  ArrowLeftRight,
  Settings,
  Binary,
  Zap,
  PlaySquare,
  Layers,
  Workflow,
} from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Slide05ComparisonProps {
  currentBeat?: number;
}

export const Slide05Comparison: React.FC<Slide05ComparisonProps> = ({ currentBeat: _currentBeat = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) {
      gsap.set(
        ['.diff-head', '.diff-table', '.diff-row', '.diff-scale', '.diff-takeaway'],
        { opacity: 1, x: 0, y: 0, scale: 1 }
      );
      gsap.set('.scale-beam', { rotation: 0, svgOrigin: '140 32' });
      gsap.set(['.scale-pan-left', '.scale-pan-right'], { y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        '.diff-head',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      )
        .fromTo(
          '.diff-table',
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
          '-=0.2'
        )
        .fromTo(
          '.diff-row',
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.24, stagger: 0.05, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          '.diff-scale',
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.3)' },
          0.2
        )
        .fromTo(
          '.scale-beam',
          { rotation: -3.2, svgOrigin: '140 32' },
          { rotation: 0, duration: 0.85, ease: 'elastic.out(1, 0.48)', svgOrigin: '140 32' },
          0.35
        )
        .fromTo(
          '.scale-pan-left',
          { y: -4.9 },
          { y: 0, duration: 0.85, ease: 'elastic.out(1, 0.48)' },
          0.35
        )
        .fromTo(
          '.scale-pan-right',
          { y: 4.9 },
          { y: 0, duration: 0.85, ease: 'elastic.out(1, 0.48)' },
          0.35
        )
        .fromTo(
          '.diff-takeaway',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          0.45
        );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const comparisonRows = [
    {
      dpIcon: <Database className="w-4 h-4 text-[#2868E8]" />,
      dpText: 'Processes data',
      ctrlIcon: <Settings className="w-4 h-4 text-[#102A50]" />,
      ctrlText: 'Controls operations',
    },
    {
      dpIcon: <Cpu className="w-4 h-4 text-[#2868E8]" />,
      dpText: 'ALU and registers',
      ctrlIcon: <Binary className="w-4 h-4 text-[#102A50]" />,
      ctrlText: 'Control logic',
    },
    {
      dpIcon: <Calculator className="w-4 h-4 text-[#2868E8]" />,
      dpText: 'Performs calculations',
      ctrlIcon: <PlaySquare className="w-4 h-4 text-[#102A50]" />,
      ctrlText: 'Decodes instructions',
    },
    {
      dpIcon: <ArrowLeftRight className="w-4 h-4 text-[#2868E8]" />,
      dpText: 'Moves and stores data',
      ctrlIcon: <Zap className="w-4 h-4 text-[#102A50]" />,
      ctrlText: 'Generates control signals',
    },
    {
      dpIcon: <Layers className="w-4 h-4 text-[#2868E8]" />,
      dpText: 'Works in parallel (Buses)',
      ctrlIcon: <Workflow className="w-4 h-4 text-[#102A50]" />,
      ctrlText: 'Works in sequence (Timing)',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-start lg:justify-center gap-4 lg:gap-6 px-5 sm:px-10 lg:px-14 xl:px-16 py-3 lg:py-5 overflow-y-auto lg:overflow-hidden"
    >
      {/* Slide Headline & Supporting Text - Aligned identically to grid */}
      <div className="diff-head w-full max-w-[1160px] mx-auto shrink-0">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#102A50] tracking-tight mb-1">
          Different Roles. Shared Purpose.
        </h2>
        <p className="text-sm sm:text-lg text-[#102A50]/75 font-normal">
          Architectural comparison at a glance.
        </p>
      </div>

      {/* Main Composition: Equal-Height Comparison Table + Balance Scale Card */}
      <div className="w-full max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
        {/* Left Side: Comparison Table */}
        <div className="diff-table lg:col-span-7 flex flex-col justify-between h-full bg-white rounded-2xl border border-[#2868E8]/20 shadow-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-2 bg-[#102A50] text-white py-3.5 sm:py-4 px-4 sm:px-6 font-heading font-bold text-sm sm:text-base shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2868E8]" />
              <span>Data Path</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/90" />
              <span>Controller</span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="flex-1 flex flex-col justify-evenly divide-y divide-[#2868E8]/10">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className={`diff-row grid grid-cols-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 items-center hover:bg-[#F8FAFF] ${
                  reducedMotion ? '' : 'transition-colors'
                }`}
              >
                {/* Data Path column */}
                <div className="flex items-center gap-2.5 sm:gap-3 pr-2 sm:pr-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#2868E8]/10 shrink-0">
                    {row.dpIcon}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#102A50] leading-snug">
                    {row.dpText}
                  </span>
                </div>

                {/* Controller column */}
                <div className="flex items-center gap-2.5 sm:gap-3 pl-2.5 sm:pl-4 border-l border-[#2868E8]/12">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#102A50]/10 shrink-0">
                    {row.ctrlIcon}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#102A50] leading-snug">
                    {row.ctrlText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Digital Balance Scale Card with Key Takeaway */}
        <div className="diff-scale lg:col-span-5 flex flex-col items-center justify-between h-full p-5 sm:p-6 bg-white rounded-2xl border border-[#2868E8]/20 shadow-sm">
          <div className="w-full text-center pb-3 border-b border-[#102A50]/10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1B54C7] font-bold block mb-0.5">
              System Harmony
            </span>
            <h3 className="font-heading font-bold text-base sm:text-lg text-[#102A50]">
              Equilibrium in Architecture
            </h3>
          </div>

          <svg
            viewBox="0 0 280 165"
            className="w-full max-w-[260px] sm:max-w-[280px] h-auto drop-shadow-sm select-none my-3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center Pillar & Base */}
            <rect x="134" y="24" width="12" height="114" rx="4" fill="#102A50" />
            <rect x="100" y="134" width="80" height="14" rx="6" fill="#102A50" />
            <circle cx="140" cy="28" r="9" fill="#2868E8" />

            {/* Scale Crossbar */}
            <path
              className="scale-beam"
              d="M 42 32 L 238 32"
              stroke="#2868E8"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Left Pan: Data Path (wires anchored cleanly outside centered text) */}
            <g className="scale-pan-left">
              <line x1="52" y1="32" x2="12" y2="102" stroke="#2868E8" strokeWidth="1.6" strokeOpacity="0.65" />
              <line x1="52" y1="32" x2="92" y2="102" stroke="#2868E8" strokeWidth="1.6" strokeOpacity="0.65" />
              <path d="M 8 102 Q 52 124 96 102 Z" fill="#EBF2FF" stroke="#2868E8" strokeWidth="2" />
              <text x="52" y="93" textAnchor="middle" fill="#1B54C7" fontSize="11" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
                DATA
              </text>
            </g>

            {/* Right Pan: Controller (wide pan around centered CONTROL label) */}
            <g className="scale-pan-right">
              <line x1="228" y1="32" x2="188" y2="102" stroke="#102A50" strokeWidth="1.6" strokeOpacity="0.65" />
              <line x1="228" y1="32" x2="268" y2="102" stroke="#102A50" strokeWidth="1.6" strokeOpacity="0.65" />
              <path d="M 184 102 Q 228 124 272 102 Z" fill="#EAEFF8" stroke="#102A50" strokeWidth="2" />
              <text x="228" y="93" textAnchor="middle" fill="#102A50" fontSize="10.5" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
                CONTROL
              </text>
            </g>
          </svg>

          {/* Core Takeaway */}
          <div className="diff-takeaway w-full bg-[#F8FAFF] rounded-xl p-3.5 border border-[#2868E8]/18 text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1B54C7] font-bold block mb-0.5">
              Key Architectural Takeaway
            </span>
            <p className="font-heading font-bold text-sm sm:text-base text-[#102A50]">
              <span className="text-[#1B54C7]">Data Path</span> performs.&nbsp;
              <span className="text-[#102A50]">Controller</span> coordinates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
