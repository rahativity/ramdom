import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface DataPathDiagramProps {
  currentBeat?: number; // 0..3
  isAutoPlay?: boolean;
  className?: string;
}

export const DataPathDiagram: React.FC<DataPathDiagramProps> = ({
  currentBeat = 0,
  isAutoPlay: _isAutoPlay = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBeat = currentBeat;

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Packet A & B traveling from input into registers
      if (activeBeat === 1 || activeBeat >= 2) {
        gsap.fromTo(
          '.packet-in-a',
          { cx: 120, opacity: 0 },
          { cx: 220, opacity: 1, duration: 0.65, ease: 'power2.out' }
        );
        gsap.fromTo(
          '.packet-in-b',
          { cx: 120, opacity: 0 },
          { cx: 220, opacity: 1, duration: 0.65, ease: 'power2.out' }
        );
      }

      // ALU calculation pulse
      if (activeBeat >= 2) {
        gsap.to('.alu-glow', {
          opacity: 0.9,
          scale: 1.04,
          repeat: 1,
          yoyo: true,
          duration: 0.4,
          ease: 'power2.inOut',
        });
      }

      // Result packet traveling from ALU to Destination Register
      if (activeBeat >= 3) {
        gsap.fromTo(
          '.packet-out',
          { cx: 550, opacity: 0 },
          { cx: 640, opacity: 1, duration: 0.75, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeBeat]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 ${className}`}
    >
      {/* SVG Circuit Canvas for Datapath */}
      <svg
        viewBox="0 0 880 340"
        className="w-full h-auto drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4F8FF" />
          </linearGradient>
          <linearGradient id="aluGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- CONNECTING BUSES (SVG PATHS) --- */}
        {/* Bus from Input to Registers */}
        <path
          d="M 120 120 L 220 120"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 1 ? '0.9' : '0.2'}
        />
        <path
          d="M 120 220 L 220 220"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 1 ? '0.9' : '0.2'}
        />

        {/* Dynamic moving data packet circles */}
        <circle className="packet-in-a opacity-0" cx="120" cy="120" r="5" fill="#2868E8" filter="url(#glowBlue)" />
        <circle className="packet-in-b opacity-0" cx="120" cy="220" r="5" fill="#2868E8" filter="url(#glowBlue)" />

        {/* Bus from Registers to ALU */}
        <path
          d="M 320 120 L 410 120 L 410 145 L 430 145"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 2 ? '0.9' : '0.2'}
        />
        <path
          d="M 320 220 L 410 220 L 410 195 L 430 195"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 2 ? '0.9' : '0.2'}
        />

        {/* Bus from ALU to Destination Register */}
        <path
          d="M 550 170 L 640 170"
          stroke={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 3 ? '0.9' : '0.2'}
        />
        {/* Result packet circle */}
        <circle className="packet-out opacity-0" cx="550" cy="170" r="5.5" fill="#2868E8" filter="url(#glowBlue)" />

        {/* Bus from Destination Register to Output */}
        <path
          d="M 740 170 L 800 170"
          stroke={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 3 ? '0.9' : '0.2'}
        />

        {/* --- ARROWS ON BUSES --- */}
        <polygon
          points="218,116 226,120 218,124"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.3'}
        />
        <polygon
          points="218,216 226,220 218,224"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.3'}
        />
        <polygon
          points="428,141 436,145 428,149"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.3'}
        />
        <polygon
          points="428,191 436,195 428,199"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.3'}
        />
        <polygon
          points="638,166 646,170 638,174"
          fill={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 3 ? '1' : '0.3'}
        />
        <polygon
          points="798,166 806,170 798,174"
          fill={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 3 ? '1' : '0.3'}
        />

        {/* --- STAGE 1: INPUT DATA BLOCKS --- */}
        <g id="input-data-block">
          {/* Input A card */}
          <rect
            x="20"
            y="92"
            width="100"
            height="56"
            rx="12"
            fill="url(#cardGrad)"
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(40, 104, 232, 0.2)'}
            strokeWidth="1.5"
          />
          <text
            x="70"
            y="116"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Input A
          </text>
          <text
            x="70"
            y="136"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="15"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            5
          </text>

          {/* Input B card */}
          <rect
            x="20"
            y="192"
            width="100"
            height="56"
            rx="12"
            fill="url(#cardGrad)"
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(40, 104, 232, 0.2)'}
            strokeWidth="1.5"
          />
          <text
            x="70"
            y="216"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Input B
          </text>
          <text
            x="70"
            y="236"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="15"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            3
          </text>
        </g>

        {/* --- STAGE 2: OPERAND REGISTERS (R2, R3) --- */}
        <g id="registers-stage">
          {/* Register R2 */}
          <rect
            x="226"
            y="88"
            width="94"
            height="64"
            rx="12"
            fill={activeBeat >= 1 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.15)'}
            strokeWidth={activeBeat >= 1 ? '2' : '1.5'}
          />
          <text
            x="273"
            y="113"
            textAnchor="middle"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register R2
          </text>
          <text
            x="273"
            y="138"
            textAnchor="middle"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.4)'}
            fontSize="16"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? '5' : '-'}
          </text>

          {/* Register R3 */}
          <rect
            x="226"
            y="188"
            width="94"
            height="64"
            rx="12"
            fill={activeBeat >= 1 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.15)'}
            strokeWidth={activeBeat >= 1 ? '2' : '1.5'}
          />
          <text
            x="273"
            y="213"
            textAnchor="middle"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register R3
          </text>
          <text
            x="273"
            y="238"
            textAnchor="middle"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.4)'}
            fontSize="16"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? '3' : '-'}
          </text>
        </g>

        {/* --- STAGE 3: ALU (ARITHMETIC LOGIC UNIT) --- */}
        <g id="alu-unit" className={activeBeat >= 2 ? 'alu-glow' : ''}>
          {/* Classic ALU V-shape chevron / trapezoid geometry */}
          <path
            d="M 436 100 L 544 135 L 544 205 L 436 240 L 436 185 L 452 170 L 436 155 Z"
            fill="url(#aluGrad)"
            stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
            strokeWidth="2.5"
            filter={activeBeat >= 2 ? 'url(#glowBlue)' : undefined}
          />
          <text
            x="486"
            y="166"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="1"
          >
            ALU
          </text>
          <text
            x="486"
            y="185"
            textAnchor="middle"
            fill="#94BDFF"
            fontSize="10"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 2 ? 'ADD: 5 + 3' : 'READY'}
          </text>
        </g>

        {/* --- STAGE 4: DESTINATION REGISTER (R1) --- */}
        <g id="dest-register">
          <rect
            x="646"
            y="136"
            width="94"
            height="68"
            rx="12"
            fill={activeBeat >= 3 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.15)'}
            strokeWidth={activeBeat >= 3 ? '2.5' : '1.5'}
          />
          <text
            x="693"
            y="162"
            textAnchor="middle"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register R1
          </text>
          <text
            x="693"
            y="188"
            textAnchor="middle"
            fill={activeBeat >= 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.3)'}
            fontSize="20"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 3 ? '8' : '0'}
          </text>
        </g>

        {/* --- STAGE 5: OUTPUT DATA BLOCK --- */}
        <g id="output-data-block">
          <rect
            x="806"
            y="142"
            width="64"
            height="56"
            rx="12"
            fill="url(#cardGrad)"
            stroke={activeBeat >= 3 ? '#2868E8' : 'rgba(40, 104, 232, 0.2)'}
            strokeWidth="1.5"
          />
          <text
            x="838"
            y="166"
            textAnchor="middle"
            fill="#102A50"
            fontSize="10"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Output
          </text>
          <text
            x="838"
            y="186"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="16"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 3 ? '8' : '-'}
          </text>
        </g>

        {/* --- BUS STATUS / LABELS --- */}
        <text
          x="440"
          y="310"
          textAnchor="middle"
          fill="#102A50"
          fillOpacity="0.6"
          fontSize="12"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
        >
          Internal Datapath Bus: Moves Operands and Latches Results
        </text>
      </svg>

      {/* Discrete State Indicator Pill */}
      <div className="mt-4 flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 text-[#102A50] text-xs font-mono font-semibold shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2868E8] animate-pulse" />
          <span>
            {activeBeat === 0 && 'Ready: Inputs Available'}
            {activeBeat === 1 && 'Step 1: Operands latched into R2=5, R3=3'}
            {activeBeat === 2 && 'Step 2: ALU processes calculation: 5 + 3 = 8'}
            {activeBeat === 3 && 'Step 3: Result 8 latched into Destination R1 & Output'}
          </span>
        </div>
      </div>
    </div>
  );
};
