# Design System Specification
## Data Path vs. Controller Architecture Presentation

### 1. Visual Direction & Reference Fidelity

The design system translates a bright Apple-Keynote presentation aesthetic into a responsive full-screen interactive web deck:

- **Canvas:** Soft White (`#F8FAFF`) base accented by calm, static minimal Keynote corner artwork (`#E6EFFF`, `#D6E5FF`, and translucent `#2868E8` hairlines/micro-tiles).
- **Typography:** Deep Navy (`#102A50`) for headlines and academic clarity, accented by Electric Blue (`#2868E8`) on large display elements and Dark Electric Blue (`#1B54C7`) for WCAG AA small text legibility, scaled seamlessly via fluid `clamp()` tokens (`max <= 2.5× min`).
- **Surfaces:** Pure White (`#FFFFFF`) elevated cards with `1px` translucent electric-blue strokes (`rgba(40, 104, 232, 0.2)` / `0.12`) and subtle ambient shadows.
- **Hardware Schematics:** Crisp orthogonal and 2.5D isometric SVG diagrams representing silicon dies, registers, ALUs, decoders, and buses that flex to fill the full-screen canvas with `preserveAspectRatio="xMidYMid meet"`.

---

### 2. Color Palette & WCAG 2.1 AA Contrast Verification

| Token Name | Hex / Value | Primary Usage |
|---|---|---|
| **Deep Navy** | `#102A50` | Primary headlines, dark silicon dies (CPU, ALU, Control Unit), table headers, base text |
| **Electric Blue** | `#2868E8` | Large display highlights (`Architecture`), active buses, packet pulses, primary icon fills, borders |
| **Dark Electric Blue** | `#1B54C7` | Small labels, category tags, monospace badges, `:focus-visible` outline (`2px solid #1B54C7`) |
| **Soft White** | `#F8FAFF` | Canvas base, `<dialog>` surface, inactive diagram blocks |
| **Card White** | `#FFFFFF` | Elevated content cards, diagram containers, CTA pills |
| **Sky Tint Variants** | `#E6EFFF`, `#D6E5FF`, `#EBF2FF`, `#DBEAFE` | Corner waves, translucent corner tiles, active register fills, light text on dark silicon dies |

#### Verified Contrast Ratios (Observed)

| Foreground / Background Pair | Contrast Ratio | WCAG 2.1 AA Status |
|---|---|---|
| `#1B54C7` on `#FFFFFF` | `6.69:1` | Pass (Normal & Small Text) |
| `#1B54C7` on `#F8FAFF` | `6.41:1` | Pass (Normal & Small Text) |
| `#1B54C7` on `#2868E8/10` over `#FFFFFF` | `5.85:1` | Pass (Small Badges/Pills) |
| `#1B54C7` on `#2868E8/10` over `#F8FAFF` | `5.60:1` | Pass (Small Badges/Pills) |
| `#1B54C7` on `#EBF2FF` | `5.95:1` | Pass (Active Register Labels) |
| `#102A50/75` on `#FFFFFF` | `6.49:1` | Pass (Subtitles & Annotations) |
| `#102A50/75` on `#F8FAFF` | `6.32:1` | Pass (Subtitles & Annotations) |
| `#102A50/70` on `#FFFFFF` | `5.50:1` | Pass (Index Counter Slash) |
| `#102A50/72` on `#F8FAFF` | `5.76:1` | Pass (Standby Diagram Values) |
| `#DBEAFE` on `#102A50` / `#1E3E6F` | `11.72:1` / `8.72:1` | Pass (Labels inside Dark Dies) |
| `#FFFFFF` on `#2868E8` | `4.96:1` | Pass (Active Button & Register Highlight) |
| `#FFFFFF` on `#1B54C7` | `6.69:1` | Pass (Overview Modal Active Pill) |

---

### 3. Fluid `clamp()` Typography Hierarchy

Loaded via Google Fonts in `index.html` (all `clamp()` scales maintain `max <= 2.5× min` with no fixed `px` height constraints on text containers):
- **Display & Headings (`--font-display`):** `Space Grotesk`, sans-serif (Weights: `500`, `600`, `700`)
- **UI & Body (`--font-sans`):** `Inter`, sans-serif (Weights: `400`, `500`, `600`, `700`)
- **Technical Tokens (`--font-mono`):** `JetBrains Mono`, monospace (Weights: `500`, `600`)

