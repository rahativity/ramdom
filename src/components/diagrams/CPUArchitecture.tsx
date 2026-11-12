import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const isSplitMode = mode === 'split';
  const isDatapathActive = activeSection === 'datapath' || activeSection === 'both';
  const isControllerActive = activeSection === 'controller' || activeSection === 'both';

  const pedestalTopId = `pedestalTop-${uid}`;
  const pedestalEdgeId = `pedestalEdge-${uid}`;
  const chipNavyId = `chipNavy-${uid}`;
  const chipEdgeId = `chipEdge-${uid}`;
  const glowFilterId = `glowFilter-${uid}`;

  useEffect(() => {
    if (!svgRef.current) return;
    if (reducedMotion) {
      gsap.set(svgRef.current.querySelectorAll('.trace-pulse'), { strokeDashoffset: 0 });
      gsap.set(svgRef.current.querySelectorAll('.chip-float'), { y: 0 });
      return;
    }

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
  }, [reducedMotion, mode]);

  return (
    <div className={`relative min-h-0 flex items-center justify-center select-none ${className}`}>
      {/* Ambient background soft glow */}
      <div
        className={`absolute rounded-full bg-[#2868E8]/12 blur-3xl pointer-events-none -z-10 ${
          isSplitMode ? 'inset-x-[12%] inset-y-[6%]' : 'w-[74%] aspect-square'
        }`}
        aria-hidden="true"
      />

      <svg
        ref={svgRef}
        viewBox={isSplitMode ? '-145 92 790 306' : '35 88 430 315'}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-auto lg:h-full max-h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={pedestalTopId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EBF2FF" />
          </linearGradient>
          <linearGradient id={pedestalEdgeId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D2E3FC" />
            <stop offset="100%" stopColor="#B3CDFA" />
          </linearGradient>
          <linearGradient id={chipNavyId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="100%" stopColor="#102A50" />
          </linearGradient>
          <linearGradient id={chipEdgeId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1C36" />
            <stop offset="100%" stopColor="#06101E" />
          </linearGradient>
          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- PANORAMIC SPLIT-MODE ARCHITECTURAL WINGS --- */}
        {isSplitMode && (
          <g id="split-wings">
            {/* Left Wing: Data Path (ALU Core + Register File + Data Bus) */}
            <g
              id="split-wing-datapath"
              opacity={isDatapathActive ? 1 : 0.45}
              className={reducedMotion ? undefined : 'transition-opacity duration-300'}
            >
              {/* Orthogonal PCB Trace: Upper substrate (50, 264) -> ALU Core (25, 178) */}
              <path
                d="M 50 264 L 38 264 L 38 178 L 25 178"
                stroke="#2868E8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={isDatapathActive ? 0.65 : 0.4}
              />
              {!reducedMotion && (
                <path
                  d="M 50 264 L 38 264 L 38 178 L 25 178"
                  stroke="#6CA1FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 30"
                  className="trace-pulse"
                  filter={`url(#${glowFilterId})`}
                />
              )}

              {/* Orthogonal PCB Trace: Lower substrate (90, 325) -> Register File (25, 325) */}
              <path
                d="M 90 325 L 25 325"
                stroke="#2868E8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity={isDatapathActive ? 0.65 : 0.4}
              />
              {!reducedMotion && (
                <path
                  d="M 90 325 L 25 325"
                  stroke="#6CA1FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray="10 30"
                  className="trace-pulse"
                  filter={`url(#${glowFilterId})`}
                />
              )}

              {/* Vertical Inter-Block Data Bus Spine */}
              <path
                d="M -50 216 L -50 287"
                stroke="#2868E8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity={isDatapathActive ? 0.65 : 0.4}
              />
              {!reducedMotion && (
                <path
                  d="M -50 216 L -50 287"
                  stroke="#6CA1FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray="10 30"
                  className="trace-pulse"
                  filter={`url(#${glowFilterId})`}
                />
              )}
              <polygon points="-54,224 -50,217 -46,224" fill="#2868E8" />
              <polygon points="-54,279 -50,286 -46,279" fill="#2868E8" />

              {/* Subsystem Card 1: ALU Core */}
              <rect
                x="-125"
                y="140"
                width="150"
                height="76"
                rx="12"
                fill={isDatapathActive ? '#EBF2FF' : '#F8FAFF'}
                stroke="#2868E8"
                strokeWidth={isDatapathActive ? 2 : 1.5}
                strokeOpacity={isDatapathActive ? 1 : 0.5}
              />
              <rect
                x="-111"
                y="148"
                width="122"
                height="3"
                rx="1.5"
                fill="#2868E8"
                fillOpacity={isDatapathActive ? 0.85 : 0.4}
              />
              <circle cx="25" cy="178" r="3.5" fill="#2868E8" />
              <text
                x="-50"
                y="175"
                textAnchor="middle"
                fill="#102A50"
                fontSize="13"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
              >
                ALU Core
              </text>
              <text
                x="-50"
                y="196"
                textAnchor="middle"
                fill="#1B54C7"
                fontSize="11"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                Arithmetic • Logic
              </text>

              {/* Subsystem Card 2: Register File */}
              <rect
                x="-125"
                y="287"
                width="150"
                height="76"
                rx="12"
                fill={isDatapathActive ? '#EBF2FF' : '#F8FAFF'}
                stroke="#2868E8"
                strokeWidth={isDatapathActive ? 2 : 1.5}
                strokeOpacity={isDatapathActive ? 1 : 0.5}
              />
              <rect
                x="-111"
                y="295"
                width="122"
                height="3"
                rx="1.5"
                fill="#2868E8"
                fillOpacity={isDatapathActive ? 0.85 : 0.4}
              />
              <circle cx="25" cy="325" r="3.5" fill="#2868E8" />
              <text
                x="-50"
                y="322"
                textAnchor="middle"
                fill="#102A50"
                fontSize="13"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
              >
                Register File
              </text>
              <text
                x="-50"
                y="343"
                textAnchor="middle"
                fill="#1B54C7"
                fontSize="11"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                R1 · R2 · R3
              </text>

              {/* Subtle DATA BUS Directional Marker */}
              <rect
                x="-104"
                y="239.5"
                width="108"
                height="24"
                rx="12"
                fill="#FFFFFF"
                stroke="#2868E8"
                strokeWidth="1.5"
                strokeOpacity={isDatapathActive ? 0.9 : 0.5}
              />
              <path
                d="M -86 249 L -75 249 M -78 246.5 L -75 249 L -78 251.5 M -75 254.5 L -86 254.5 M -83 252 L -86 254.5 L -83 257"
                stroke="#1B54C7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="-68"
                y="255.5"
                textAnchor="start"
                fill="#1B54C7"
                fontSize="11"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                DATA BUS
              </text>
            </g>

            {/* Right Wing: Controller (Instr. Decoder + Timing Sequencer + Control Bus) */}
            <g
              id="split-wing-controller"
              opacity={isControllerActive ? 1 : 0.45}
              className={reducedMotion ? undefined : 'transition-opacity duration-300'}
            >
              {/* Orthogonal PCB Trace: Upper substrate (450, 264) -> Instr. Decoder (475, 178) */}
              <path
                d="M 450 264 L 462 264 L 462 178 L 475 178"
                stroke={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={isControllerActive ? 0.65 : 0.35}
              />
              {!reducedMotion && (
                <path
                  d="M 450 264 L 462 264 L 462 178 L 475 178"
                  stroke="#6CA1FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 30"
                  className="trace-pulse"
                  filter={`url(#${glowFilterId})`}
                />
              )}

              {/* Orthogonal PCB Trace: Timing Sequencer (475, 325) -> Lower substrate (410, 325) */}
              <path
                d="M 475 325 L 410 325"
                stroke={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity={isControllerActive ? 0.65 : 0.35}
              />
              {!reducedMotion && (
                <path
                  d="M 475 325 L 410 325"
                  stroke="#6CA1FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray="10 30"
                  className="trace-pulse"
                  filter={`url(#${glowFilterId})`}
                />
              )}
              <polygon
                points="423,321 416,325 423,329"
                fill={activeSection === 'controller' ? '#2868E8' : '#102A50'}
              />

              {/* Vertical Inter-Block Control Bus Spine */}
              <path
                d="M 550 216 L 550 287"
                stroke={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity={isControllerActive ? 0.65 : 0.35}
              />
              {!reducedMotion && (
                <path
                  d="M 550 216 L 550 287"
                  stroke="#6CA1FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeDasharray="10 30"
                  className="trace-pulse"
                  filter={`url(#${glowFilterId})`}
                />
              )}
              <polygon
                points="546,279 550,286 554,279"
                fill={activeSection === 'controller' ? '#2868E8' : '#102A50'}
              />

              {/* Subsystem Card 1: Instr. Decoder */}
              <rect
                x="475"
                y="140"
                width="150"
                height="76"
                rx="12"
                fill={isControllerActive ? '#FFFFFF' : '#F8FAFF'}
                stroke={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                strokeWidth={isControllerActive ? 2 : 1.5}
                strokeOpacity={activeSection === 'controller' ? 1 : isControllerActive ? 0.75 : 0.45}
              />
              <rect
                x="489"
                y="148"
                width="122"
                height="3"
                rx="1.5"
                fill={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                fillOpacity={isControllerActive ? 0.85 : 0.35}
              />
              <circle
                cx="475"
                cy="178"
                r="3.5"
                fill={activeSection === 'controller' ? '#2868E8' : '#102A50'}
              />
              <text
                x="550"
                y="175"
                textAnchor="middle"
                fill="#102A50"
                fontSize="13"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
              >
                Instr. Decoder
              </text>
              <text
                x="550"
                y="196"
                textAnchor="middle"
                fill="#1B54C7"
                fontSize="11"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                Opcode 0x01
              </text>

              {/* Subsystem Card 2: Timing Sequencer */}
              <rect
                x="475"
                y="287"
                width="150"
                height="76"
                rx="12"
                fill={isControllerActive ? '#FFFFFF' : '#F8FAFF'}
                stroke={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                strokeWidth={isControllerActive ? 2 : 1.5}
                strokeOpacity={activeSection === 'controller' ? 1 : isControllerActive ? 0.75 : 0.45}
              />
              <rect
                x="489"
                y="295"
                width="122"
                height="3"
                rx="1.5"
                fill={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                fillOpacity={isControllerActive ? 0.85 : 0.35}
              />
              <circle
                cx="475"
                cy="325"
                r="3.5"
                fill={activeSection === 'controller' ? '#2868E8' : '#102A50'}
              />
              <text
                x="550"
                y="322"
                textAnchor="middle"
                fill="#102A50"
                fontSize="13"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
              >
                Timing Sequencer
              </text>
              <text
                x="550"
                y="343"
                textAnchor="middle"
                fill="#1B54C7"
                fontSize="11"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                Control Signals
              </text>

              {/* Subtle CONTROL BUS Directional Marker */}
              <rect
                x="489"
                y="239.5"
                width="122"
                height="24"
                rx="12"
                fill="#FFFFFF"
                stroke={activeSection === 'controller' ? '#2868E8' : '#102A50'}
                strokeWidth="1.5"
                strokeOpacity={isControllerActive ? 0.85 : 0.45}
              />
              <path
                d="M 515 251.5 L 504 251.5 M 508 247.5 L 504 251.5 L 508 255.5"
                stroke={activeSection === 'controller' ? '#1B54C7' : '#102A50'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="521"
                y="255.5"
                textAnchor="start"
                fill={activeSection === 'controller' ? '#1B54C7' : '#102A50'}
                fontSize="11"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                CONTROL BUS
              </text>
            </g>
          </g>
        )}

        {/* --- LOWER BASE / SUBSTRATE PEDESTAL (Isometric Diamond) --- */}
        <g id="substrate">
          {/* Base bottom thickness */}
          <path
            d="M 250 380 L 440 270 L 440 286 L 250 396 L 60 286 L 60 270 Z"
            fill={`url(#${pedestalEdgeId})`}
          />
          {/* Base top face */}
          <path
            d="M 250 170 L 440 270 L 250 370 L 60 270 Z"
            fill={`url(#${pedestalTopId})`}
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
              filter={`url(#${glowFilterId})`}
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
              filter={`url(#${glowFilterId})`}
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
              filter={`url(#${glowFilterId})`}
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
              filter={`url(#${glowFilterId})`}
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
            fill={`url(#${chipEdgeId})`}
          />

          {/* Chip Top Silicon Die Face */}
          <path
            d="M 250 100 L 370 175 L 250 250 L 130 175 Z"
            fill={`url(#${chipNavyId})`}
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
                fill="#DBEAFE"
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
                fillOpacity={activeSection === 'datapath' || activeSection === 'both' ? '0.32' : '0.08'}
                stroke="#2868E8"
                strokeWidth={activeSection === 'datapath' ? '2.5' : '1'}
                className={reducedMotion ? undefined : 'transition-all duration-300'}
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
                fill="#DBEAFE"
                fontSize="8.5"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                ALU • Registers
              </text>

              {/* Right Domain: Controller */}
              <path
                d="M 250 115 L 350 175 L 250 235 Z"
                fill={activeSection === 'controller' || activeSection === 'both' ? '#2868E8' : '#102A50'}
                fillOpacity={activeSection === 'controller' || activeSection === 'both' ? '0.45' : '0.08'}
                stroke="#2868E8"
                strokeWidth={activeSection === 'controller' ? '2.5' : '1'}
                className={reducedMotion ? undefined : 'transition-all duration-300'}
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
                fill="#DBEAFE"
                fontSize="8.5"
                fontWeight="600"
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
                filter={`url(#${glowFilterId})`}
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

