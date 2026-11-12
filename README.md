# Data Path vs. Controller Architecture
### Animated Technical Presentation Website

An animated, interactive 7-slide technical presentation website explaining **Data Path vs. Controller Architecture** in modern computer processors.

Built with a responsive 16:9 stage layout, editorial typography, side architectural motion graphics, and precision SVG hardware schematics combining Apple Keynote clarity with GSAP-orchestrated CPU datapath and control-signal execution flows.

---

## 🎨 Visual Identity & Accessibility

- **Cohesive Light Palette:**
  - Deep Navy (`#102A50`) for headlines, dark silicon dies, and primary copy
  - Electric Blue (`#2868E8`) for active data/control buses, accents, and highlights
  - Dark Electric Blue (`#1B54C7`) for small labels, badges, and interactive text (`>= 5.6:1` WCAG 2.1 AA contrast)
  - Soft White (`#F8FAFF`) canvas with `#FFFFFF` cards and soft sky-blue corner waves (`#E6EFFF` / `#D6E5FF`)
- **Typography:** Space Grotesk (Display & Headings), Inter (Body & UI), JetBrains Mono (Registers, opcodes, and bus readouts).
- **Side Motion Graphics:** Left and right architectural circuit rails (`AnimatedBackground.tsx`) with slide-themed bus geometries, micro-chip modules, pulsing junction nodes, and GSAP `MotionPathPlugin` packet flows on desktop (`lg+`).
- **Accessible Interactive UI:**
  - Native top-layer `<dialog>` Slide Overview (`showModal()`, `closedby="any"` + pointer boundary fallback, `overscroll-behavior: contain`)
  - Live `prefers-reduced-motion: reduce` subscription (`useReducedMotion`) pausing auto-play and infinite loops while snapping content cleanly to `opacity: 1`
  - Accessible `>= 24×24px` slide-dot hit targets and `#1B54C7` `:focus-visible` outlines

---

## 📑 Seven Slides

1. **Slide 01 — Welcome:** Editorial headline, 2.5D isometric CPU chip on a glowing substrate pedestal, topic highlight pills, and "Let's Explore" CTA.
2. **Slide 02 — Architecture Overview:** Equal-height Data Path and Controller domain cards flanking a unified split CPU die with interactive plane highlighting (`both` / `datapath` / `controller`).
3. **Slide 03 — Data Path:** Equal-height educational mechanism panel paired with a 5-stage animated vector pipeline (`Input → Registers R2, R3 → ALU → Register R1 → Output`) illustrating `5 + 3 = 8` across 4 beats.
4. **Slide 04 — Controller:** Equal-height command orchestration panel paired with a 3-beat decoder, state-machine Control Unit, radiating control signals (`RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`), and timing feedback loop.
5. **Slide 05 — Key Differences:** Aligned headline and equal-height comparison table paired with an animated equilibrium balance scale and takeaway (*"Data Path performs. Controller coordinates."*).
6. **Slide 06 — Working Together:** Master coordinated CPU schematic executing `ADD R1, R2, R3` (`R2=5, R3=3 → R1=8`) across 4 interactive beats (`1. FETCH`, `2. DECODE`, `3. EXECUTE`, `4. WRITE BACK`).
7. **Slide 07 — Thank You!:** Smiling CPU mascot die, closing subtitle, "Replay Presentation" control, and summary capsules.

---

## 🕹️ Controls & Navigation

