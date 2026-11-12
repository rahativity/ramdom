# Quality Assurance & Verification Report
## Data Path vs. Controller Architecture Presentation Website

### 1. Executive Summary

- **Project:** `/home/rahat/yes` — 7-slide animated CSE presentation (*Data Path vs. Controller Architecture*)
- **Linter (`npm run lint` / `oxlint`):** **PASS** — `0` warnings, `0` errors across `27` files (`116` rules)
- **TypeScript (`tsc -p tsconfig.app.json --noEmit` & `tsc -p tsconfig.node.json --noEmit`):** **PASS** — `0` errors
- **Production Build (`npm run build` / `tsc -b && vite build`):** **PASS** — `2108` modules transformed (`dist/index.html` `1.16 kB`, `dist/assets/index-YNHAyPsA.css` `42.34 kB`, `dist/assets/index-KHB3RSv_.js` `390.38 kB`)
- **Automated Browser Suite (`node scripts/test-presentation.mjs` against fresh `vite preview` on port `4174`):** **PASS** — `0` console errors, `0` console warnings, `0` page errors

---

### 2. Full-Screen Desktop Footprint Measurements (Observed)

Measured directly via `scripts/test-presentation.mjs` across `1280×720`, `1440×810`, and `1920×1080` (`[data-stage-shell="fullscreen"]` vs viewport width / `<main>` height, slide content union, primary grid, and primary SVG bounding box):

| Slide | `1280×720` (`main=660px`) | `1440×810` (`main=750px`) | `1920×1080` (`main=1020px`) |
|---|---|---|---|
| **Shell (`[data-stage-shell="fullscreen"]`)** | `95.0%` w / `97.0%` h (`1216×640`) | `95.6%` w / `97.3%` h (`1376×730`) | `96.7%` w / `98.0%` h (`1856×1000`) |
| **Slide 01 — Welcome** | Grid `91.3%` w / `94.5%` h; SVG `556×547` | Grid `92.2%` w / `95.2%` h; SVG `636×616` | Grid `94.2%` w / `96.5%` h; SVG `876×780` |
| **Slide 02 — Overview** | Grid `91.3%` w / `80.5%` h; SVG `302×380` | Grid `92.2%` w / `82.0%` h; SVG `355×461` | Grid `94.2%` w / `85.5%` h; SVG `515×717` |
| **Slide 03 — Data Path** | Grid `91.3%` w / `74.0%` h; SVG `711×332` | Grid `92.2%` w / `76.1%` h; SVG `818×414` | Grid `94.2%` w / `80.8%` h; SVG `1138×666` |
| **Slide 04 — Controller** | Grid `91.3%` w / `74.0%` h; SVG `711×332` | Grid `92.2%` w / `76.1%` h; SVG `818×414` | Grid `94.2%` w / `80.8%` h; SVG `1138×666` |
| **Slide 05 — Comparison** | Grid `91.3%` w / `80.0%` h; SVG `394×253` | Grid `92.2%` w / `81.5%` h; SVG `461×328` | Grid `94.2%` w / `85.0%` h; SVG `520×475` |
| **Slide 06 — Working Together** | Grid `91.3%` w / `81.8%` h; SVG `1168×403` | Grid `92.2%` w / `83.2%` h; SVG `1328×483` | Grid `94.2%` w / `86.7%` h; SVG `1808×738` |
| **Slide 07 — Thank You** | Stack `48.6%` w / `76.4%` h; Mascot `282×206` | Stack `45.3%` w / `72.4%` h; Mascot `317×232` | Stack `36.4%` w / `63.6%` h; Mascot `420×308` |

---

### 3. Automated QA Suite Coverage (`scripts/test-presentation.mjs`)

1. **High-Resolution Slide & Modal Capture (`1440×810`, `deviceScaleFactor: 2`):**
   - Navigated deterministically between slides via `KeyO` → `<dialog>` Slide Overview (`01 / 07`..`07 / 07`).
   - Captured `slide-01-welcome.png` through `slide-07-thank-you.png` and `modal-slide-overview.png`.
   - Verified Slide 03 stage progression (`Stage 1 / 4` → `Stage 2 / 4` → `Stage 3 / 4` → `Stage 4 / 4`, `Step 3/3 • Result: 8`) across 3 `ArrowRight` steps.
   - Verified Slide 04 stage progression (`Stage 1 / 3` → `Stage 2 / 3` → `Stage 3 / 3`, `Step 3/3 • Signals Dispatched`) across 2 `ArrowRight` steps.
   - Verified Slide 06 reaches Beat 3 (`4. WRITE BACK`, `R1 (Dest): 8`) after 3 `ArrowRight` steps.
   - Verified Slide 07 `.ty-btn` computed `opacity === '1'` after `1600ms`.
