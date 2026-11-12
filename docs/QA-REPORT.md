# Quality Assurance & Verification Report
## Data Path vs. Controller Architecture Presentation Website

### 1. Executive Summary

- **Project:** `/home/rahat/yes` — 7-slide animated CSE presentation (*Data Path vs. Controller Architecture*)
- **Linter (`npm run lint` / `oxlint`):** **PASS** — `0` warnings, `0` errors across `27` files (`116` rules)
- **TypeScript (`tsc -p tsconfig.app.json --noEmit` & `tsc -p tsconfig.node.json --noEmit`):** **PASS** — `0` errors
- **Production Build (`npm run build` / `tsc -b && vite build`):** **PASS** — `2111` modules transformed (`dist/index.html` `1.16 kB`, `dist/assets/index-DyYztaNt.css` `39.15 kB`, `dist/assets/index-anUBMZ3b.js` `415.58 kB`)
- **Automated Browser Suite (`node scripts/test-presentation.mjs` against fresh `vite preview` on port `4174`):** **PASS** — `0` console errors, `0` console warnings, `0` page errors
- **Live Port `4173` Preview Check:** Verified `http://127.0.0.1:4173/` serves the fresh `dist/` asset hashes (`assets/index-anUBMZ3b.js`, `assets/index-DyYztaNt.css`)

---

### 2. Automated QA Suite Coverage (`scripts/test-presentation.mjs`)

1. **High-Resolution Slide & Modal Capture (`1440×810`, `deviceScaleFactor: 2`):**
   - Captured `slide-01-welcome.png` through `slide-07-thank-you.png` and `modal-slide-overview.png`.
   - Verified Slide 03 reaches Beat 3 (`Step 3/3 • Result: 8`, `Stage 4 / 4`) after 3 `ArrowRight` steps.
   - Verified Slide 04 reaches Beat 2 (`Step 3/3 • Signals Dispatched`, `Stage 3 / 3`) after 2 `ArrowRight` steps.
   - Verified Slide 06 reaches Beat 3 (`4. WRITE BACK`, `R1 (Dest): 8`) after 3 `ArrowRight` steps.
   - Verified Slide 07 `.ty-btn` computed `opacity === '1'` after `1600ms`.
2. **Native `<dialog>` Modal & Keyboard Guard Checks:**
   - Verified `<dialog>` opens via `showModal()`, matches `:modal`, carries `closedby="any"` + valid `aria-labelledby`, and omits redundant `role` / `aria-modal` attributes.
   - Verified `ArrowRight` and `Space` do not advance underlying slide/beat while `<dialog>` is open.
   - Verified clicking a slide thumbnail (`04 / 07`) closes `<dialog>` and navigates cleanly to Slide 04.
   - Verified `Escape` and backdrop light-dismiss (click outside dialog bounds) both close `<dialog>`.
   - Verified rapid `End` → `Home` navigation cleanly interrupts transitions and lands on `01 / 07`.
3. **Reduced-Motion Emulation (`prefers-reduced-motion: reduce`):**
   - Verified auto-play defaults to paused (`Play Auto Animation`) and does not advance Slide 03 past `Stage 1 / 4` over `2700ms`.
   - Verified every slide's animated selectors immediately settle at computed `opacity === '1'` with `0` console errors/warnings.
4. **Multi-Viewport Layout, Overflow & Side-Rail Checks (`1920×1080`, `1440×810`, `1280×720`, `768×1024`, `390×844`):**
   - `1920×1080`: All 7 slides pass (`0` overflow, `0` clipping, side rails visible/unclipped/non-overlapping, `0` warnings/errors).
   - `1440×810`: All 7 slides pass (`0` overflow, `0` clipping, side rails visible/unclipped/non-overlapping, `0` warnings/errors).
   - `1280×720`: All 7 slides pass (`0` overflow, `0` clipping including Slide 06, side rails visible/unclipped/non-overlapping, `0` warnings/errors).
   - `768×1024`: All 7 slides pass (`0` horizontal overflow, `>= 24×24px` dot targets, `0` warnings/errors).
   - `390×844`: All 7 slides pass (`0` horizontal overflow in `<header>`, `<main>`, or `documentElement`, `0` warnings/errors).
   - Verified Slide 05 headline/table left alignment parity (`<= 2px`), equalized card heights on Slides 02–05 (`<= 2px`), zero `slice` `preserveAspectRatio` SVGs, and all shapes inside left/right `SideRailSvg`s remain strictly inside their SVG bounding boxes.