| Level | Fluid `clamp()` Token | Max / Min Ratio | Weight | Application |
|---|---|---|---|---|
| **Hero Display (Slide 01 / 07)** | `clamp(2.35rem,3.6vw+0.8rem,5.5rem)` / `clamp(2.5rem,4vw+0.8rem,5.75rem)` | `2.34×` / `2.30×` | `700` | Deck title & closing headline |
| **Slide Headline (Slides 02–05)** | `clamp(1.65rem,2.3vw+0.65rem,3.25rem)` | `1.97×` | `700` | Primary slide heading |
| **Slide Headline (Slide 06)** | `clamp(1.5rem,2vw+0.6rem,2.8rem)` | `1.87×` | `700` | Compact header for master diagram |
| **Supporting Subtitle** | `clamp(1rem,1.15vw+0.55rem,1.75rem)` (S01), `clamp(0.95rem,0.85vw+0.5rem,1.4rem)` (S02–05), `clamp(0.9rem,0.75vw+0.5rem,1.25rem)` (S06), `clamp(1.15rem,1.3vw+0.55rem,2rem)` (S07) | `1.39×`–`1.75×` | `400`–`500` | Architectural thesis & closing prompt |
| **Card / Section Heading** | `clamp(1.15rem,1.1vw+0.55rem,1.75rem)` (S02), `clamp(1.15rem,1.1vw+0.55rem,1.7rem)` (S03–04), `clamp(1.05rem,0.9vw+0.6rem,1.65rem)` (S05), `clamp(1rem,0.85vw+0.55rem,1.45rem)` (S05 table header) | `1.45×`–`1.57×` | `700` | Domain cards, mechanism headers & table header |
| **Body Bullets & Table Rows** | `clamp(0.95rem,0.95vw+0.45rem,1.45rem)` (S02), `clamp(0.92rem,0.9vw+0.45rem,1.38rem)` (S03–04), `clamp(0.88rem,0.8vw+0.48rem,1.32rem)` (S05), `clamp(0.95rem,0.85vw+0.5rem,1.35rem)` (S05 takeaway) | `1.42×`–`1.53×` | `400`–`700` | Card bullets, comparison cells & takeaway callout |
| **Interactive CTA & Stage Strip** | `clamp(0.95rem,0.7vw+0.6rem,1.3rem)` (S01 CTA), `clamp(0.95rem,0.7vw+0.6rem,1.25rem)` (S07 Replay), `clamp(0.75rem,0.55vw+0.48rem,1.05rem)` / `clamp(0.72rem,0.5vw+0.45rem,0.98rem)` (S06 stage strip) | `1.32×`–`1.40×` | `600`–`700` | Action buttons & `min-h-[44px]` stage strip controls |
| **Micro Badges, Domain Bars & Footers** | `clamp(0.68rem,0.42vw+0.45rem,0.88rem)` to `clamp(0.8rem,0.55vw+0.5rem,1.08rem)` (`font-mono`) | `1.28×`–`1.40×` | `500`–`700` | Eyebrows, formula pill, domain bars, stage pills, topic chips |
| **SVG Schematic Text** | `8.5px`–`24px` SVG user units | N/A (vector-scaled) | `600`–`700` | Component blocks, bus signals, registers |

---

### 4. Full-Screen Shell, Stage Stretching & Calm Corner Artwork

- **Root Viewport (`PresentationShell.tsx`):** `h-dvh min-h-dvh flex flex-col justify-between overflow-hidden` (never rigid `h-screen`), pairing a compact single-row `<header>` (`px-4 sm:px-6 lg:px-8 xl:px-10 pt-2 sm:pt-2.5 pb-1 shrink-0`) with a full-screen `<main>` stage (`flex-1 min-h-0 w-full flex items-start lg:items-stretch justify-center px-3 sm:px-5 lg:px-6 xl:px-8 pt-1 pb-2.5 sm:pb-3 lg:pb-4 overflow-y-auto overflow-x-hidden lg:overflow-hidden`).
- **Full-Screen Stage Shell (`[data-stage-shell="fullscreen"]`):**
  - All `max-w-[1680px]`, `lg:max-h-[960px]`, `max-w-[1260px]`, `xl:max-w-[1360px]`, and `2xl:max-w-[1500px]` caps were removed.
  - `[data-stage-shell="fullscreen"]` applies `relative w-full h-full min-h-full lg:min-h-0 flex items-stretch justify-center`, and `SlideRenderer.tsx` spans `w-full min-h-full lg:h-full relative flex items-stretch justify-center overflow-x-hidden lg:overflow-hidden`.
  - Desktop slides fill **95.0%–96.7%** of viewport width (`1216px` at `1280`, `1376px` at `1440`, `1856px` at `1920`) and **97.0%–98.0%** of `<main>` height with zero horizontal or vertical clipping, while `<1024px` viewports fall back cleanly to `justify-start` and vertical scrolling inside `<main>`.
