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
  Workflow
} from 'lucide-react';

interface Slide05ComparisonProps {
  currentBeat?: number;
}

export const Slide05Comparison: React.FC<Slide05ComparisonProps> = ({ currentBeat: _currentBeat = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        '.diff-head',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      )
        .fromTo(
          '.diff-table',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
          '-=0.2'
        )
        .fromTo(
          '.diff-row',
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          '.diff-scale',
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.3)' },
          '-=0.2'
        )
        .fromTo(
          '.diff-takeaway',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          '-=0.15'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-5"
    >
      {/* Slide Headline & Supporting Text */}
      <div className="diff-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1.5">
          Different Roles. Shared Purpose.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          Architectural comparison at a glance.
        </p>
      </div>

      {/* Main Composition: Side-by-Side Comparison Table + Digital Balance Scale */}
      <div className="flex-1 grid grid-cols-12 gap-5 items-center my-auto w-full max-w-6xl mx-auto">
        {/* Left Side: Enlarged Comparison Table */}
        <div className="diff-table col-span-12 lg:col-span-7 bg-white rounded-2xl border border-[#2868E8]/20 shadow-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-2 bg-[#102A50] text-white py-4 px-6 font-heading font-bold text-base">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2868E8]" />
              <span>Data Path</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
              <span>Controller</span>
            </div>
          </div>

          {/* Comparison Rows with comfortable spacing */}
          <div className="divide-y divide-[#2868E8]/10">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="diff-row grid grid-cols-2 px-6 py-4 items-center hover:bg-[#F8FAFF] transition-colors"
              >
                {/* Data Path column */}
                <div className="flex items-center gap-3 pr-3">
                  <div className="p-2.5 rounded-xl bg-[#2868E8]/10 shrink-0">
                    {row.dpIcon}
                  </div>
                  <span className="text-sm font-semibold text-[#102A50]">
                    {row.dpText}
                  </span>
                </div>

                {/* Controller column */}
                <div className="flex items-center gap-3 pl-3 border-l border-[#2868E8]/10">
                  <div className="p-2.5 rounded-xl bg-[#102A50]/10 shrink-0">
                    {row.ctrlIcon}
                  </div>
                  <span className="text-sm font-semibold text-[#102A50]">
                    {row.ctrlText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Digital Balance Scale Card with Key Takeaway */}
        <div className="diff-scale col-span-12 lg:col-span-5 flex flex-col items-center justify-between p-6 bg-white rounded-2xl border border-[#2868E8]/18 shadow-sm h-full min-h-[380px]">
          <div className="w-full text-center pb-3 border-b border-[#102A50]/10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#2868E8] font-bold block mb-0.5">
              System Harmony
            </span>
            <h4 className="font-heading font-bold text-base text-[#102A50]">
              Equilibrium in Architecture
            </h4>
          </div>

          <svg
            viewBox="0 0 240 170"
            className="w-full max-w-[240px] h-auto drop-shadow-sm select-none my-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center Pillar */}
            <rect x="114" y="20" width="12" height="115" rx="4" fill="#102A50" />
            <rect x="85" y="130" width="70" height="14" rx="6" fill="#102A50" />
            <circle cx="120" cy="20" r="9" fill="#2868E8" />

            {/* Scale Crossbar */}
            <path
              d="M 38 35 L 202 35"
              stroke="#2868E8"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Left Pan: Data Path */}
            <line x1="45" y1="35" x2="25" y2="92" stroke="#2868E8" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="45" y1="35" x2="65" y2="92" stroke="#2868E8" strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M 20 92 Q 45 110 70 92 Z" fill="#EBF2FF" stroke="#2868E8" strokeWidth="2" />
            <text x="45" y="85" textAnchor="middle" fill="#2868E8" fontSize="10" fontWeight="700" fontFamily="Space Grotesk">
              DATA
            </text>

            {/* Right Pan: Controller */}
            <line x1="195" y1="35" x2="175" y2="92" stroke="#102A50" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="195" y1="35" x2="215" y2="92" stroke="#102A50" strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M 170 92 Q 195 110 220 92 Z" fill="#EAEFF8" stroke="#102A50" strokeWidth="2" />
            <text x="195" y="85" textAnchor="middle" fill="#102A50" fontSize="10" fontWeight="700" fontFamily="Space Grotesk">
              CONTROL
            </text>
          </svg>

          {/* Core Takeaway - Seamlessly integrated */}
          <div className="diff-takeaway w-full bg-[#F8FAFF] rounded-xl p-3.5 border border-[#2868E8]/15 text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#2868E8] font-bold block mb-0.5">
              Key Architectural Takeaway
            </span>
            <p className="font-heading font-bold text-sm sm:text-base text-[#102A50]">
              <span className="text-[#2868E8]">Data Path</span> performs.&nbsp;
              <span className="text-[#102A50]">Controller</span> coordinates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