2. **Full-Screen Stage Shell & Footprint Assertions:**
   - Verified `[data-stage-shell="fullscreen"]` exists inside `<main>` and `0` stale `.max-w-[1160px]`, `.max-w-[1260px]`, `.max-w-[1360px]`, `.max-w-[1500px]`, or `.max-w-[1680px]` classes exist anywhere in the DOM.
   - Verified desktop `stageShell` spans `>= 92%` of viewport width and `>= 85%` of `<main>` height, centered horizontally with zero clipping.
   - Verified Slide 01 hero grid spans `>= 88%` width and `>= 70%` `<main>` height with proportional hero CPU SVG; Slides 02–06 primary grids span `>= 88%` width and `>= 72%` `<main>` height; Slide 06 `InstructionCycle` SVG spans `>= 88%` width and `>= 55%` `<main>` height; Slide 07 centered hero scales up cleanly (`>= 250px` / `>= 300px` / `>= 390px` mascot width across `1280` / `1440` / `1920`) with `<= 2px` symmetry variance and `0` clipping.
3. **Minimal Header & Calm Corner Artwork Checks:**
   - Verified `<header>` left indicator displays strictly `0N / 07` + accent bar with `0` slide-jump dot buttons (`button[aria-label^="Jump to slide"]`) and `0` `STAGE` dot circles in the top bar.
   - Verified every visible interactive button inside `<header>` (`>= 5` buttons) satisfies target size `>= 24×24px`.
   - Verified `0` `.bg-packet`, `.bg-float`, `.bg-pulse`, `.bg-trace-left`, `.bg-trace-right`, `.bg-node-left`, or `.bg-node-right` elements exist anywhere in `div[aria-hidden="true"]` or the document.
   - Verified `>= 2` corner background `<svg>` elements remain visible with `preserveAspectRatio` ending in `meet` (zero `slice` scaling) and all rendered corner shapes (`path`, `rect`, `polygon`, `circle`) stay strictly inside their SVG bounding boxes.
4. **Native `<dialog>` Modal & Keyboard Guard Checks:**
   - Verified `<dialog>` opens via `showModal()`, matches `:modal`, carries `closedby="any"` + valid `aria-labelledby`, and omits redundant `role` / `aria-modal` attributes.
   - Verified `ArrowRight`, `ArrowLeft`, `Home`, and `End` do not close `<dialog>` or alter the underlying slide while `<dialog>` is open.
   - Verified clicking a slide thumbnail (`04 / 07`) closes `<dialog>` and navigates cleanly to Slide 04.
   - Verified `Escape` and backdrop light-dismiss (click outside dialog bounds) both close `<dialog>`.
   - Verified rapid `End` → `Home` navigation cleanly interrupts transitions and lands on `01 / 07`.
5. **Reduced-Motion Emulation (`prefers-reduced-motion: reduce`):**
   - Verified auto-play defaults to paused (`Play Auto Animation`) and does not advance Slide 03 past `Stage 1 / 4` over `2700ms`.
   - Verified every slide's animated selectors immediately settle at computed `opacity === '1'` via `KeyO` → `<dialog>` navigation with `0` console errors/warnings.
6. **Multi-Viewport Layout, Overflow & Alignment Checks (`1920×1080`, `1440×810`, `1280×720`, `768×1024`, `390×844`):**
   - `1920×1080`, `1440×810`, `1280×720`: All 7 slides pass full-screen shell/grid footprint thresholds, minimal header, calm corner SVGs, `0` horizontal/vertical overflow (`scrollHeight === clientHeight` in `<main>`), `0` clipping, Slide 05 headline/table left alignment parity (`<= 2px`), equalized card/panel heights on Slides 02–05 (`<= 2px`), and `0` warnings/errors.
   - `768×1024` & `390×844`: All 7 slides pass minimal header, calm corner SVGs, `0` horizontal overflow in `<header>`, `<main>`, or `documentElement`, and `0` warnings/errors.

---

