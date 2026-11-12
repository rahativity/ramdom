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
          { cx: 125, opacity: 0 },
          { cx: 235, opacity: 1, duration: 0.65, ease: 'power2.out' }
        );
        gsap.fromTo(
          '.packet-in-b',
          { cx: 125, opacity: 0 },
          { cx: 235, opacity: 1, duration: 0.65, ease: 'power2.out' }
        );
      }

      // ALU calculation pulse
      if (activeBeat >= 2) {
        gsap.to('.alu-glow', {
          opacity: 0.95,
          scale: 1.05,
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
          { cx: 585, opacity: 0 },
          { cx: 680, opacity: 1, duration: 0.75, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeBeat]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center ${className}`}
    >
      {/* SVG Circuit Canvas for Datapath - Scaled up for optimal legibility */}
      <svg
        viewBox="10 65 910 260"
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

        {/* --- CONNECTING BUSES (Bolder 3.5px strokes for high visual dominance) --- */}
        {/* Bus from Input to Registers */}
        <path
          d="M 125 115 L 235 115"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 1 ? '0.95' : '0.2'}
        />
        <path
          d="M 125 225 L 235 225"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 1 ? '0.95' : '0.2'}
        />

        {/* Dynamic moving data packet circles */}
        <circle className="packet-in-a opacity-0" cx="125" cy="115" r="6" fill="#2868E8" filter="url(#glowBlue)" />
        <circle className="packet-in-b opacity-0" cx="125" cy="225" r="6" fill="#2868E8" filter="url(#glowBlue)" />

        {/* Bus from Registers to ALU */}
        <path
          d="M 345 115 L 435 115 L 435 142 L 455 142"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 2 ? '0.95' : '0.2'}
        />
        <path
          d="M 345 225 L 435 225 L 435 198 L 455 198"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 2 ? '0.95' : '0.2'}
        />

        {/* Bus from ALU to Destination Register */}
        <path
          d="M 585 170 L 680 170"
          stroke={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 3 ? '0.95' : '0.2'}
        />
        {/* Result packet circle */}
        <circle className="packet-out opacity-0" cx="585" cy="170" r="6.5" fill="#2868E8" filter="url(#glowBlue)" />

        {/* Bus from Destination Register to Output */}
        <path
          d="M 790 170 L 845 170"
          stroke={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 3 ? '0.95' : '0.2'}
        />

        {/* --- ARROWS ON BUSES --- */}
        <polygon
          points="233,110 242,115 233,120"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.3'}
        />
        <polygon
          points="233,220 242,225 233,230"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.3'}
        />
        <polygon
          points="453,137 462,142 453,147"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.3'}
        />
        <polygon
          points="453,193 462,198 453,203"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.3'}
        />
        <polygon
          points="678,165 687,170 678,175"
          fill={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 3 ? '1' : '0.3'}
        />
        <polygon
          points="843,165 852,170 843,175"
          fill={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 3 ? '1' : '0.3'}
        />

        {/* --- STAGE 1: INPUT DATA BLOCKS (Enlarged for high readability) --- */}
        <g id="input-data-block">
          {/* Input A card */}
          <rect
            x="15"
            y="85"
            width="110"
            height="60"
            rx="14"
            fill="url(#cardGrad)"
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(40, 104, 232, 0.25)'}
            strokeWidth="1.8"
          />
          <text
            x="70"
            y="110"
            textAnchor="middle"
            fill="#102A50"
            fontSize="13"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Input A
          </text>
          <text
            x="70"
            y="133"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="18"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            5
          </text>

          {/* Input B card */}
          <rect
            x="15"
            y="195"
            width="110"
            height="60"
            rx="14"
            fill="url(#cardGrad)"
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(40, 104, 232, 0.25)'}
            strokeWidth="1.8"
          />
          <text
            x="70"
            y="220"
            textAnchor="middle"
            fill="#102A50"
            fontSize="13"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Input B
          </text>
          <text
            x="70"
            y="243"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="18"
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
            x="242"
            y="80"
            width="104"
            height="70"
            rx="14"
            fill={activeBeat >= 1 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 1 ? '2.2' : '1.5'}
          />
          <text
            x="294"
            y="107"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register R2
          </text>
          <text
            x="294"
            y="135"
            textAnchor="middle"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.4)'}
            fontSize="20"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? '5' : '-'}
          </text>

          {/* Register R3 */}
          <rect
            x="242"
            y="190"
            width="104"
            height="70"
            rx="14"
            fill={activeBeat >= 1 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 1 ? '2.2' : '1.5'}
          />
          <text
            x="294"
            y="217"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register R3
          </text>
          <text
            x="294"
            y="245"
            textAnchor="middle"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.4)'}
            fontSize="20"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? '3' : '-'}
          </text>
        </g>

        {/* --- STAGE 3: ALU (Enlarged & Prominent) --- */}
        <g id="alu-unit" className={activeBeat >= 2 ? 'alu-glow' : ''}>
          <path
            d="M 462 90 L 580 130 L 580 210 L 462 250 L 462 188 L 480 170 L 462 152 Z"
            fill="url(#aluGrad)"
            stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
            strokeWidth="3"
            filter={activeBeat >= 2 ? 'url(#glowBlue)' : undefined}
          />
          <text
            x="520"
            y="164"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="20"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="1.5"
          >
            ALU
          </text>
          <text
            x="520"
            y="186"
            textAnchor="middle"
            fill="#94BDFF"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 2 ? 'ADD: 5 + 3' : 'READY'}
          </text>
        </g>

        {/* --- STAGE 4: DESTINATION REGISTER (R1) --- */}
        <g id="dest-register">
          <rect
            x="686"
            y="132"
            width="104"
            height="76"
            rx="14"
            fill={activeBeat >= 3 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 3 ? '2.5' : '1.5'}
          />
          <text
            x="738"
            y="160"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register R1
          </text>
          <text
            x="738"
            y="190"
            textAnchor="middle"
            fill={activeBeat >= 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.3)'}
            fontSize="22"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 3 ? '8' : '0'}
          </text>
        </g>

        {/* --- STAGE 5: OUTPUT DATA BLOCK --- */}
        <g id="output-data-block">
          <rect
            x="852"
            y="138"
            width="65"
            height="64"
            rx="14"
            fill="url(#cardGrad)"
            stroke={activeBeat >= 3 ? '#2868E8' : 'rgba(40, 104, 232, 0.25)'}
            strokeWidth="1.8"
          />
          <text
            x="884"
            y="164"
            textAnchor="middle"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Output
          </text>
          <text
            x="884"
            y="188"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="18"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 3 ? '8' : '-'}
          </text>
        </g>

        {/* --- BUS STATUS LABEL --- */}
        <text
          x="480"
          y="312"
          textAnchor="middle"
          fill="#102A50"
          fillOpacity="0.65"
          fontSize="13"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
        >
          Internal Datapath Bus: Moves Operands and Latches Results
        </text>
      </svg>

      {/* Discrete State Indicator Pill */}
      <div className="mt-3 flex items-center gap-3">
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
