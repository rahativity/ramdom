import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');

  const cardGradId = `dpCardGrad-${uid}`;
  const aluGradId = `dpAluGrad-${uid}`;
  const glowBlueId = `dpGlowBlue-${uid}`;

  useEffect(() => {
    if (!containerRef.current) return;

    const resetPackets = () => {
      const packets = containerRef.current?.querySelectorAll(
        '.packet-in-a, .packet-in-b, .packet-reg-a, .packet-reg-b, .packet-out, .packet-out-final'
      );
      if (packets && packets.length > 0) {
        gsap.set(packets, { opacity: 0 });
      }
    };

    if (reducedMotion) {
      resetPackets();
      const aluEls = containerRef.current.querySelectorAll('.alu-glow');
      if (aluEls.length > 0) {
        gsap.set(aluEls, { scale: 1, opacity: 1, transformOrigin: 'center center' });
      }
      return;
    }

    const ctx = gsap.context(() => {
      resetPackets();

      // Beat 1: Operands travel strictly along Input buses -> Registers R2 & R3
      if (activeBeat === 1) {
        gsap.fromTo(
          '.packet-in-a',
          { attr: { cx: 125, cy: 115 }, opacity: 0 },
          { attr: { cx: 235, cy: 115 }, opacity: 1, duration: 0.65, ease: 'power2.out' }
        );
        gsap.fromTo(
          '.packet-in-b',
          { attr: { cx: 125, cy: 225 }, opacity: 0 },
          { attr: { cx: 235, cy: 225 }, opacity: 1, duration: 0.65, ease: 'power2.out' }
        );
      }

      // Beat 2: Operands stream from R2 & R3 along Register->ALU wires + ALU pulses around center
      if (activeBeat === 2) {
        const regToAluTl = gsap.timeline();
        regToAluTl
          .fromTo(
            '.packet-reg-a',
            { attr: { cx: 346, cy: 115 }, opacity: 0 },
            { attr: { cx: 346, cy: 115 }, opacity: 1, duration: 0.08 }
          )
          .to('.packet-reg-a', { attr: { cx: 435, cy: 115 }, duration: 0.35, ease: 'power1.in' })
          .to('.packet-reg-a', { attr: { cx: 435, cy: 142 }, duration: 0.14, ease: 'none' })
          .to('.packet-reg-a', { attr: { cx: 456, cy: 142 }, duration: 0.16, ease: 'power1.out' });

        regToAluTl
          .fromTo(
            '.packet-reg-b',
            { attr: { cx: 346, cy: 225 }, opacity: 0 },
            { attr: { cx: 346, cy: 225 }, opacity: 1, duration: 0.08 },
            0
          )
          .to('.packet-reg-b', { attr: { cx: 435, cy: 225 }, duration: 0.35, ease: 'power1.in' }, 0.08)
          .to('.packet-reg-b', { attr: { cx: 435, cy: 198 }, duration: 0.14, ease: 'none' }, 0.43)
          .to('.packet-reg-b', { attr: { cx: 456, cy: 198 }, duration: 0.16, ease: 'power1.out' }, 0.57);

        gsap.fromTo(
          '.alu-glow',
          { scale: 1, transformOrigin: 'center center' },
          {
            scale: 1.05,
            repeat: 1,
            yoyo: true,
            duration: 0.38,
            delay: 0.55,
            ease: 'power2.inOut',
            transformOrigin: 'center center',
          }
        );
      }

      // Beat 3: Result packet 8 travels from ALU output -> R1 -> Output
      if (activeBeat === 3) {
        const writeOutTl = gsap.timeline();
        writeOutTl
          .fromTo(
            '.packet-out',
            { attr: { cx: 580, cy: 170 }, opacity: 0 },
            { attr: { cx: 681, cy: 170 }, opacity: 1, duration: 0.5, ease: 'power2.out' }
          )
          .fromTo(
            '.packet-out-final',
            { attr: { cx: 790, cy: 170 }, opacity: 0 },
            { attr: { cx: 848, cy: 170 }, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.1'
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeBeat, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-0 flex flex-col items-center justify-between ${className}`}
    >
      {/* SVG Circuit Canvas for Datapath */}
      <svg
        viewBox="0 65 945 260"
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto lg:flex-1 lg:min-h-0 lg:h-full drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={cardGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4F8FF" />
          </linearGradient>
          <linearGradient id={aluGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <filter id={glowBlueId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- CONNECTING BUSES --- */}
        {/* Bus from Input to Registers */}
        <path
          d="M 125 115 L 235 115"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 1 ? '0.95' : '0.25'}
        />
        <path
          d="M 125 225 L 235 225"
          stroke={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 1 ? '0.95' : '0.25'}
        />

        {/* Bus from Registers to ALU */}
        <path
          d="M 346 115 L 435 115 L 435 142 L 455 142"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 2 ? '0.95' : '0.25'}
        />
        <path
          d="M 346 225 L 435 225 L 435 198 L 455 198"
          stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 2 ? '0.95' : '0.25'}
        />

        {/* Bus from ALU to Destination Register */}
        <path
          d="M 580 170 L 680 170"
          stroke={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 3 ? '0.95' : '0.25'}
        />

        {/* Bus from Destination Register to Output */}
        <path
          d="M 790 170 L 845 170"
          stroke={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          strokeWidth="3.5"
          strokeOpacity={activeBeat >= 3 ? '0.95' : '0.25'}
        />

        {/* Dynamic moving data packet circles (placed above buses) */}
        <circle className="packet-in-a opacity-0" cx="125" cy="115" r="6" fill="#2868E8" filter={`url(#${glowBlueId})`} />
        <circle className="packet-in-b opacity-0" cx="125" cy="225" r="6" fill="#2868E8" filter={`url(#${glowBlueId})`} />
        <circle className="packet-reg-a opacity-0" cx="346" cy="115" r="6" fill="#2868E8" filter={`url(#${glowBlueId})`} />
        <circle className="packet-reg-b opacity-0" cx="346" cy="225" r="6" fill="#2868E8" filter={`url(#${glowBlueId})`} />
        <circle className="packet-out opacity-0" cx="580" cy="170" r="6.5" fill="#2868E8" filter={`url(#${glowBlueId})`} />
        <circle className="packet-out-final opacity-0" cx="790" cy="170" r="6.5" fill="#2868E8" filter={`url(#${glowBlueId})`} />

        {/* --- ARROWS ON BUSES --- */}
        <polygon
          points="233,110 242,115 233,120"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.35'}
        />
        <polygon
          points="233,220 242,225 233,230"
          fill={activeBeat >= 1 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 1 ? '1' : '0.35'}
        />
        <polygon
          points="453,137 462,142 453,147"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.35'}
        />
        <polygon
          points="453,193 462,198 453,203"
          fill={activeBeat >= 2 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 2 ? '1' : '0.35'}
        />
        <polygon
          points="678,165 686,170 678,175"
          fill={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 3 ? '1' : '0.35'}
        />
        <polygon
          points="843,165 852,170 843,175"
          fill={activeBeat >= 3 ? '#2868E8' : '#102A50'}
          opacity={activeBeat >= 3 ? '1' : '0.35'}
        />

        {/* --- STAGE 1: INPUT DATA BLOCKS --- */}
        <g id="input-data-block">
          {/* Input A card */}
          <rect
            x="15"
            y="85"
            width="110"
            height="60"
            rx="14"
            fill={`url(#${cardGradId})`}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(40, 104, 232, 0.3)'}
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
            fill="#1B54C7"
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
            fill={`url(#${cardGradId})`}
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(40, 104, 232, 0.3)'}
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
            fill="#1B54C7"
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
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
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
            fill={activeBeat >= 1 ? '#1B54C7' : '#102A50'}
            fillOpacity={activeBeat >= 1 ? '1' : '0.72'}
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
            stroke={activeBeat >= 1 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
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
            fill={activeBeat >= 1 ? '#1B54C7' : '#102A50'}
            fillOpacity={activeBeat >= 1 ? '1' : '0.72'}
            fontSize="20"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 1 ? '3' : '-'}
          </text>
        </g>

        {/* --- STAGE 3: ALU --- */}
        <g id="alu-unit" className={activeBeat >= 2 ? 'alu-glow' : ''}>
          <path
            d="M 462 90 L 580 130 L 580 210 L 462 250 L 462 188 L 480 170 L 462 152 Z"
            fill={`url(#${aluGradId})`}
            stroke={activeBeat >= 2 ? '#2868E8' : '#102A50'}
            strokeWidth="3"
            filter={activeBeat >= 2 ? `url(#${glowBlueId})` : undefined}
          />
          <text
            x="522"
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
            x="522"
            y="186"
            textAnchor="middle"
            fill="#DBEAFE"
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
            stroke={activeBeat >= 3 ? '#2868E8' : 'rgba(16, 42, 80, 0.25)'}
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
            fill={activeBeat >= 3 ? '#1B54C7' : '#102A50'}
            fillOpacity={activeBeat >= 3 ? '1' : '0.72'}
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
            width="72"
            height="64"
            rx="14"
            fill={`url(#${cardGradId})`}
            stroke={activeBeat >= 3 ? '#2868E8' : 'rgba(40, 104, 232, 0.3)'}
            strokeWidth="1.8"
          />
          <text
            x="888"
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
            x="888"
            y="188"
            textAnchor="middle"
            fill={activeBeat >= 3 ? '#1B54C7' : '#102A50'}
            fillOpacity={activeBeat >= 3 ? '1' : '0.72'}
            fontSize="18"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {activeBeat >= 3 ? '8' : '-'}
          </text>
        </g>

        {/* --- BUS STATUS LABEL --- */}
        <text
          x="472"
          y="310"
          textAnchor="middle"
          fill="#102A50"
          fillOpacity="0.75"
          fontSize="13"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
        >
          Internal Datapath Bus: Moves Operands and Latches Results
        </text>
      </svg>

      {/* Discrete State Indicator Pill */}
      <div className="mt-2 sm:mt-2.5 shrink-0 flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#2868E8]/20 text-[#102A50] text-xs xl:text-sm font-mono font-semibold shadow-sm flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-[#2868E8] shrink-0 ${reducedMotion ? '' : 'animate-pulse'}`} />
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