### 4. Visual Inspection & Slide-by-Slide Verification Log

Visual review of fresh `1440×810` (`@2x`), `1280×720`, and `1920×1080` renders confirmed no text overlap, card crowding, undersized SVGs, or clipping:

| Area / Slide | Verified Full-Screen Behavior | Screenshot |
|---|---|---|
| **Full-Screen Stage Shell, Minimal Header & Calm Corners** | `PresentationShell.tsx` removes `max-w-[1680px]` / `lg:max-h-[960px]` caps (`[data-stage-shell="fullscreen"]` spans `95.0%–96.7%` w × `97.0%–98.0%` h of `<main>`), compact `<header>` (`60px` tall) displays strictly `0N / 07` + accent bar + frosted controls, and static `AnimatedBackground` corner SVGs sit cleanly behind opaque white cards and slide edges (`meet` scaling, zero `.bg-packet`/`.bg-trace-*`). | Visible across `slide-01`..`slide-07` |
| **Slide 01 — Welcome** | Full-width 12-col hero (`91.3%–94.2%` w), fluid `clamp()` headline (`2.35rem`–`5.5rem`) and CTA/topic chips, large isometric CPU die (`556×547` at `1280×720` up to `876×780` at `1920×1080`), zero overlap with bottom-left or top-right corner waves. | `docs/screenshots/slide-01-welcome.png` |
| **Slide 02 — Overview** | Three equal-height `lg:flex-1` cards (`Data Path`, `Unified Silicon Die`, `Controller`) filling `80.5%–85.5%` of `<main>` height, split CPU SVG scaling up to `515×717` at `1920×1080`, crisp `#FFFFFF` / `#DBEAFE` labels. | `docs/screenshots/slide-02-overview.png` |
| **Slide 03 — Data Path** | Equal-height `4 / 8` columns filling `74.0%–80.8%` of `<main>` height, flex-stretched `DataPathDiagram` (`711×332` → `1138×666`), `Stage 1 / 4` → `Stage 4 / 4` (`5 + 3 = 8`), legible bottom annotation over subtle bottom-left wave. | `docs/screenshots/slide-03-datapath.png` |
| **Slide 04 — Controller** | Equal-height `4 / 8` columns filling `74.0%–80.8%` of `<main>` height, flex-stretched `ControllerDiagram` (`711×332` → `1138×666`), `Stage 1 / 3` → `Stage 3 / 3` (`RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`). | `docs/screenshots/slide-04-controller.png` |
| **Slide 05 — Comparison** | Full-width headline aligned (`<= 2px`) with `7 / 5` grid (`80.0%–85.0%` `<main>` height), evenly stretched `lg:flex-1` table rows, equalized card heights, crisp `DATA`/`CONTROL` balance scale (`394×253` → `520×475`). | `docs/screenshots/slide-05-comparison.png` |
| **Slide 06 — Working Together** | Full-stage `InstructionCycle` (`81.8%–86.7%` `<main>` height) with flex-stretched schematic SVG (`1168×403` at `1280×720`, `1328×483` at `1440×810`, `1808×738` at `1920×1080`), `min-h-[44px]` 4-stage buttons (`1. FETCH`..`4. WRITE BACK`), zero vertical clipping at `1280×720`. | `docs/screenshots/slide-06-working-together.png` |
| **Slide 07 — Thank You!** | Centered CPU mascot (`282×206` → `420×308`), fluid `clamp(2.5rem,4vw+0.8rem,5.75rem)` headline, `px-8 py-4` Replay button, and summary capsules with balanced whitespace and `0` clipping across all desktop viewports. | `docs/screenshots/slide-07-thank-you.png` |
| **Slide Overview `<dialog>`** | Native top-layer `<dialog>`, `closedby="any"` + fallback, keyboard navigation guards (`ArrowLeft`/`ArrowRight`/`Home`/`End`) while open, `#1B54C7` contrast. | `docs/screenshots/modal-slide-overview.png` |

---

### 5. Informational Notes (Preserved Files & Packages)

Per project guardrails, unused starter files and unused dependencies were not deleted:
- **Unused Dependencies (`package.json`):** `@gsap/react`, `motion`, `canvas-confetti`, `@types/canvas-confetti`, `tailwind-merge` (zero imports in `src/`).
- **Unused Starter Assets:** `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/favicon.svg`, `public/icons.svg`.