---

### 3. Slide-by-Slide & Defect Resolution Log

| Area / Slide | Verified Behavior & Fixes | Screenshot |
|---|---|---|
| **Background & Side Rails** | Soft sky-blue corner waves + left/right architectural GSAP `MotionPathPlugin` circuit rails (`meet` scaling). Fixed rotated diamond `<g>` wrapper in `AnimatedBackground.tsx` after initial QA caught GSAP overwriting SVG `transform` and clipping squares at left edge (`x=-5`) and top-right (`x=1319`). | Visible across `slide-01`..`slide-07` |
| **Slide 01 — Welcome** | Contrast upgraded (`#1B54C7` badge, `#102A50/75` subtitle/pills), `maximum-scale=1.0, user-scalable=no` removed, responsive mobile/tablet stack, reduced-motion immediate reveal. | `docs/screenshots/slide-01-welcome.png` |
| **Slide 02 — Overview** | Equal-height 3-card grid, readable `#FFFFFF` / `#DBEAFE` labels (`11.72:1`) on dark split CPU die, reduced vertical voids, beat-based plane highlight. | `docs/screenshots/slide-02-overview.png` |
| **Slide 03 — Data Path** | Equal-height `4/8` columns, Beat 1 (`Input → R2/R3`), Beat 2 (`R2/R3 → ALU` + centered `.alu-glow`), Beat 3 (`ALU → R1=8 → Output=8`), widened Output block, dynamic beat badge (`Step 3/3 • Result: 8`). | `docs/screenshots/slide-03-datapath.png` |
| **Slide 04 — Controller** | Equal-height `4/8` columns, control bus wires & arrowheads flush with `x=762` signal boxes (`RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`), seamless feedback loop, WCAG AA standby label. | `docs/screenshots/slide-04-controller.png` |
| **Slide 05 — Comparison** | Headline aligned cleanly with table grid, equalized table & scale card heights, widened right scale pan wires clearing `CONTROL` label, elastic beam settle. | `docs/screenshots/slide-05-comparison.png` |
| **Slide 06 — Working Together** | `RegRead = 1` flush at `y=136`, `ALUOp = ADD` touching ALU top edge (`y=211`), `R2`/`R3` operand wires centered at `y=227`/`259`, Beat 0 `.active-bus-pulse` guard (0 GSAP warnings), clean fit at `1280×720`. | `docs/screenshots/slide-06-working-together.png` |
| **Slide 07 — Thank You!** | Tight `~0.80s` entrance timeline ensuring `.ty-btn` and `.ty-summary` settle to `opacity: 1`, balanced vertical framing, smiling CPU mascot die. | `docs/screenshots/slide-07-thank-you.png` |
| **Slide Overview `<dialog>`** | Native top-layer `<dialog>`, double-flip close bug resolved via idempotent `closeOverview`, backdrop light-dismiss, keyboard navigation guards while open, `#1B54C7` contrast. | `docs/screenshots/modal-slide-overview.png` |

---

### 4. Informational Notes (Preserved Files & Packages)

Per project guardrails, unused starter files and unused dependencies were not deleted:
- **Unused Dependencies (`package.json`):** `@gsap/react`, `motion`, `canvas-confetti`, `@types/canvas-confetti`, `tailwind-merge` (zero imports in `src/`).
- **Unused Starter Assets:** `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/favicon.svg`, `public/icons.svg`.
