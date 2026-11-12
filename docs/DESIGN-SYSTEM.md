# Design System Specification
## Data Path vs. Controller Architecture Presentation

### 1. Visual Direction & Reference Fidelity

The design system translates the bright Apple-Keynote presentation aesthetic into a responsive 16:9 interactive web deck:

- **Canvas:** Soft White (`#F8FAFF`) base accented by soft sky-blue organic corner waves (`#E6EFFF`, `#D6E5FF`) and left/right architectural motion-graphics rails.
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
| **Sky Tint Variants** | `#E6EFFF`, `#D6E5FF`, `#EBF2FF`, `#DBEAFE` | Corner waves, side-rail pill gradients, active register fills, light text on dark silicon dies |

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
| **Hero Display (Slide 01 / 07)** | `text-3xl sm:text-5xl xl:text-6xl` / `text-4xl sm:text-5xl lg:text-6xl` | `700` | Deck title & closing headline |
| **Slide Headline** | `text-2xl sm:text-4xl` (`lg:text-[34px]` on Slide 06) | `700` | Primary slide heading |
| **Supporting Subtitle** | `text-sm sm:text-lg` / `text-base sm:text-xl` | `400` | Single-line architectural statement |
| **Card / Section Heading** | `text-lg sm:text-xl` | `700` | Domain cards & mechanism headers |
| **SVG Schematic Text** | `8.5px`–`24px` SVG user units | `600`–`700` | Component blocks, bus signals, registers |
| **Micro Badges & Counters** | `10px`–`12px` (`font-mono`) | `600`–`700` | Slide index (`01 / 07`), `STAGE`, beat badges |

---

### 4. Responsive Shell, Framing & Side Motion Graphics

- **Root Viewport (`PresentationShell.tsx`):** `h-dvh min-h-dvh flex flex-col justify-between` (never rigid `h-screen`), allowing smooth scrolling inside `<main>` (`overflow-y-auto`) on viewports below `lg` (`< 1024px`) and crisp centered `lg:aspect-[16/9]` (`max-w-[1440px] lg:max-h-[810px]`) framing on desktop.
- **Stage Gutters & Card Alignment:**
  - `<main>` applies `px-4 sm:px-10 lg:px-20` horizontal clearance.
  - Each slide container applies `px-5 sm:px-14 lg:px-24 xl:px-28` around a unified `max-w-[1160px]` grid so left/right side rails never overlap content cards.
- **Side Motion Graphics (`AnimatedBackground.tsx`):**
  - Top-right organic sky-blue corner wave (`viewBox="0 0 480 340"`, `preserveAspectRatio="xMaxYMin meet"`) and bottom-left organic corner wave (`viewBox="0 0 520 300"`, `preserveAspectRatio="xMinYMax meet"`).
  - Left & right architectural circuit rails (`hidden lg:block`, `viewBox="0 0 150 800"`, `xMinYMid meet` / `xMaxYMid meet`, `w-[100px] xl:w-[116px] 2xl:w-[216px]`), never using `slice` cropping, featuring slide-tailored bus topologies, dual micro-chip modules, hexagonal & rotated diamond accents, pulsing nodes, and continuous packet pulses.

---

### 5. Interactive Controls & Native Top-Layer Modal

- **Header Chrome:**
  - `ProgressIndicator.tsx`: `01 / 07` index, `2px` accent bar, `>= 24×24px` (`min-w-6 min-h-6`) clickable slide dots (visible `sm+`), and multi-beat `STAGE` indicator dots.
  - `SlideNavigation.tsx`: Frosted `.glass-panel` pill housing Overview (`Grid`), Auto-Play (`Play`/`Pause`), Beat Reset (`RotateCcw` when `maxBeats > 1`), Previous/Next chevrons, and Fullscreen toggle.
- **Slide Overview Modal (`SlideOverview.tsx`):**
  - Built on native `<dialog>` opened via `dialogRef.current?.showModal()`.
  - Uses `closedby="any"` plus a progressive `pointerdown`/`pointerup` bounding-rect fallback for browsers without `closedBy` support.
  - Labeled via `aria-labelledby` linked to its `<h2>`, with native `overscroll-behavior: contain` scroll containment on `dialog:modal` and `dialog::backdrop`.
  - No redundant `role="dialog"`, `aria-modal`, or custom focus trap.

---

### 6. Slide Composition Summary

1. **Slide 01 (Welcome):** Balanced 2-column grid (`lg:col-span-6` typography & CTA + `lg:col-span-6` isometric CPU die).
2. **Slide 02 (Architecture Overview):** Three `items-stretch` equal-height cards (`Data Path`, `Unified Silicon Die`, `Controller`).
3. **Slide 03 (Data Path):** Equal-height `4 / 8` column split pairing Core Mechanisms bullets with the 5-stage `DataPathDiagram` (`5 + 3 = 8`) and dynamic beat badge.
4. **Slide 04 (Controller):** Equal-height `4 / 8` column split pairing Command Orchestration bullets with the 3-beat `ControllerDiagram` (`RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`, timing loop).
5. **Slide 05 (Key Differences):** Aligned `max-w-[1160px]` headline over equal-height `7 / 5` cards (`Comparison Table` + `Equilibrium in Architecture` scale with widened pan clearances around `DATA` / `CONTROL`).
6. **Slide 06 (Working Together):** Compact `max-w-[1160px]` master schematic (`InstructionCycle`) sized cleanly for `1280×720`+ without clipping, plus interactive 4-stage sequence buttons (`1. FETCH` through `4. WRITE BACK`).
7. **Slide 07 (Thank You):** Centered CPU mascot die, "Thank You!" / "Any Questions?", "Replay Presentation" button, and dual summary capsules.
