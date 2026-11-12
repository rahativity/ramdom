import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface InstructionCycleProps {
  currentBeat?: number; // 0: Fetch, 1: Decode, 2: Execute, 3: WriteBack
  onSelectBeat?: (beat: number) => void;
  className?: string;
}

export const InstructionCycle: React.FC<InstructionCycleProps> = ({
  currentBeat = 0,
  onSelectBeat,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beat = currentBeat;
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');

  const irGradId = `irGrad-${uid}`;
  const ctrlGradId = `ctrlGrad-${uid}`;
  const aluMainGradId = `aluMainGrad-${uid}`;
  const glowBeatId = `glowBeat-${uid}`;

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion || beat === 0) return;

    const pulses = containerRef.current.querySelectorAll('.active-bus-pulse');
    if (pulses.length === 0) return;

    const ctx = gsap.context(() => {
      // Animated pulses along active buses (only when active pulse paths exist)
      gsap.to(pulses, {
        strokeDashoffset: -32,
        repeat: -1,
        duration: 1.2,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [beat, reducedMotion]);

  const stages = [
    { id: 0, label: '1. FETCH', desc: 'Fetch the instruction.' },
    { id: 1, label: '2. DECODE', desc: 'Decode the operation.' },
    { id: 2, label: '3. EXECUTE', desc: 'Execute through the ALU.' },
    { id: 3, label: '4. WRITE BACK', desc: 'Write the result back.' },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-0 flex flex-col justify-between ${className}`}
    >
      {/* Visual Domain Headers (Controller vs Datapath boundary) */}
      <div className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-2.5">
        <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#2868E8]/8 border border-[#2868E8]/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2868E8] shrink-0" />
          <span className="text-[clamp(0.75rem,0.55vw+0.48rem,1.05rem)] font-bold tracking-wide uppercase font-heading text-[#102A50]">
            Controller Domain
          </span>
          <span className="text-[clamp(0.7rem,0.45vw+0.45rem,0.95rem)] text-[#102A50]/75 hidden sm:inline">
            (Decides & Coordinates)
          </span>
        </div>
        <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#102A50]/5 border border-[#102A50]/15">
          <div className="w-2.5 h-2.5 rounded-full bg-[#102A50] shrink-0" />
          <span className="text-[clamp(0.75rem,0.55vw+0.48rem,1.05rem)] font-bold tracking-wide uppercase font-heading text-[#102A50]">
            Data Path Domain
          </span>
          <span className="text-[clamp(0.7rem,0.45vw+0.45rem,0.95rem)] text-[#102A50]/75 hidden sm:inline">
            (Moves & Processes Data)
          </span>
        </div>
      </div>

      {/* Main SVG Architectural Schematic */}
      <svg
        viewBox="0 25 980 350"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto lg:flex-1 lg:min-h-0 lg:h-full drop-shadow-sm select-none bg-white rounded-2xl border border-[#2868E8]/15 p-2 sm:p-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={irGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F5FF" />
          </linearGradient>
          <linearGradient id={ctrlGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <linearGradient id={aluMainGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <filter id={glowBeatId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- BUS 1: INSTRUCTION TO CONTROLLER (FETCH -> DECODE) --- */}
        <path
          d="M 235 88 L 327 88"
          stroke={beat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={beat >= 1 ? '1' : '0.25'}
        />
        <polygon
          points="325,83 335,88 325,93"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          opacity={beat >= 1 ? '1' : '0.35'}
        />

        {/* --- BUS 2: CONTROL SIGNALS (DECODE -> REGISTERS & ALU) --- */}
        {/* Signal to Register File (RegRead = 1): starts flush at Controller bottom edge (y=136) */}
        <path
          d="M 420 136 L 420 194 L 263 194"
          stroke={beat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeDasharray="6 4"
          strokeOpacity={beat >= 1 ? '1' : '0.25'}
        />
        {beat >= 1 && !reducedMotion && (
          <path
            d="M 420 136 L 420 194 L 263 194"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="active-bus-pulse"
            filter={`url(#${glowBeatId})`}
          />
        )}
        <polygon
          points="265,189 255,194 265,199"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          opacity={beat >= 1 ? '1' : '0.35'}
        />
        <text
          x="342"
          y="185"
          textAnchor="middle"
          fill={beat >= 1 ? '#1B54C7' : '#102A50'}
          fontSize="11"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          RegRead = 1
        </text>

        {/* Signal to ALU (ALUOp = ADD): arrowhead touches ALU top sloped edge at (695, 211) */}
        <path
          d="M 505 118 L 695 118 L 695 203"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeDasharray="6 4"
          strokeOpacity={beat >= 2 ? '1' : '0.25'}
        />
        {beat >= 2 && !reducedMotion && (
          <path
            d="M 505 118 L 695 118 L 695 203"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="active-bus-pulse"
            filter={`url(#${glowBeatId})`}
          />
        )}
        <polygon
          points="690,201 695,211 700,201"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          opacity={beat >= 2 ? '1' : '0.35'}
        />
        <text
          x="600"
          y="109"
          textAnchor="middle"
          fill={beat >= 2 ? '#1B54C7' : '#102A50'}
          fontSize="11"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          ALUOp = ADD
        </text>

        {/* --- BUS 3: DATA BUS (REGISTERS -> ALU), aligned to R2 (y=227) & R3 (y=259) --- */}
        {/* R2 (5) to ALU Input A */}
        <path
          d="M 255 227 L 632 227"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="4"
          strokeOpacity={beat >= 2 ? '1' : '0.25'}
        />
        <polygon
          points="630,222 640,227 630,232"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          opacity={beat >= 2 ? '1' : '0.35'}
        />
        {/* R3 (3) to ALU Input B */}
        <path
          d="M 255 259 L 585 259 L 615 296 L 632 296"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="4"
          strokeOpacity={beat >= 2 ? '1' : '0.25'}
        />
        <polygon
          points="630,291 640,296 630,301"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          opacity={beat >= 2 ? '1' : '0.35'}
        />

        {/* --- BUS 4: WRITE-BACK BUS (ALU RESULT -> REGISTER FILE R1) --- */}
        <path
          d="M 755 264 L 895 264 L 895 344 L 145 344 L 145 326"
          stroke={beat === 3 ? '#2868E8' : '#102A50'}
          strokeWidth="4"
          strokeOpacity={beat === 3 ? '1' : '0.25'}
        />
        {beat === 3 && !reducedMotion && (
          <path
            d="M 755 264 L 895 264 L 895 344 L 145 344 L 145 326"
            stroke="#6CA1FF"
            strokeWidth="4.5"
            strokeDasharray="12 24"
            className="active-bus-pulse"
            filter={`url(#${glowBeatId})`}
          />
        )}
        <polygon
          points="140,328 145,318 150,328"
          fill={beat === 3 ? '#2868E8' : '#102A50'}
          opacity={beat === 3 ? '1' : '0.35'}
        />
        <text
          x="525"
          y="362"
          textAnchor="middle"
          fill={beat === 3 ? '#1B54C7' : '#102A50'}
          fontSize="11"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          Write-Back Bus: Result [8] → R1 (RegWrite = 1)
        </text>

        {/* --- COMPONENT 1: INSTRUCTION REGISTER (IR) --- */}
        <g id="instruction-reg">
          <rect
            x="35"
            y="52"
            width="200"
            height="72"
            rx="14"
            fill={`url(#${irGradId})`}
            stroke={beat >= 0 ? '#2868E8' : 'rgba(40, 104, 232, 0.25)'}
            strokeWidth={beat === 0 ? '2.8' : '1.8'}
          />
          <text
            x="135"
            y="78"
            textAnchor="middle"
            fill="#102A50"
            fontSize="12"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            Instruction Register
          </text>
          <text
            x="135"
            y="104"
            textAnchor="middle"
            fill="#1B54C7"
            fontSize="14"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            ADD R1, R2, R3
          </text>
        </g>

        {/* --- COMPONENT 2: CONTROLLER --- */}
        <g id="master-controller">
          <rect
            x="335"
            y="42"
            width="170"
            height="94"
            rx="16"
            fill={`url(#${ctrlGradId})`}
            stroke={beat >= 1 ? '#2868E8' : '#102A50'}
            strokeWidth={beat === 1 ? '3.2' : '2'}
            filter={beat === 1 ? `url(#${glowBeatId})` : undefined}
          />
          <text
            x="420"
            y="82"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="17"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            Controller
          </text>
          <text
            x="420"
            y="106"
            textAnchor="middle"
            fill="#DBEAFE"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat >= 1 ? 'DECODE: ADD ACTIVE' : 'WAITING'}
          </text>
        </g>

        {/* --- COMPONENT 3: REGISTER FILE --- */}
        <g id="register-file">
          <rect
            x="35"
            y="172"
            width="220"
            height="146"
            rx="16"
            fill="#FFFFFF"
            stroke={beat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
            strokeWidth={beat === 1 || beat === 3 ? '2.8' : '1.8'}
          />
          <text
            x="145"
            y="198"
            textAnchor="middle"
            fill="#102A50"
            fontSize="13"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            Register File
          </text>

          {/* R2 row (center y=227) */}
          <rect
            x="50"
            y="214"
            width="190"
            height="26"
            rx="6"
            fill={beat >= 1 ? '#EBF2FF' : '#F8FAFF'}
            stroke="#2868E8"
            strokeWidth={beat >= 1 ? '1.8' : '0.8'}
            strokeOpacity="0.5"
          />
          <text
            x="65"
            y="232"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            R2 (Source A):
          </text>
          <text
            x="225"
            y="232"
            textAnchor="end"
            fill="#1B54C7"
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            5
          </text>

          {/* R3 row (center y=259) */}
          <rect
            x="50"
            y="246"
            width="190"
            height="26"
            rx="6"
            fill={beat >= 1 ? '#EBF2FF' : '#F8FAFF'}
            stroke="#2868E8"
            strokeWidth={beat >= 1 ? '1.8' : '0.8'}
            strokeOpacity="0.5"
          />
          <text
            x="65"
            y="264"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            R3 (Source B):
          </text>
          <text
            x="225"
            y="264"
            textAnchor="end"
            fill="#1B54C7"
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            3
          </text>

          {/* R1 row (Destination, center y=291) */}
          <rect
            x="50"
            y="278"
            width="190"
            height="26"
            rx="6"
            fill={beat === 3 ? '#2868E8' : '#F8FAFF'}
            stroke={beat === 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
            strokeWidth={beat === 3 ? '2.2' : '0.8'}
          />
          <text
            x="65"
            y="296"
            fill={beat === 3 ? '#FFFFFF' : '#102A50'}
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            R1 (Dest):
          </text>
          <text
            x="225"
            y="296"
            textAnchor="end"
            fill={beat === 3 ? '#FFFFFF' : '#102A50'}
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat === 3 ? '8' : '0'}
          </text>
        </g>

        {/* --- COMPONENT 4: ALU --- */}
        <g id="master-alu">
          <path
            d="M 640 192 L 755 232 L 755 296 L 640 334 L 640 278 L 658 263 L 640 248 Z"
            fill={`url(#${aluMainGradId})`}
            stroke={beat >= 2 ? '#2868E8' : '#102A50'}
            strokeWidth={beat === 2 ? '3.5' : '2.2'}
            filter={beat === 2 ? `url(#${glowBeatId})` : undefined}
          />
          <text
            x="695"
            y="258"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            ALU
          </text>
          <text
            x="695"
            y="278"
            textAnchor="middle"
            fill="#DBEAFE"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat >= 2 ? '5 + 3 = 8' : 'IDLE'}
          </text>
        </g>
      </svg>

      {/* Interactive 4-Stage Supporting Sequence Strip */}
      <div className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-2 sm:mt-2.5 select-none">
        {stages.map((stg) => {
          const isCurrent = stg.id === beat;
          const isCompleted = stg.id < beat;
          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => onSelectBeat?.(stg.id)}
              className={`min-h-[44px] p-2.5 sm:p-3 lg:p-3.5 xl:p-4 rounded-xl border text-left flex flex-col justify-center ${
                reducedMotion ? '' : 'transition-all duration-200'
              } cursor-pointer ${
                isCurrent
                  ? 'bg-white border-[#2868E8] shadow-sm ring-2 ring-[#2868E8]/20'
                  : isCompleted
                  ? 'bg-white/85 border-[#2868E8]/35 hover:bg-white'
                  : 'bg-white/60 border-[#102A50]/15 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className={`text-[clamp(0.75rem,0.55vw+0.48rem,1.05rem)] font-bold font-mono ${isCurrent ? 'text-[#1B54C7]' : 'text-[#102A50]'}`}>
                  {stg.label}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1B54C7] shrink-0" />
                ) : isCurrent ? (
                  <span className={`w-2 h-2 rounded-full bg-[#2868E8] shrink-0 ${reducedMotion ? '' : 'animate-ping'}`} />
                ) : null}
              </div>
              <p className="text-[clamp(0.72rem,0.5vw+0.45rem,0.98rem)] text-[#102A50]/80 font-sans leading-snug">
                {stg.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
