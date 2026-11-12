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
  PlaySquare
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
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      )
        .fromTo(
          '.diff-table',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.diff-row',
          { x: -12, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          '.diff-scale',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' },
          '-=0.3'
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
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between px-6 sm:px-12 py-5"
    >
      {/* Slide Headline */}
      <div className="diff-head max-w-2xl">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#102A50] tracking-tight mb-1.5">
          Different Roles. Shared Purpose.
        </h2>
        <p className="text-base sm:text-lg text-[#102A50]/70 font-normal">
          Architectural comparison at a glance.
        </p>
      </div>

      {/* Main Composition: Side-by-Side Comparison Table + Digital Balance Scale */}
      <div className="flex-1 grid grid-cols-12 gap-6 items-center my-auto w-full max-w-5xl mx-auto">
        {/* Left Side: Clean Comparison Table */}
        <div className="diff-table col-span-8 bg-white rounded-2xl border border-[#2868E8]/20 shadow-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-2 bg-[#102A50] text-white py-3 px-5 font-heading font-bold text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2868E8]" />
              <span>Data Path</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
              <span>Controller</span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-[#2868E8]/10">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="diff-row grid grid-cols-2 px-5 py-3 items-center hover:bg-[#F8FAFF] transition-colors"
              >
                {/* Data Path column */}
                <div className="flex items-center gap-2.5 pr-3">
                  <div className="p-1.5 rounded-lg bg-[#2868E8]/10 shrink-0">
                    {row.dpIcon}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#102A50]">
                    {row.dpText}
                  </span>
                </div>

                {/* Controller column */}
                <div className="flex items-center gap-2.5 pl-3 border-l border-[#2868E8]/10">
                  <div className="p-1.5 rounded-lg bg-[#102A50]/10 shrink-0">
                    {row.ctrlIcon}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#102A50]">
                    {row.ctrlText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Digital Balance Scale Illustration matching Reference Image */}
        <div className="diff-scale col-span-4 flex flex-col items-center justify-center p-5 bg-white/70 rounded-2xl border border-[#2868E8]/15 shadow-sm">
          <svg
            viewBox="0 0 240 200"
            className="w-full max-w-[190px] h-auto drop-shadow-sm select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center Pillar */}
            <rect x="114" y="30" width="12" height="125" rx="4" fill="#102A50" />
            <rect x="85" y="150" width="70" height="14" rx="6" fill="#102A50" />
            <circle cx="120" cy="30" r="9" fill="#2868E8" />

            {/* Scale Crossbar */}
            <path
              d="M 40 45 L 200 45"
              stroke="#2868E8"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Left Pan: Data Path */}
            <line x1="45" y1="45" x2="25" y2="105" stroke="#2868E8" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="45" y1="45" x2="65" y2="105" stroke="#2868E8" strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M 20 105 Q 45 125 70 105 Z" fill="#EBF2FF" stroke="#2868E8" strokeWidth="2" />
            <text x="45" y="96" textAnchor="middle" fill="#2868E8" fontSize="9" fontWeight="700" fontFamily="Space Grotesk">
              DATA
            </text>

            {/* Right Pan: Controller */}
            <line x1="195" y1="45" x2="175" y2="105" stroke="#102A50" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="195" y1="45" x2="215" y2="105" stroke="#102A50" strokeWidth="1.5" strokeOpacity="0.6" />
            <path d="M 170 105 Q 195 125 220 105 Z" fill="#EAEFF8" stroke="#102A50" strokeWidth="2" />
            <text x="195" y="96" textAnchor="middle" fill="#102A50" fontSize="9" fontWeight="700" fontFamily="Space Grotesk">
              CONTROL
            </text>
          </svg>
          <span className="mt-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#2868E8]">
            Equilibrium & Synergy
          </span>
        </div>
      </div>
    </div>
  );
};
