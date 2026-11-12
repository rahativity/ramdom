# Data Path vs. Controller Architecture
### Premium Animated Technical Presentation Website

A high-quality, animated, interactive technical presentation website explaining **Data Path vs. Controller Architecture** in modern computer systems.

Built with a presentation-first 16:9 viewport layout, editorial typography, and high-precision SVG hardware schematics, combining the clean aesthetics of Apple Keynote with the motion and storytelling quality of a modern product website.

---

## 🎨 Visual Identity & Reference Fidelity

This project translates the visual language of the presentation deck reference:
- **Strict 3-Color Palette:** Deep Navy (`#102A50`), Electric Blue (`#2868E8`), and Soft White (`#F8FAFF`).
- **Typography:** Space Grotesk (Display & Headings), Inter (Technical labels and body), JetBrains Mono (Bus data and registers).
- **Minimal On-Screen Text:** One headline per slide, single supporting phrase, zero decorative filler text or intrusive keyboard instructions.
- **Hardware Diagrams:** Precision vector illustrations representing CPU dies, registers, ALUs, decoders, and control buses with isometric and orthogonal clarity.

---

## 📑 Exactly Seven Slides

1. **Slide 01 — Welcome:** Editorial headline, 2.5D isometric CPU chip on a glowing pedestal with circuit traces, and interactive "Let's Explore" button.
2. **Slide 02 — Architecture Overview:** Dual domain cards with a split CPU die showcasing the cooperative boundary between Data Path and Controller.
3. **Slide 03 — Data Path:** Complete vector datapath pipeline showing data packet flow for `5 + 3 = 8` (`Input → Registers → ALU → Destination Register → Output`).
4. **Slide 04 — Controller:** Opcode decoder, state machine, and radiating control signal buses (`RegRead`, `ALUOp`, `RegWrite`) with feedback timing loops.
5. **Slide 05 — Key Differences:** High-contrast comparison table with custom hardware icons and an animated digital balance scale illustrating architectural equilibrium.
6. **Slide 06 — Working Together (Centerpiece):** Coordinated execution of instruction `ADD R1, R2, R3` across 4 interactive stages:
   - **FETCH:** Instruction latched into Instruction Register.
   - **DECODE:** Controller decodes opcode, primes `RegRead=1` and `ALUOp=ADD`.
   - **EXECUTE:** Operands (5, 3) flow into ALU, result calculated (`5 + 3 = 8`).
   - **WRITE BACK:** Result `8` travels via the Write-Back Bus into register R1.
7. **Slide 07 — Thank You!:** Polished closing slide featuring the smiling mascot CPU die and presentation replay controls.

---

## 🕹️ Controls & Navigation

- **Advance Slide / Beat:** `ArrowRight`, `Space`, or Next button.
- **Previous Slide / Beat:** `ArrowLeft` or Previous button.
- **Jump to Start / End:** `Home` (Slide 1), `End` (Slide 7).
- **Slide Overview Grid:** `KeyO` or Top Header Grid icon.
- **Fullscreen Mode:** `KeyF` or Header Fullscreen icon.
- **Auto-Play Mode:** Header Play/Pause toggle (automatically steps through animation stages).
- **Silent Operation:** All keyboard shortcuts operate silently with zero on-screen instructional clutter.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Tooling:** Vite + Tailwind CSS v4
- **Animation Orchestration:** GSAP 3 (`gsap`, `@gsap/react`) for master timelines, transitions, and SVG bus interpolation; Motion (`motion`) for component mounts.
- **Icons:** Lucide React
- **Testing & QA:** Puppeteer visual regression and console verification suite.

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

### Production Build & Preview
```bash
npm run build
npm run preview
```

### Automated Visual QA Suite
```bash
node scripts/test-presentation.mjs
```

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── presentation/
│   │   ├── PresentationShell.tsx     # 16:9 canvas shell with organic blue glow
│   │   ├── SlideRenderer.tsx         # Slide transition orchestrator
│   │   ├── SlideNavigation.tsx       # Minimalist presentation controls
│   │   ├── ProgressIndicator.tsx     # Discrete 01 / 07 indicator and stage dots
│   │   └── SlideOverview.tsx         # Full-deck modal grid selector
│   ├── diagrams/
│   │   ├── CPUArchitecture.tsx       # 2.5D Isometric CPU die (Hero / Split / Mascot)
│   │   ├── DataPathDiagram.tsx       # 5-stage animated datapath (5 + 3 = 8)
│   │   ├── ControllerDiagram.tsx     # Decoder, state machine & signal bus propagation
│   │   └── InstructionCycle.tsx      # Master coordinated ADD R1, R2, R3 schematic
│   └── ui/
│       └── IconButton.tsx            # Clean accessible icon button
├── slides/
│   ├── Slide01Welcome.tsx
│   ├── Slide02Overview.tsx
│   ├── Slide03DataPath.tsx
│   ├── Slide04Controller.tsx
│   ├── Slide05Comparison.tsx
│   ├── Slide06WorkingTogether.tsx
│   └── Slide07ThankYou.tsx
├── animations/
│   ├── transitions.ts                # GSAP slide transition manager
│   └── motionConfig.ts               # Centralized motion constants & slide metadata
├── hooks/
│   └── usePresentation.ts            # Presentation state, stage beats & keyboard listeners
├── types/
│   └── presentation.ts               # Core type definitions
├── index.css                         # Tailwind CSS v4 design tokens
├── App.tsx
└── main.tsx

docs/
├── DESIGN-SYSTEM.md                  # Comprehensive visual design system & color tokens
├── MOTION-SPEC.md                    # Choreography, transition mapping & reduced-motion rules
├── QA-REPORT.md                      # Complete testing audit with 0-error verification
└── screenshots/                      # High-resolution visual captures of all 7 slides
```
