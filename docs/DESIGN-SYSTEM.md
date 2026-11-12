# Design System Specification
## Data Path vs. Controller Architecture Presentation

### 1. Visual Direction & Reference Fidelity

The design system translates the bright Apple-Keynote presentation aesthetic into a responsive 16:9 interactive web deck:

- **Canvas:** Soft White (`#F8FAFF`) base accented by calm, static minimal Keynote corner artwork (`#E6EFFF`, `#D6E5FF`, and translucent `#2868E8` hairlines/micro-tiles).
- **Typography:** Deep Navy (`#102A50`) for headlines and academic clarity, accented by Electric Blue (`#2868E8`) on large display elements and Dark Electric Blue (`#1B54C7`) for WCAG AA small text legibility.
- **Surfaces:** Pure White (`#FFFFFF`) elevated cards with `1px` translucent electric-blue strokes (`rgba(40, 104, 232, 0.2)` / `0.12`) and subtle ambient shadows.
- **Hardware Schematics:** Crisp orthogonal and 2.5D isometric SVG diagrams representing silicon dies, registers, ALUs, decoders, and buses.

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

### 3. Typography Hierarchy

Loaded via Google Fonts in `index.html`:
- **Display & Headings (`--font-display`):** `Space Grotesk`, sans-serif (Weights: `500`, `600`, `700`)
- **UI & Body (`--font-sans`):** `Inter`, sans-serif (Weights: `400`, `500`, `600`, `700`)
- **Technical Tokens (`--font-mono`):** `JetBrains Mono`, monospace (Weights: `500`, `600`)

| Level | Scale / Classes | Weight | Application |
|---|---|---|---|
| **Hero Display (Slide 01 / 07)** | `text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] 2xl:text-[72px]` / `text-4xl sm:text-5xl lg:text-6xl xl:text-[66px] 2xl:text-[74px]` | `700` | Deck title & closing headline |
| **Slide Headline** | `text-2xl sm:text-4xl xl:text-[40px] 2xl:text-[46px]` (`lg:text-[34px] xl:text-[38px] 2xl:text-[44px]` on Slide 06) | `700` | Primary slide heading |
| **Supporting Subtitle** | `text-base sm:text-xl xl:text-[22px] 2xl:text-2xl` (Slide 01), `text-sm sm:text-lg xl:text-xl` (Slides 02–05), `text-sm sm:text-base xl:text-lg` (Slide 06), `text-lg sm:text-2xl xl:text-[26px]` (Slide 07) | `400` | Single-line architectural statement |
| **Card / Section Heading** | `text-lg sm:text-xl xl:text-[22px] 2xl:text-2xl` (Slide 02), `text-lg sm:text-xl xl:text-[22px]` (Slides 03–04), `text-base sm:text-lg xl:text-xl` (Slide 05) | `700` | Domain cards & mechanism headers |
| **SVG Schematic Text** | `8.5px`–`24px` SVG user units | `600`–`700` | Component blocks, bus signals, registers |
| **Micro Badges & Counters** | `10px`–`15px` (`font-mono`) | `600`–`700` | Slide index (`01 / 07`), in-slide stage pills (`Stage 1 / 4`), beat badges, chips |

---

### 4. Responsive Shell, Framing & Calm Corner Artwork

- **Root Viewport (`PresentationShell.tsx`):** `h-dvh min-h-dvh flex flex-col justify-between` (never rigid `h-screen`), allowing smooth scrolling inside `<main>` (`overflow-y-auto overflow-x-hidden lg:overflow-hidden`) on viewports below `lg` (`< 1024px`) and centered stage framing on desktop (`max-w-[1680px] lg:max-h-[960px]`, without locking `1920×1080` down to `1440×810` via `aspect-[16/9]`).
- **Stage Gutters & Card Alignment:**
  - `<main>` applies `px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-3` clearance around the `max-w-[1680px] lg:max-h-[960px]` stage shell.
  - Each slide container applies `px-4 sm:px-8 lg:px-8 xl:px-10 py-2 lg:py-3` (`py-1.5 lg:py-2 2xl:py-4` on Slide 06) around a unified `max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px]` stage grid, preserving generous whitespace from corner graphics and `720px`-height safety at `1280×720` (`xl:`) while scaling cards and schematics proportionally at `1440×810` and `1920×1080`.
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

### 6. Slide Composition Summary

1. **Slide 01 (Welcome):** Balanced 2-column grid (`lg:col-span-6` scaled typography & CTA + `lg:col-span-6` isometric CPU die up to `2xl:max-w-[650px]`).
2. **Slide 02 (Architecture Overview):** Three `items-stretch` equal-height cards (`Data Path`, `Unified Silicon Die` with split CPU up to `2xl:max-w-[430px]`, `Controller`).
3. **Slide 03 (Data Path):** Equal-height `4 / 8` column split pairing Core Mechanisms bullets with the 5-stage `DataPathDiagram` (`5 + 3 = 8`) and dynamic beat badge.
4. **Slide 04 (Controller):** Equal-height `4 / 8` column split pairing Command Orchestration bullets with the 3-beat `ControllerDiagram` (`RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`, timing loop).
5. **Slide 05 (Key Differences):** Aligned `max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px]` headline over equal-height `7 / 5` cards (`Comparison Table` + `Equilibrium in Architecture` scale up to `2xl:max-w-[380px]` with widened pan clearances around `DATA` / `CONTROL`).
6. **Slide 06 (Working Together):** Compact `max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1500px]` master schematic (`InstructionCycle`) with height-responsive SVG (`max-h-[min(365px,54dvh)] xl:max-h-[min(455px,56dvh)] 2xl:max-h-[min(560px,58dvh)]`) sized cleanly for `1280×720`+ without clipping while expanding across `1440×810` and `1920×1080`, plus interactive 4-stage sequence buttons (`1. FETCH` through `4. WRITE BACK`).
7. **Slide 07 (Thank You):** Centered CPU mascot die (`w-[200px] sm:w-[270px] lg:w-[310px] xl:w-[340px] 2xl:w-[400px]`), "Thank You!" / "Any Questions?", "Replay Presentation" button, and dual summary capsules.
