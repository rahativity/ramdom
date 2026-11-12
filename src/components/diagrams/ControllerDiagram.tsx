import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');

  const controllerNavyId = `controllerNavy-${uid}`;
  const cardGradId = `ctrlCardGrad-${uid}`;
  const glowSignalId = `glowSignal-${uid}`;

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion || activeBeat < 2) return;

    const pulses = containerRef.current.querySelectorAll('.signal-pulse');
    if (pulses.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(pulses, {
        strokeDashoffset: -32,
        repeat: -1,
        duration: 1.4,
        ease: 'none',
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeBeat, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-0 flex flex-col items-center justify-between ${className}`}
    >
      <svg
        viewBox="20 40 890 245"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto lg:flex-1 lg:min-h-0 lg:h-full drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={controllerNavyId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <linearGradient id={cardGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4F8FF" />
          </linearGradient>
          <filter id={glowSignalId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- HORIZONTAL INSTRUCTION INPUT PIPELINE --- */}
        {/* Connection from Instruction to Decoder */}
        <path
          d="M 185 126 L 260 126"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 1 ? '1' : '0.25'}
        />
        <polygon
          points="258,121 268,126 258,131"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.35'}
        />

        {/* Connection from Decoder to Control Unit */}
        <path
          d="M 390 126 L 467 126"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 1 ? '1' : '0.25'}
        />
        <polygon
          points="465,121 475,126 465,131"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.35'}
        />

        {/* --- CONTROL SIGNAL BUSES RADIATING FROM CONTROL UNIT TO TARGET BOXES (x=762) --- */}
        {/* Signal 1: RegRead (center y=74) */}
        <path
          d="M 625 104 L 696 104 L 732 74 L 754 74"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 2 ? '1' : '0.25'}
        />
        {activeBeat >= 2 && !reducedMotion && (
          <path
            d="M 625 104 L 696 104 L 732 74 L 754 74"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="signal-pulse"
            filter={`url(#${glowSignalId})`}
          />
        )}
        <polygon
          points="752,69 762,74 752,79"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.35'}
        />

        {/* Signal 2: ALUOp (center y=126) */}
        <path
          d="M 625 126 L 754 126"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 2 ? '1' : '0.25'}
        />
        {activeBeat >= 2 && !reducedMotion && (
          <path
            d="M 625 126 L 754 126"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="signal-pulse"
            filter={`url(#${glowSignalId})`}
          />
        )}
        <polygon
          points="752,121 762,126 752,131"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.35'}
        />

        {/* Signal 3: RegWrite (center y=178) */}
        <path
          d="M 625 148 L 696 148 L 732 178 L 754 178"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={activeBeat >= 2 ? '1' : '0.25'}
        />
        {activeBeat >= 2 && !reducedMotion && (
          <path
            d="M 625 148 L 696 148 L 732 178 L 754 178"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="signal-pulse"
            filter={`url(#${glowSignalId})`}
          />
        )}
        <polygon
          points="752,173 762,178 752,183"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.35'}
        />

        {/* Feedback / Timing Clock Loop to Controller */}
        <path
          d="M 550 179.5 L 550 248 L 329 248 L 329 172"
          stroke="#2868E8"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          strokeOpacity={activeBeat >= 1 ? '0.75' : '0.25'}
        />
        <polygon
          points="324,174 329,164 334,174"
          fill="#2868E8"
          opacity={activeBeat >= 1 ? '0.9' : '0.35'}
        />
        <text
          x="440"
          y="269"
          textAnchor="middle"
          fill="#102A50"
          fillOpacity="0.75"
          fontSize="12"
          fontWeight="500"
          fontFamily="JetBrains Mono, monospace"
        >
          Timing & Step Feedback Loop
        </text>

        {/* --- BLOCK 1: INSTRUCTION INPUT --- */}
        <g id="instruction-input">
          <rect
            x="35"
            y="90"
            width="150"
            height="72"
            rx="16"
            fill={`url(#${cardGradId})`}
            stroke={activeBeat >= 0 ? '#2868E8' : 'rgba(40, 104, 232, 0.25)'}
            strokeWidth="1.8"
          />
          <text
            x="110"
            y="118"
            textAnchor="middle"
            fill="#102A50"
            fontSize="13"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Instruction
          </text>
          <text
            x="110"
            y="142"
            textAnchor="middle"
            fill="#1B54C7"
            fontSize="14"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            ADD R1, R2, R3
          </text>
        </g>

        {/* --- BLOCK 2: INSTRUCTION DECODER --- */}
        <g id="instruction-decoder">
          <rect
            x="268"
            y="88"
            width="122"
            height="76"
            rx="16"
            fill={activeBeat >= 1 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
            strokeWidth={activeBeat >= 1 ? '2.2' : '1.5'}
          />
          <text
            x="329"
            y="118"
            textAnchor="middle"
            fill="#102A50"
            fontSize="13"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Decoder
          </text>
          <text
            x="329"
            y="141"
            textAnchor="middle"
            fill={activeBeat >= 1 ? '#1B54C7' : '#102A50'}
            fillOpacity={activeBeat >= 1 ? '1' : '0.72'}
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? 'Opcode: 0x01' : 'Standby'}
          </text>
        </g>

        {/* --- BLOCK 3: CONTROL UNIT (CORE ENGINE) --- */}
        <g id="control-unit-core">
          <rect
            x="475"
            y="72"
            width="150"
            height="106"
            rx="18"
            fill={`url(#${controllerNavyId})`}
            stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
            strokeWidth="3"
          />
          <text
            x="550"
            y="116"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="0.5"
          >
            Control Unit
          </text>
          <text
            x="550"
            y="140"
            textAnchor="middle"
            fill="#DBEAFE"
            fontSize="11"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            State Machine / Logic
          </text>
          {/* Status Indicator LED */}
          <circle
            cx="606"
            cy="90"
            r="4.5"
            fill={activeBeat >= 1 ? '#2868E8' : 'rgba(255, 255, 255, 0.35)'}
          />
        </g>

        {/* --- BLOCK 4: CONTROL SIGNALS OUTPUTS --- */}
        <g id="signals-outputs">
          {/* Signal 1: RegRead */}
          <rect
            x="762"
            y="52"
            width="135"
            height="44"
            rx="12"
            fill={activeBeat >= 2 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 2 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
            strokeWidth={activeBeat >= 2 ? '2.2' : '1.2'}
          />
          <text
            x="829"
            y="79"
            textAnchor="middle"
            fill={activeBeat >= 2 ? '#1B54C7' : '#102A50'}
            fontSize="12"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            RegRead = 1
          </text>

          {/* Signal 2: ALUOp */}
          <rect
            x="762"
            y="104"
            width="135"
            height="44"
            rx="12"
            fill={activeBeat >= 2 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 2 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
            strokeWidth={activeBeat >= 2 ? '2.2' : '1.2'}
          />
          <text
            x="829"
            y="131"
            textAnchor="middle"
            fill={activeBeat >= 2 ? '#1B54C7' : '#102A50'}
            fontSize="12"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            ALUOp = ADD
          </text>

          {/* Signal 3: RegWrite */}
          <rect
            x="762"
            y="156"
            width="135"
            height="44"
            rx="12"
            fill={activeBeat >= 2 ? '#FFFFFF' : '#F8FAFF'}
            stroke={activeBeat >= 2 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
            strokeWidth={activeBeat >= 2 ? '2.2' : '1.2'}
          />
          <text
            x="829"
            y="183"
            textAnchor="middle"
            fill={activeBeat >= 2 ? '#1B54C7' : '#102A50'}
            fontSize="12"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            RegWrite = 1
          </text>
        </g>
      </svg>

      {/* Discrete State Pill */}
      <div className="mt-2 sm:mt-2.5 shrink-0 flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 text-[#102A50] text-xs xl:text-sm font-mono font-semibold shadow-sm flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-[#2868E8] shrink-0 ${reducedMotion ? '' : 'animate-pulse'}`} />
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