- **Calm Corner Artwork (`AnimatedBackground.tsx`, 100% Static):**
  - `aria-hidden="true"`, `pointer-events-none`, zero GSAP/CSS side-rail loops, and `preserveAspectRatio` ending in `meet` (never `slice`).
  - **Top-Right (`viewBox="0 0 480 340"`, `xMaxYMin meet`):** Layered soft sky-blue organic waves (`#E6EFFF` / `#D6E5FF` fading into `#2868E8` ~0.22), thin orbital Bezier arc (`#2868E8`, ~0.20–0.24) with one static 45° diamond marker (`7×7`, `rx="1.5"`), and two translucent rounded micro-square tiles (`rx="6"`).
  - **Bottom-Left (`viewBox="0 0 520 300"`, `xMinYMax meet`):** Soft curved sky-blue layered sweep wave and delicate hairline arc echo.
  - **Bottom-Right (`viewBox="0 0 280 180"`, `xMaxYMax meet`):** Quiet outer corner whisper accent with subtle per-slide emphasis variation (`opacity: 0.42–0.54`).

---

### 5. Interactive Controls & Native Top-Layer Modal

- **Header Chrome:**
  - `ProgressIndicator.tsx`: Minimal `01 / 07` numeric index paired with the thin horizontal `#2868E8` accent bar (`w-8 sm:w-10 md:w-12 h-[2px] rounded-full`), with zero top-bar slide dots and zero top-bar `STAGE` dot circles (multi-beat stage indicators remain inside Slide 03 and Slide 04 cards).
  - `SlideNavigation.tsx`: Frosted `.glass-panel` pill housing `32×32px` (`>= 24×24px`) `IconButton` controls for Overview (`Grid`), Auto-Play (`Play`/`Pause`), Beat Reset (`RotateCcw` when `maxBeats > 1`), Previous/Next chevrons, and Fullscreen toggle.
- **Slide Overview Modal (`SlideOverview.tsx`):**
  - Built on native `<dialog>` opened via `dialogRef.current?.showModal()`.
  - Uses `closedby="any"` plus a progressive `pointerdown`/`pointerup` bounding-rect fallback for browsers without `closedBy` support.
  - Labeled via `aria-labelledby` linked to its `<h2>`, with native `overscroll-behavior: contain` scroll containment on `dialog:modal` and `dialog::backdrop`.
  - No redundant `role="dialog"`, `aria-modal`, or custom focus trap.

---

### 6. Full-Screen Slide Composition Summary

1. **Slide 01 (Welcome):** Full-width 12-column hero (`lg:col-span-6` fluid typography, CTA & highlight pills + `lg:col-span-6` isometric `CPUArchitecture` `hero` die with `lg:h-full lg:max-h-[min(76dvh,780px)]`).
2. **Slide 02 (Architecture Overview):** Three `lg:flex-1 lg:min-h-0 items-stretch` equal-height cards (`Data Path`, `Unified Silicon Die` with `flex-1 min-h-0` split CPU, `Controller`) filling `80.5%–85.5%` of `<main>` height.
3. **Slide 03 (Data Path):** Equal-height `4 / 8` column split (`lg:flex-1 lg:min-h-0`) pairing Core Mechanisms bullets with `DataPathDiagram` (`block w-full h-auto lg:flex-1 lg:min-h-0 lg:h-full`, `5 + 3 = 8`) and discrete bottom technical annotation.
4. **Slide 04 (Controller):** Equal-height `4 / 8` column split (`lg:flex-1 lg:min-h-0`) pairing Command Orchestration bullets with `ControllerDiagram` (`block w-full h-auto lg:flex-1 lg:min-h-0 lg:h-full`, `RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`, timing loop).
5. **Slide 05 (Key Differences):** Full-width headline aligned identically with `lg:flex-1 lg:min-h-0` `7 / 5` cards (`Comparison Table` with evenly stretched `lg:flex-1 min-h-[44px]` rows + `Equilibrium in Architecture` balance scale SVG `lg:flex-1 lg:min-h-0 lg:h-full max-w-[340px] sm:max-w-[400px] lg:max-w-[520px] max-h-[44dvh]`).
6. **Slide 06 (Working Together):** Full-stage `InstructionCycle` container (`lg:flex-1 lg:min-h-0`) with fluid domain headers, flex-stretched `<svg>` (`block w-full h-auto lg:flex-1 lg:min-h-0 lg:h-full`) scaling seamlessly from `1168×403` (`1280×720`) to `1808×738` (`1920×1080`) with zero rigid `max-h-[min(...)]` caps, plus `min-h-[44px]` 4-stage interactive strip (`1. FETCH` through `4. WRITE BACK`).
7. **Slide 07 (Thank You):** Centered CPU mascot (`w-[clamp(210px,22vw,420px)] max-h-[38dvh]`), fluid `clamp()` "Thank You!" / "Any Questions?" typography, non-fixed-height "Replay Presentation" button (`px-8 py-4`), and dual summary capsules.
