import React, { useId } from 'react';

interface AnimatedBackgroundProps {
  currentSlide: number;
}

const BLUE = '#2868E8';
const SOFT_BLUE_LIGHT = '#E6EFFF';
const SOFT_BLUE_MID = '#D6E5FF';

interface Point {
  x: number;
  y: number;
}

interface CornerAccentVariant {
  diamondT: number;
  arcOpacity: number;
  tileAOpacity: number;
  tileBOpacity: number;
  tileOffsetX: number;
  tileOffsetY: number;
  bottomRightOpacity: number;
}

const SLIDE_VARIANTS: readonly CornerAccentVariant[] = [
  { diamondT: 0.56, arcOpacity: 0.22, tileAOpacity: 0.72, tileBOpacity: 0.85, tileOffsetX: 0, tileOffsetY: 0, bottomRightOpacity: 0.48 },
  { diamondT: 0.64, arcOpacity: 0.24, tileAOpacity: 0.62, tileBOpacity: 0.78, tileOffsetX: 6, tileOffsetY: -4, bottomRightOpacity: 0.42 },
  { diamondT: 0.52, arcOpacity: 0.21, tileAOpacity: 0.76, tileBOpacity: 0.82, tileOffsetX: -4, tileOffsetY: 4, bottomRightOpacity: 0.52 },
  { diamondT: 0.60, arcOpacity: 0.23, tileAOpacity: 0.68, tileBOpacity: 0.88, tileOffsetX: 4, tileOffsetY: 2, bottomRightOpacity: 0.46 },
  { diamondT: 0.54, arcOpacity: 0.22, tileAOpacity: 0.74, tileBOpacity: 0.80, tileOffsetX: -2, tileOffsetY: -2, bottomRightOpacity: 0.50 },
  { diamondT: 0.62, arcOpacity: 0.24, tileAOpacity: 0.66, tileBOpacity: 0.84, tileOffsetX: 5, tileOffsetY: 3, bottomRightOpacity: 0.44 },
  { diamondT: 0.50, arcOpacity: 0.20, tileAOpacity: 0.70, tileBOpacity: 0.86, tileOffsetX: 0, tileOffsetY: -3, bottomRightOpacity: 0.54 },
];

const ARC_P0: Point = { x: 132, y: 2 };
const ARC_P1: Point = { x: 182, y: 108 };
const ARC_P2: Point = { x: 288, y: 178 };
const ARC_P3: Point = { x: 478, y: 198 };

function evaluateCubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  currentSlide,
}) => {
  const uid = useId().replace(/:/g, '');
  const variant = SLIDE_VARIANTS[currentSlide] ?? SLIDE_VARIANTS[0];
  const diamondPos = evaluateCubicBezier(
    ARC_P0,
    ARC_P1,
    ARC_P2,
    ARC_P3,
    variant.diamondT
  );
  const arcPath = `M ${ARC_P0.x} ${ARC_P0.y} C ${ARC_P1.x} ${ARC_P1.y} ${ARC_P2.x} ${ARC_P2.y} ${ARC_P3.x} ${ARC_P3.y}`;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Top-Right Static Soft Sky-Blue Organic Waves, Orbital Arc & Subtle Tiles */}
      <svg
        className="pointer-events-none absolute top-0 right-0 w-[250px] sm:w-[360px] lg:w-[440px] 2xl:w-[540px] h-auto"
        viewBox="0 0 480 340"
        preserveAspectRatio="xMaxYMin meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${uid}-top-wave-a`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SOFT_BLUE_LIGHT} stopOpacity="0.86" />
            <stop offset="55%" stopColor={SOFT_BLUE_MID} stopOpacity="0.62" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id={`${uid}-top-wave-b`} x1="15%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={SOFT_BLUE_MID} stopOpacity="0.68" />
            <stop offset="60%" stopColor={SOFT_BLUE_LIGHT} stopOpacity="0.45" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Layered organic sky-blue blobs */}
        <path
          d="M 150 0 C 195 72 260 120 350 132 C 415 140 452 175 480 225 L 480 0 Z"
          fill={`url(#${uid}-top-wave-b)`}
        />
        <path
          d="M 245 0 C 275 56 328 96 408 106 C 444 110 468 128 480 152 L 480 0 Z"
          fill={`url(#${uid}-top-wave-a)`}
        />

        {/* Delicate static orbital arc */}
        <path
          d={arcPath}
          stroke={BLUE}
          strokeOpacity={variant.arcOpacity}
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* Tiny static 45-deg diamond marker sitting cleanly along the orbital arc */}
        <g
          transform={`translate(${diamondPos.x.toFixed(2)}, ${diamondPos.y.toFixed(2)}) rotate(45)`}
        >
          <rect
            x="-3.5"
            y="-3.5"
            width="7"
            height="7"
            rx="1.5"
            fill={BLUE}
            fillOpacity={0.55}
            stroke="#F8FAFF"
            strokeWidth="1"
          />
        </g>

        {/* Two subtle translucent sky-blue rounded micro-square tiles */}
        <rect
          x={352 + variant.tileOffsetX}
          y={134 + variant.tileOffsetY}
          width="24"
          height="24"
          rx="6"
          fill={SOFT_BLUE_MID}
          fillOpacity={variant.tileAOpacity}
        />
        <rect
          x={384 + variant.tileOffsetX}
          y={164 + variant.tileOffsetY}
          width="18"
          height="18"
          rx="6"
          fill={SOFT_BLUE_LIGHT}
          fillOpacity={variant.tileBOpacity}
        />
      </svg>

      {/* Bottom-Left Static Soft Sky-Blue Organic Sweep & Hairline Arc Echo */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-[260px] sm:w-[380px] lg:w-[480px] 2xl:w-[580px] h-auto"
        viewBox="0 0 520 300"
        preserveAspectRatio="xMinYMax meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${uid}-bot-wave-a`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.2" />
            <stop offset="55%" stopColor={SOFT_BLUE_MID} stopOpacity="0.72" />
            <stop offset="100%" stopColor={SOFT_BLUE_LIGHT} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-bot-wave-b`} x1="0%" y1="100%" x2="85%" y2="10%">
            <stop offset="0%" stopColor={SOFT_BLUE_MID} stopOpacity="0.82" />
            <stop offset="100%" stopColor={SOFT_BLUE_LIGHT} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d="M 0 110 C 68 128 136 168 205 224 C 254 264 316 286 392 300 L 0 300 Z"
          fill={`url(#${uid}-bot-wave-b)`}
        />
        <path
          d="M 0 176 C 72 184 140 218 206 266 C 232 284 262 294 294 300 L 0 300 Z"
          fill={`url(#${uid}-bot-wave-a)`}
        />
        <path
          d="M 2 142 C 98 160 184 210 264 298"
          stroke={BLUE}
          strokeOpacity="0.18"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Bottom-Right Subtle Outer Corner Whisper Accent */}
      <svg
        className="pointer-events-none absolute bottom-0 right-0 w-[140px] sm:w-[190px] lg:w-[220px] 2xl:w-[270px] h-auto"
        viewBox="0 0 280 180"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: variant.bottomRightOpacity }}
      >
        <defs>
          <linearGradient id={`${uid}-br-whisper`} x1="100%" y1="100%" x2="15%" y2="15%">
            <stop offset="0%" stopColor={SOFT_BLUE_MID} stopOpacity="0.85" />
            <stop offset="55%" stopColor={SOFT_BLUE_LIGHT} stopOpacity="0.48" />
            <stop offset="100%" stopColor={SOFT_BLUE_LIGHT} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 105 180 C 158 164 206 132 246 84 C 261 65 272 44 280 22 L 280 180 Z"
          fill={`url(#${uid}-br-whisper)`}
        />
        <path
          d="M 142 178 C 194 156 236 122 278 68"
          stroke={BLUE}
          strokeOpacity="0.16"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
