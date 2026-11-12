import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ControllerDiagramProps {
  currentBeat?: number; // 0..2
  isAutoPlay?: boolean;
  className?: string;
}

export const ControllerDiagram: React.FC<ControllerDiagramProps> = ({
  currentBeat = 0,
  isAutoPlay: _isAutoPlay = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBeat = currentBeat;

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      if (activeBeat >= 2) {
        gsap.to('.signal-pulse', {
          strokeDashoffset: -30,
          repeat: -1,
          duration: 1.5,
          ease: 'none',
          stagger: 0.2,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeBeat]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 ${className}`}
    >
      <svg
        viewBox="0 0 880 340"
        className="w-full h-auto drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="controllerNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4F8FF" />
          </linearGradient>
          <filter id="glowSignal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- HORIZONTAL INSTRUCTION INPUT PIPELINE --- */}
        {/* Connection from Instruction to Decoder */}
        <path
          d="M 180 130 L 250 130"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 1 ? '1' : '0.2'}
        />
        <polygon
          points="248,126 256,130 248,134"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.3'}
        />

        {/* Connection from Decoder to Control Unit */}
        <path
          d="M 370 130 L 440 130"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 1 ? '1' : '0.2'}
        />
        <polygon
          points="438,126 446,130 438,134"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.3'}
        />

        {/* --- CONTROL SIGNAL BUSES RADIATING FROM CONTROL UNIT --- */}
        {/* Signal 1: RegRead (to Registers) */}
        <path
          d="M 590 110 L 670 110 L 730 80"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="2.5"
          strokeOpacity={activeBeat >= 2 ? '1' : '0.25'}
        />
        {activeBeat >= 2 && (
          <path
            d="M 590 110 L 670 110 L 730 80"
            stroke="#6CA1FF"
            strokeWidth="3"
            strokeDasharray="8 16"
            className="signal-pulse"
            filter="url(#glowSignal)"
          />
        )}

        {/* Signal 2: ALUOp [ADD] (to ALU) */}
        <path
          d="M 590 130 L 730 130"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="2.5"
          strokeOpacity={activeBeat >= 2 ? '1' : '0.25'}
        />
        {activeBeat >= 2 && (
          <path
            d="M 590 130 L 730 130"
            stroke="#6CA1FF"
            strokeWidth="3"
            strokeDasharray="8 16"
            className="signal-pulse"
            filter="url(#glowSignal)"
          />
        )}

        {/* Signal 3: RegWrite (to Destination Register) */}
        <path
          d="M 590 150 L 670 150 L 730 180"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="2.5"
          strokeOpacity={activeBeat >= 2 ? '1' : '0.25'}
        />
        {activeBeat >= 2 && (
          <path
            d="M 590 150 L 670 150 L 730 180"
            stroke="#6CA1FF"
            strokeWidth="3"
            strokeDasharray="8 16"
            className="signal-pulse"
            filter="url(#glowSignal)"
          />
        )}

        {/* Feedback / Timing Clock Loop to Controller */}
        <path
          d="M 515 170 L 515 250 L 310 250 L 310 166"
          stroke="#2868E8"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeOpacity={activeBeat >= 1 ? '0.6' : '0.2'}
        />
        <polygon
          points="306,168 310,160 314,168"
          fill="#2868E8"
          opacity={activeBeat >= 1 ? '0.8' : '0.3'}
        />
        <text
          x="410"
          y="270"
          textAnchor="middle"
          fill="#102A50"
          fillOpacity="0.6"
          fontSize="11"
          fontWeight="500"
          fontFamily="JetBrains Mono, monospace"
        >
          Timing & Step Feedback Loop
        </text>

        {/* --- BLOCK 1: INSTRUCTION INPUT --- */}
        <g id="instruction-input">
          <rect
            x="40"
            y="96"
            width="140"
            height="68"
            rx="14"
            fill="url(#cardGrad2)"
            stroke={activeBeat >= 0 ? '#2868E8' : 'rgba(40, 104, 232, 0.2)'}
            strokeWidth="1.5"
          />
          <text
            x="110"
            y="122"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Instruction
          </text>
          <text
            x="110"
            y="144"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            ADD R1, R2, R3
          </text>
        </g>

        {/* --- BLOCK 2: INSTRUCTION DECODER --- */}
        <g id="instruction-decoder">
          <rect
            x="256"
            y="94"
            width="114"
            height="72"
            rx="14"
            fill={activeBeat >= 1 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 1 ? '2' : '1.5'}
          />
          <text
            x="313"
            y="124"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Decoder
          </text>
          <text
            x="313"
            y="144"
            textAnchor="middle"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.4)'}
            fontSize="10"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? 'Opcode: 0x01' : 'Standby'}
          </text>
        </g>

        {/* --- BLOCK 3: CONTROL UNIT (CORE ENGINE) --- */}
        <g id="control-unit-core">
          <rect
            x="446"
            y="82"
            width="144"
            height="96"
            rx="16"
            fill="url(#controllerNavy)"
            stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
            strokeWidth="2.5"
          />
          <text
            x="518"
            y="122"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="0.5"
          >
            Control Unit
          </text>
          <text
            x="518"
            y="144"
            textAnchor="middle"
            fill="#94BDFF"
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            State Machine / Logic
          </text>
          {/* Status Indicator LED */}
          <circle
            cx="572"
            cy="98"
            r="4"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(255, 255, 255, 0.3)'}
          />
        </g>

        {/* --- BLOCK 4: CONTROL SIGNALS OUTPUTS --- */}
        <g id="signals-outputs">
          {/* Signal 1: RegRead */}
          <rect
            x="736"
            y="60"
            width="120"
            height="40"
            rx="10"
            fill={activeBeat >= 2 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 2 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 2 ? '2' : '1'}
          />
          <text
            x="796"
            y="85"
            textAnchor="middle"
            fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
            fontSize="11"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            RegRead = 1
          </text>

          {/* Signal 2: ALUOp */}
          <rect
            x="736"
            y="110"
            width="120"
            height="40"
            rx="10"
            fill={activeBeat >= 2 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 2 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 2 ? '2' : '1'}
          />
          <text
            x="796"
            y="135"
            textAnchor="middle"
            fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
            fontSize="11"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            ALUOp = ADD
          </text>

          {/* Signal 3: RegWrite */}
          <rect
            x="736"
            y="160"
            width="120"
            height="40"
            rx="10"
            fill={activeBeat >= 2 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 2 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={activeBeat >= 2 ? '2' : '1'}
          />
          <text
            x="796"
            y="185"
            textAnchor="middle"
            fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
            fontSize="11"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            RegWrite = 1
          </text>
        </g>
      </svg>

      {/* Discrete State Pill */}
      <div className="mt-4 flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 text-[#102A50] text-xs font-mono font-semibold shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2868E8] animate-pulse" />
          <span>
            {activeBeat === 0 && 'Stage 1: Instruction Arrives at Controller'}
            {activeBeat === 1 && 'Stage 2: Opcode Decoded & Micro-Operations Sequenced'}
            {activeBeat === 2 && 'Stage 3: Control Signals Transmitted to Datapath'}
          </span>
        </div>
      </div>
    </div>
  );
};
