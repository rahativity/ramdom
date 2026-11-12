import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CPUArchitectureProps {
  mode?: 'hero' | 'split' | 'mascot';
  activeSection?: 'none' | 'datapath' | 'controller' | 'both';
  className?: string;
}

export const CPUArchitecture: React.FC<CPUArchitectureProps> = ({
  mode = 'hero',
  activeSection = 'both',
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const glowTracesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const ctx = gsap.context(() => {
      // Idle breathing pulse for circuit traces
      gsap.to('.trace-pulse', {
        strokeDashoffset: -40,
        repeat: -1,
        duration: 2.2,
        ease: 'none',
        stagger: 0.3,
      });

      // Subtle levitation for the chip
      gsap.to('.chip-float', {
        y: -6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient background soft glow */}
      <div 
        className="absolute w-[340px] h-[340px] rounded-full bg-[#2868E8]/12 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <svg
        ref={svgRef}
        viewBox="0 0 500 420"
        className="w-full max-w-[460px] h-auto drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pedestalTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EBF2FF" />
          </linearGradient>
          <linearGradient id="pedestalEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D2E3FC" />
            <stop offset="100%" stopColor="#B3CDFA" />
          </linearGradient>
          <linearGradient id="chipNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <linearGradient id="chipEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1C36" />
            <stop offset="100%" stopColor="#06101E" />
          </linearGradient>
          <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2868E8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6CA1FF" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LOWER BASE / SUBSTRATE PEDESTAL (Isometric Diamond) --- */}
        <g id="substrate">
          {/* Base bottom thickness */}
          <path
            d="M 250 380 L 440 270 L 440 286 L 250 396 L 60 286 L 60 270 Z"
            fill="url(#pedestalEdge)"
          />
          {/* Base top face */}
          <path
            d="M 250 170 L 440 270 L 250 370 L 60 270 Z"
            fill="url(#pedestalTop)"
            stroke="#2868E8"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />

          {/* Circuit Traces printed on the substrate */}
          <g ref={glowTracesRef} opacity="0.85">
            {/* Top-right traces */}
            <path
              d="M 330 230 L 420 280 L 450 264"
              stroke="#2868E8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <path
              d="M 330 230 L 420 280 L 450 264"
              stroke="#6CA1FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="12 36"
              className="trace-pulse"
              filter="url(#glowFilter)"
            />

            {/* Bottom-right traces */}
            <path
              d="M 290 310 L 380 340 L 410 325"
              stroke="#2868E8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <path
              d="M 290 310 L 380 340 L 410 325"
              stroke="#6CA1FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 30"
              className="trace-pulse"
              filter="url(#glowFilter)"
            />

            {/* Bottom-left traces */}
            <path
              d="M 210 310 L 120 340 L 90 325"
              stroke="#2868E8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <path
              d="M 210 310 L 120 340 L 90 325"
              stroke="#6CA1FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="14 32"
              className="trace-pulse"
              filter="url(#glowFilter)"
            />

            {/* Top-left traces */}
            <path
              d="M 170 230 L 80 280 L 50 264"
              stroke="#2868E8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
            <path
              d="M 170 230 L 80 280 L 50 264"
              stroke="#6CA1FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="12 36"
              className="trace-pulse"
              filter="url(#glowFilter)"
            />

            {/* Accent trace nodes */}
            <circle cx="450" cy="264" r="3.5" fill="#2868E8" />
            <circle cx="410" cy="325" r="3" fill="#2868E8" />
            <circle cx="90" cy="325" r="3" fill="#2868E8" />
            <circle cx="50" cy="264" r="3.5" fill="#2868E8" />
          </g>
        </g>

        {/* --- FLOATING CHIP DIE (Stepped 2.5D Silicon Die) --- */}
        <g className="chip-float">
          {/* External Metallic Pins (Socket Contacts) */}
          <g id="chip-pins" stroke="#2868E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
            {/* South-East edge pins */}
            <line x1="280" y1="262" x2="295" y2="272" />
            <line x1="298" y1="250" x2="313" y2="260" />
            <line x1="316" y1="238" x2="331" y2="248" />
            <line x1="334" y1="226" x2="349" y2="236" />
            <line x1="352" y1="214" x2="367" y2="224" />

            {/* South-West edge pins */}
            <line x1="220" y1="262" x2="205" y2="272" />
            <line x1="202" y1="250" x2="187" y2="260" />
            <line x1="184" y1="238" x2="169" y2="248" />
            <line x1="166" y1="226" x2="151" y2="236" />
            <line x1="148" y1="214" x2="133" y2="224" />
          </g>

          {/* Chip Bottom/Side Bevel */}
          <path
            d="M 250 250 L 370 175 L 370 192 L 250 267 L 130 192 L 130 175 Z"
            fill="url(#chipEdge)"
          />

          {/* Chip Top Silicon Die Face */}
          <path
            d="M 250 100 L 370 175 L 250 250 L 130 175 Z"
            fill="url(#chipNavy)"
            stroke="#2868E8"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Silicon Die Inset Border */}
          <path
            d="M 250 115 L 350 175 L 250 235 L 150 175 Z"
            fill="#102A50"
            stroke="#2868E8"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* Mode Variations */}
          {mode === 'hero' && (
            <g id="hero-branding">
              {/* Central Metallic Embossed "CPU" label */}
              <text
                x="250"
                y="182"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="24"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
                letterSpacing="2"
              >
                CPU
              </text>
              <text
                x="250"
                y="200"
                textAnchor="middle"
                fill="#2868E8"
                fontSize="9"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
                letterSpacing="1.5"
              >
                32-BIT ARCHITECTURE
              </text>
              {/* Corner alignment marker dot */}
              <circle cx="165" cy="175" r="3" fill="#2868E8" />
            </g>
          )}

          {mode === 'split' && (
            <g id="split-sections">
              {/* Left Domain: Data Path */}
              <path
                d="M 250 115 L 250 235 L 150 175 Z"
                fill={activeSection === 'datapath' || activeSection === 'both' ? '#2868E8' : '#102A50'}
                fillOpacity={activeSection === 'datapath' || activeSection === 'both' ? '0.35' : '0.1'}
                stroke="#2868E8"
                strokeWidth={activeSection === 'datapath' ? '2.5' : '1'}
                className="transition-all duration-300"
              />
              <text
                x="200"
                y="172"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
              >
                DATA PATH
              </text>
              <text
                x="200"
                y="186"
                textAnchor="middle"
                fill="#94BDFF"
                fontSize="8"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                ALU • Registers
              </text>

              {/* Right Domain: Controller */}
              <path
                d="M 250 115 L 350 175 L 250 235 Z"
                fill={activeSection === 'controller' || activeSection === 'both' ? '#2868E8' : '#102A50'}
                fillOpacity={activeSection === 'controller' || activeSection === 'both' ? '0.5' : '0.1'}
                stroke="#2868E8"
                strokeWidth={activeSection === 'controller' ? '2.5' : '1'}
                className="transition-all duration-300"
              />
              <text
                x="300"
                y="172"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
              >
                CONTROLLER
              </text>
              <text
                x="300"
                y="186"
                textAnchor="middle"
                fill="#94BDFF"
                fontSize="8"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                Decoder • Control Logic
              </text>

              {/* Center Interconnect Bus Divider */}
              <line
                x1="250"
                y1="115"
                x2="250"
                y2="235"
                stroke="#6CA1FF"
                strokeWidth="2"
                strokeDasharray="4 2"
                filter="url(#glowFilter)"
              />
            </g>
          )}

          {mode === 'mascot' && (
            <g id="mascot-face">
              {/* Adorable Chip Mascot from Reference Image Slide 7 */}
              {/* Eye Left */}
              <circle cx="225" cy="170" r="5" fill="#FFFFFF" />
              <circle cx="227" cy="168" r="2" fill="#2868E8" />
              {/* Eye Right */}
              <circle cx="275" cy="170" r="5" fill="#FFFFFF" />
              <circle cx="277" cy="168" r="2" fill="#2868E8" />
              {/* Cute smiling mouth */}
              <path
                d="M 242 182 Q 250 190 258 182"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Soft cheek blush */}
              <circle cx="218" cy="178" r="4" fill="#2868E8" fillOpacity="0.4" />
              <circle cx="282" cy="178" r="4" fill="#2868E8" fillOpacity="0.4" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