- **Advance Beat / Slide:** `ArrowRight`, `Space`, or Next button (guarded when Slide Overview is open)
- **Previous Beat / Slide:** `ArrowLeft` or Previous button (guarded when Slide Overview is open)
- **Jump to Start / End:** `Home` (Slide 01), `End` (Slide 07) (guarded when Slide Overview is open)
- **Slide Overview Modal:** `KeyO` or top-right Grid icon (`Escape`, close button, thumbnail click, or backdrop click dismisses)
- **Fullscreen Mode:** `KeyF` (guarded when Slide Overview is open) or top-right Fullscreen icon; `Escape` exits fullscreen
- **Auto-Play & Replay:** Top-right Play/Pause auto-animation toggle (automatically paused when `prefers-reduced-motion: reduce`) and beat Replay button on multi-beat slides

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript (`tsc -b`)
- **Build & Styling:** Vite 8 + Tailwind CSS v4
- **Animation & Icons:** GSAP 3 (`gsap` + `gsap/MotionPathPlugin`), `lucide-react`, `clsx`
- **Linting & Verification:** `oxlint`, TypeScript (`--noEmit`), Puppeteer headless Chrome QA suite (`scripts/test-presentation.mjs`)

> **Note on Preserved Starter / Unused Assets:** `package.json` includes unused dependencies (`@gsap/react`, `motion`, `canvas-confetti`, `@types/canvas-confetti`, `tailwind-merge`), and Vite starter files (`src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/favicon.svg`, `public/icons.svg`) remain in the workspace untouched.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Lint, Typecheck & Production Build
```bash
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.node.json --noEmit
npm run build
npm run preview
```

### Automated Visual & Layout QA Suite
Builds/serves `dist/` on an isolated preview port (`4174` by default) and runs screenshot capture + DOM/layout/accessibility assertions:
```bash
node scripts/test-presentation.mjs
```

---

## 📂 Project Structure

```text
src/
├── animations/
│   ├── motionConfig.ts               # Slide metadata, beat counts, and motion constants
│   └── transitions.ts                # GSAP slide transition orchestrator
├── components/
│   ├── diagrams/
│   │   ├── CPUArchitecture.tsx       # 2.5D Isometric CPU die (Hero / Split / Mascot)
│   │   ├── DataPathDiagram.tsx       # 5-stage animated datapath (5 + 3 = 8)
│   │   ├── ControllerDiagram.tsx     # Decoder, Control Unit & signal dispatch
│   │   └── InstructionCycle.tsx      # Master coordinated ADD R1, R2, R3 schematic
│   ├── presentation/
│   │   ├── AnimatedBackground.tsx    # Organic corner waves + desktop left/right circuit rails
│   │   ├── PresentationShell.tsx     # Responsive 16:9 stage shell & header chrome
│   │   ├── SlideRenderer.tsx         # Slide transition & reduced-motion wrapper
│   │   ├── SlideNavigation.tsx       # Presentation playback & modal controls
│   │   ├── ProgressIndicator.tsx     # 01 / 07 index, >=24px slide dots, and beat stages
│   │   └── SlideOverview.tsx         # Native top-layer <dialog> slide index modal
│   └── ui/
│       └── IconButton.tsx            # Accessible circular icon control
├── hooks/
│   ├── usePresentation.ts            # Slide/beat state, fullscreen & guarded shortcuts
│   └── useReducedMotion.ts           # Live prefers-reduced-motion media query hook
├── slides/
│   ├── Slide01Welcome.tsx
│   ├── Slide02Overview.tsx
│   ├── Slide03DataPath.tsx
│   ├── Slide04Controller.tsx
│   ├── Slide05Comparison.tsx
│   ├── Slide06WorkingTogether.tsx
│   └── Slide07ThankYou.tsx
├── types/
│   └── presentation.ts               # Shared TypeScript presentation interfaces
├── index.css                         # Tailwind v4 theme tokens, focus ring & <dialog> CSS
├── App.tsx                           # Auto-play scheduler & presentation root
└── main.tsx

docs/
├── DESIGN-SYSTEM.md                  # Color tokens, WCAG contrast ratios & grid framing
├── MOTION-SPEC.md                    # GSAP choreography, controls & reduced-motion spec
├── QA-REPORT.md                      # Build, multi-viewport, modal & screenshot QA audit
└── screenshots/                      # 1440×810 (2x) captures of all 7 slides + modal
```
