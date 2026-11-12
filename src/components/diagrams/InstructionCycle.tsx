import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';

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

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Animated pulses along active buses
      gsap.to('.active-bus-pulse', {
        strokeDashoffset: -32,
        repeat: -1,
        duration: 1.2,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [beat]);

  const stages = [
    { id: 0, label: '1. FETCH', desc: 'Fetch the instruction.' },
    { id: 1, label: '2. DECODE', desc: 'Decode the operation.' },
    { id: 2, label: '3. EXECUTE', desc: 'Execute through the ALU.' },
    { id: 3, label: '4. WRITE BACK', desc: 'Write the result back.' },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center ${className}`}
    >
      {/* Visual Domain Headers (Controller vs Datapath boundary) */}
      <div className="w-full grid grid-cols-2 gap-4 mb-2 px-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2868E8]/8 border border-[#2868E8]/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2868E8]" />
          <span className="text-xs font-bold tracking-wide uppercase font-heading text-[#102A50]">
            Controller Domain
          </span>
          <span className="text-[11px] text-[#102A50]/65 hidden sm:inline">
            (Decides & Coordinates)
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#102A50]/5 border border-[#102A50]/15">
          <div className="w-2.5 h-2.5 rounded-full bg-[#102A50]" />
          <span className="text-xs font-bold tracking-wide uppercase font-heading text-[#102A50]">
            Data Path Domain
          </span>
          <span className="text-[11px] text-[#102A50]/65 hidden sm:inline">
            (Moves & Processes Data)
          </span>
        </div>
      </div>

      {/* Main SVG Architectural Schematic - Optimized viewBox to fit comfortably in 16:9 */}
      <svg
        viewBox="0 0 980 375"
        className="w-full h-auto drop-shadow-sm select-none bg-white rounded-2xl border border-[#2868E8]/15 p-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="irGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F5FF" />
          </linearGradient>
          <linearGradient id="ctrlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <linearGradient id="aluMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <filter id="glowBeat" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- BUS 1: INSTRUCTION TO CONTROLLER (FETCH -> DECODE) --- */}
        <path
          d="M 235 90 L 330 90"
          stroke={beat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={beat >= 1 ? '1' : '0.2'}
        />
        <polygon
          points="328,85 338,90 328,95"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          opacity={beat >= 1 ? '1' : '0.3'}
        />

        {/* --- BUS 2: CONTROL SIGNALS (DECODE -> REGISTERS & ALU) --- */}
        {/* Signal to Register File (RegRead) */}
        <path
          d="M 415 145 L 415 220 L 265 220"
          stroke={beat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeDasharray="6 4"
          strokeOpacity={beat >= 1 ? '1' : '0.2'}
        />
        {beat >= 1 && (
          <path
            d="M 415 145 L 415 220 L 265 220"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="active-bus-pulse"
            filter="url(#glowBeat)"
          />
        )}
        <polygon
          points="267,215 257,220 267,225"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          opacity={beat >= 1 ? '1' : '0.3'}
        />
        <text
          x="345"
          y="212"
          textAnchor="middle"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          fontSize="11"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          RegRead = 1
        </text>

        {/* Signal to ALU (ALUOp: ADD) */}
        <path
          d="M 505 120 L 695 120 L 695 188"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeDasharray="6 4"
          strokeOpacity={beat >= 2 ? '1' : '0.2'}
        />
        {beat >= 2 && (
          <path
            d="M 505 120 L 695 120 L 695 188"
            stroke="#6CA1FF"
            strokeWidth="3.5"
            strokeDasharray="8 16"
            className="active-bus-pulse"
            filter="url(#glowBeat)"
          />
        )}
        <polygon
          points="690,186 695,196 700,186"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          opacity={beat >= 2 ? '1' : '0.3'}
        />
        <text
          x="600"
          y="110"
          textAnchor="middle"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          fontSize="11"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          ALUOp = ADD
        </text>

        {/* --- BUS 3: DATA BUS (REGISTERS -> ALU) --- */}
        {/* R2 (5) to ALU Input A */}
        <path
          d="M 255 258 L 610 258 L 635 238"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="4"
          strokeOpacity={beat >= 2 ? '1' : '0.2'}
        />
        {/* R3 (3) to ALU Input B */}
        <path
          d="M 255 298 L 610 298 L 635 280"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="4"
          strokeOpacity={beat >= 2 ? '1' : '0.2'}
        />

        {/* --- BUS 4: WRITE-BACK BUS (ALU RESULT -> REGISTER FILE R1) --- */}
        <path
          d="M 755 258 L 895 258 L 895 348 L 145 348 L 145 325"
          stroke={beat === 3 ? '#2868E8' : '#102A50'}
          strokeWidth="4"
          strokeOpacity={beat === 3 ? '1' : '0.2'}
        />
        {beat === 3 && (
          <path
            d="M 755 258 L 895 258 L 895 348 L 145 348 L 145 325"
            stroke="#6CA1FF"
            strokeWidth="4.5"
            strokeDasharray="12 24"
            className="active-bus-pulse"
            filter="url(#glowBeat)"
          />
        )}
        <polygon
          points="140,327 145,317 150,327"
          fill={beat === 3 ? '#2868E8' : '#102A50'}
          opacity={beat === 3 ? '1' : '0.25'}
        />
        <text
          x="525"
          y="364"
          textAnchor="middle"
          fill={beat === 3 ? '#2868E8' : '#102A50'}
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
            fill="url(#irGrad)"
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
            fill="#2868E8"
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
            fill="url(#ctrlGrad)"
            stroke={beat >= 1 ? '#2868E8' : '#102A50'}
            strokeWidth={beat === 1 ? '3.2' : '2'}
            filter={beat === 1 ? 'url(#glowBeat)' : undefined}
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
            fill="#94BDFF"
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
            stroke={beat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
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

          {/* R2 row */}
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
            fill="#2868E8"
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            5
          </text>

          {/* R3 row */}
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
            fill="#2868E8"
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            3
          </text>

          {/* R1 row (Destination) */}
          <rect
            x="50"
            y="278"
            width="190"
            height="26"
            rx="6"
            fill={beat === 3 ? '#2868E8' : '#F8FAFF'}
            stroke={beat === 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
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
            fill="url(#aluMainGrad)"
            stroke={beat >= 2 ? '#2868E8' : '#102A50'}
            strokeWidth={beat === 2 ? '3.5' : '2.2'}
            filter={beat === 2 ? 'url(#glowBeat)' : undefined}
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
            fill="#94BDFF"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat >= 2 ? '5 + 3 = 8' : 'IDLE'}
          </text>
        </g>
      </svg>

      {/* Interactive 4-Stage Supporting Sequence Strip */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2 select-none">
        {stages.map((stg) => {
          const isCurrent = stg.id === beat;
          const isCompleted = stg.id < beat;
          return (
            <button
              key={stg.id}
              onClick={() => onSelectBeat?.(stg.id)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-white border-[#2868E8] shadow-sm ring-2 ring-[#2868E8]/20'
                  : isCompleted
                  ? 'bg-white/80 border-[#2868E8]/30 hover:bg-white'
                  : 'bg-white/40 border-[#102A50]/10 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-xs font-bold font-mono ${isCurrent ? 'text-[#2868E8]' : 'text-[#102A50]'}`}>
                  {stg.label}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2868E8]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] animate-ping" />
                ) : null}
              </div>
              <p className="text-[11px] text-[#102A50]/80 font-sans leading-tight">
                {stg.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
