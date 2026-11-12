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
    { id: 0, label: '1. FETCH', desc: 'Instruction fetched into IR' },
    { id: 1, label: '2. DECODE', desc: 'Controller decodes opcode' },
    { id: 2, label: '3. EXECUTE', desc: 'ALU performs 5 + 3' },
    { id: 3, label: '4. WRITE BACK', desc: 'R1 updated from 0 → 8' },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-3 sm:p-5 ${className}`}
    >
      {/* Visual Domain Headers (Controller vs Datapath boundary) */}
      <div className="w-full grid grid-cols-2 gap-4 mb-3 px-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2868E8]/8 border border-[#2868E8]/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2868E8]" />
          <span className="text-xs font-bold tracking-wide uppercase font-heading text-[#102A50]">
            Controller Domain
          </span>
          <span className="text-[11px] text-[#102A50]/60 hidden sm:inline">
            (Decides & Coordinates)
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#102A50]/5 border border-[#102A50]/15">
          <div className="w-2.5 h-2.5 rounded-full bg-[#102A50]" />
          <span className="text-xs font-bold tracking-wide uppercase font-heading text-[#102A50]">
            Data Path Domain
          </span>
          <span className="text-[11px] text-[#102A50]/60 hidden sm:inline">
            (Moves & Processes Data)
          </span>
        </div>
      </div>

      {/* Main SVG Architectural Schematic */}
      <svg
        viewBox="0 0 960 400"
        className="w-full h-auto drop-shadow-md select-none bg-white rounded-2xl border border-[#2868E8]/15 p-2"
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
          d="M 230 100 L 320 100"
          stroke={beat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3"
          strokeOpacity={beat >= 1 ? '1' : '0.2'}
        />
        <polygon
          points="318,96 326,100 318,104"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          opacity={beat >= 1 ? '1' : '0.3'}
        />

        {/* --- BUS 2: CONTROL SIGNALS (DECODE -> REGISTERS & ALU) --- */}
        {/* Signal to Register File (RegRead) */}
        <path
          d="M 400 150 L 400 230 L 260 230"
          stroke={beat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="2.5"
          strokeDasharray="6 4"
          strokeOpacity={beat >= 1 ? '1' : '0.2'}
        />
        {beat >= 1 && (
          <path
            d="M 400 150 L 400 230 L 260 230"
            stroke="#6CA1FF"
            strokeWidth="3"
            strokeDasharray="8 16"
            className="active-bus-pulse"
            filter="url(#glowBeat)"
          />
        )}
        <polygon
          points="262,226 254,230 262,234"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          opacity={beat >= 1 ? '1' : '0.3'}
        />
        <text
          x="350"
          y="222"
          textAnchor="middle"
          fill={beat >= 1 ? '#2868E8' : '#102A50'}
          fontSize="10"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          RegRead = 1
        </text>

        {/* Signal to ALU (ALUOp: ADD) */}
        <path
          d="M 480 130 L 680 130 L 680 200"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="2.5"
          strokeDasharray="6 4"
          strokeOpacity={beat >= 2 ? '1' : '0.2'}
        />
        {beat >= 2 && (
          <path
            d="M 480 130 L 680 130 L 680 200"
            stroke="#6CA1FF"
            strokeWidth="3"
            strokeDasharray="8 16"
            className="active-bus-pulse"
            filter="url(#glowBeat)"
          />
        )}
        <polygon
          points="676,198 680,206 684,198"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          opacity={beat >= 2 ? '1' : '0.3'}
        />
        <text
          x="580"
          y="122"
          textAnchor="middle"
          fill={beat >= 2 ? '#2868E8' : '#102A50'}
          fontSize="10"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          ALUOp = ADD
        </text>

        {/* --- BUS 3: DATA BUS (REGISTERS -> ALU) --- */}
        {/* R2 (5) to ALU Input A */}
        <path
          d="M 250 270 L 600 270 L 620 250"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={beat >= 2 ? '1' : '0.2'}
        />
        {/* R3 (3) to ALU Input B */}
        <path
          d="M 250 310 L 600 310 L 620 290"
          stroke={beat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={beat >= 2 ? '1' : '0.2'}
        />

        {/* --- BUS 4: WRITE-BACK BUS (ALU RESULT -> REGISTER FILE R1) --- */}
        <path
          d="M 740 270 L 880 270 L 880 370 L 150 370 L 150 340"
          stroke={beat === 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={beat === 3 ? '1' : '0.2'}
        />
        {beat === 3 && (
          <path
            d="M 740 270 L 880 270 L 880 370 L 150 370 L 150 340"
            stroke="#6CA1FF"
            strokeWidth="4"
            strokeDasharray="12 24"
            className="active-bus-pulse"
            filter="url(#glowBeat)"
          />
        )}
        <polygon
          points="146,342 150,334 154,342"
          fill={beat === 3 ? '#2868E8' : '#102A50'}
          opacity={beat === 3 ? '1' : '0.25'}
        />
        <text
          x="515"
          y="386"
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
            x="40"
            y="65"
            width="190"
            height="70"
            rx="12"
            fill="url(#irGrad)"
            stroke={beat >= 0 ? '#2868E8' : 'rgba(40, 104, 232, 0.2)'}
            strokeWidth={beat === 0 ? '2.5' : '1.5'}
          />
          <text
            x="135"
            y="90"
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
            y="115"
            textAnchor="middle"
            fill="#2868E8"
            fontSize="13"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            ADD R1, R2, R3
          </text>
        </g>

        {/* --- COMPONENT 2: CONTROLLER --- */}
        <g id="master-controller">
          <rect
            x="326"
            y="55"
            width="154"
            height="90"
            rx="16"
            fill="url(#ctrlGrad)"
            stroke={beat >= 1 ? '#2868E8' : '#102A50'}
            strokeWidth={beat === 1 ? '3' : '2'}
            filter={beat === 1 ? 'url(#glowBeat)' : undefined}
          />
          <text
            x="403"
            y="95"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            Controller
          </text>
          <text
            x="403"
            y="118"
            textAnchor="middle"
            fill="#94BDFF"
            fontSize="10"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat >= 1 ? 'DECODE: ADD ACTIVE' : 'WAITING'}
          </text>
        </g>

        {/* --- COMPONENT 3: REGISTER FILE --- */}
        <g id="register-file">
          <rect
            x="40"
            y="190"
            width="210"
            height="145"
            rx="14"
            fill="#FFFFFF"
            stroke={beat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={beat === 1 || beat === 3 ? '2.5' : '1.5'}
          />
          <text
            x="145"
            y="215"
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
            x="55"
            y="230"
            width="180"
            height="26"
            rx="6"
            fill={beat >= 1 ? '#EBF2FF' : '#F8FAFF'}
            stroke="#2868E8"
            strokeWidth={beat >= 1 ? '1.5' : '0.5'}
            strokeOpacity="0.4"
          />
          <text
            x="70"
            y="247"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            R2 (Source A):
          </text>
          <text
            x="215"
            y="247"
            textAnchor="end"
            fill="#2868E8"
            fontSize="12"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            5
          </text>

          {/* R3 row */}
          <rect
            x="55"
            y="262"
            width="180"
            height="26"
            rx="6"
            fill={beat >= 1 ? '#EBF2FF' : '#F8FAFF'}
            stroke="#2868E8"
            strokeWidth={beat >= 1 ? '1.5' : '0.5'}
            strokeOpacity="0.4"
          />
          <text
            x="70"
            y="279"
            fill="#102A50"
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            R3 (Source B):
          </text>
          <text
            x="215"
            y="279"
            textAnchor="end"
            fill="#2868E8"
            fontSize="12"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            3
          </text>

          {/* R1 row (Destination) */}
          <rect
            x="55"
            y="294"
            width="180"
            height="26"
            rx="6"
            fill={beat === 3 ? '#2868E8' : '#F8FAFF'}
            stroke={beat === 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.2)'}
            strokeWidth={beat === 3 ? '2' : '0.5'}
          />
          <text
            x="70"
            y="311"
            fill={beat === 3 ? '#FFFFFF' : '#102A50'}
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            R1 (Dest):
          </text>
          <text
            x="215"
            y="311"
            textAnchor="end"
            fill={beat === 3 ? '#FFFFFF' : '#102A50'}
            fontSize="12"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat === 3 ? '8' : '0'}
          </text>
        </g>

        {/* --- COMPONENT 4: ALU --- */}
        <g id="master-alu">
          <path
            d="M 626 210 L 734 245 L 734 305 L 626 340 L 626 288 L 642 275 L 626 262 Z"
            fill="url(#aluMainGrad)"
            stroke={beat >= 2 ? '#2868E8' : '#102A50'}
            strokeWidth={beat === 2 ? '3' : '2'}
            filter={beat === 2 ? 'url(#glowBeat)' : undefined}
          />
          <text
            x="676"
            y="270"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            ALU
          </text>
          <text
            x="676"
            y="288"
            textAnchor="middle"
            fill="#94BDFF"
            fontSize="10"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {beat >= 2 ? '5 + 3 = 8' : 'IDLE'}
          </text>
        </g>
      </svg>

      {/* Interactive 4-Stage Control Strip */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 select-none">
        {stages.map((stg) => {
          const isCurrent = stg.id === beat;
          const isCompleted = stg.id < beat;
          return (
            <button
              key={stg.id}
              onClick={() => onSelectBeat?.(stg.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-white border-[#2868E8] shadow-sm ring-2 ring-[#2868E8]/20'
                  : isCompleted
                  ? 'bg-white/80 border-[#2868E8]/30 hover:bg-white'
                  : 'bg-white/40 border-[#102A50]/10 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold font-mono ${isCurrent ? 'text-[#2868E8]' : 'text-[#102A50]'}`}>
                  {stg.label}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2868E8]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#2868E8] animate-ping" />
                ) : null}
              </div>
              <p className="text-[11px] text-[#102A50]/70 font-sans leading-tight">
                {stg.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
