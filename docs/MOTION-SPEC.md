# Motion Design Specification
## Data Path vs. Controller Architecture Presentation

### 1. Motion Architecture Principles

Every motion behavior communicates CPU state, bus transfer, or spatial context while remaining lightweight and accessible:

- **Single JS Animation Engine:** **GSAP 3** (`gsap`) focuses exclusively on slide transitions, staggered slide entrances, and CPU hardware diagram animations (side-rail animations and `MotionPathPlugin` were removed from `AnimatedBackground.tsx`).
  - *(Note: `motion` and `@gsap/react` are listed in `package.json` but are not imported anywhere in `src/`; no dual-engine collision exists.)*
- **Native Modal & CSS Transitions:** Native `<dialog class="overview-dialog">` uses modern CSS `@starting-style` and `transition-behavior: allow-discrete` (`200ms ease-out` opacity/translate/backdrop blur), paired with concise Tailwind hover transitions on buttons and diagram highlights.
- **Reduced-Motion First (`useReducedMotion`):** Every animated diagram, slide, shell control, and transition checks the live `(prefers-reduced-motion: reduce)` media query via `src/hooks/useReducedMotion.ts` (`useSyncExternalStore`).

---

### 2. Global Slide Transitions (`src/animations/transitions.ts` & `SlideRenderer.tsx`)

Direction-aware transitions invert spatial offsets cleanly on backward navigation (`direction === 'backward'`):

| Slides | Transition Type | Behavior | Duration | Easing |
|---|---|---|---|---|
| **01 → 02** | `soft-directional` | Horizontal directional slide (`x: ±60px → 0`, `opacity: 0 → 1`) | `750ms` | `power3.inOut` |
| **02 → 03** | `horizontal-blur` | Fast translation (`x: ±120px → 0`) with momentary `6px` blur | `750ms` | `power3.inOut` |
| **03 → 04** | `mask-reveal` | Circular `clipPath` reveal (`circle(10%) → circle(150%)`) | `862.5ms` (`1.15×`) | `power2.inOut` |
| **04 → 05** | `directional-split` | Vertical lift & subtle scale (`y: ±35px → 0`, `scale: 0.98 → 1`) | `750ms` | `power3.inOut` |
| **05 → 06** | `connected-zoom` | Spatial zoom (`scale: 0.94/1.04 → 1`, `y: ±20px → 0`) | `825ms` (`1.1×`) | `power3.out` |
| **06 → 07** | `soft-fade` | Gentle cross-fade (`scale: 0.985 → 1`, `opacity: 0 → 1`) | `675ms` (`0.9×`) | `power2.out` |

- **Interruption-Safe Navigation (`usePresentation.ts`):** `jumpToSlide()` cancels any active `transitionTimerRef` timeout instead of dropping rapid `Home`/`End` or Slide Overview `<dialog>` selections, while `SlideRenderer` cleans up prior GSAP timelines on unmount via `tl.kill()` and `gsap.set(..., { clearProps })`.
- **Reduced Motion Fallback:** `SlideRenderer` bypasses `animateSlideTransition()` and runs a gentle `150ms` opacity fade (`power1.out`) on slide switches, clearing inline styles immediately on cleanup so elements never remain stuck at `opacity: 0`.

---

### 3. Static Minimal Keynote Corner Artwork (`AnimatedBackground.tsx`)

Background decoration is intentionally **100% static** so focus remains squarely on the slide transitions and hardware schematics:

1. **Zero Background GSAP Loops:** `SideRailSvg`, `getSlideRailTheme`, `gsap`/`MotionPathPlugin` imports, and all `.bg-packet`, `.bg-float`, `.bg-pulse`, `.bg-trace-left`, `.bg-trace-right`, `.bg-node-left`, and `.bg-node-right` elements have been completely removed.
2. **Three Calm Corner SVGs (`aria-hidden="true"`, `pointer-events-none`, `meet` scaling):**
   - **Top-Right (`viewBox="0 0 480 340"`, `xMaxYMin meet`):** Layered soft sky-blue organic waves (`#E6EFFF`/`#D6E5FF` fading into `#2868E8`), thin orbital Bezier arc with one static 45° diamond marker (`7×7`, `rx="1.5"`), and two translucent rounded micro-square tiles (`rx="6"`).
   - **Bottom-Left (`viewBox="0 0 520 300"`, `xMinYMax meet`):** Soft curved sky-blue layered organic sweep wave and hairline arc echo.
   - **Bottom-Right (`viewBox="0 0 280 180"`, `xMaxYMax meet`):** Subtle outer corner whisper accent.
3. **Subtle Per-Slide State Shift:** Each slide index (`0..6`) calmly varies the diamond marker position along the Bezier curve (`diamondT`), arc/tile opacities, micro-tile offsets, and bottom-right whisper opacity without triggering motion or layout shifts.

---

### 4. Slide & Hardware Diagram Choreography

#### Slide 01 (`Slide01Welcome.tsx` & `CPUArchitecture.tsx`)
- Staggered entrance for badge, headline lines, subtitle, CTA button, topic highlights, and floating 2.5D CPU die (`~1.05s` total).
- `CPUArchitecture` loops `.trace-pulse` (`strokeDashoffset: -40`, `2.2s`) and `.chip-float` (`y: -6`, `3s`, `yoyo: true`).

#### Slide 02 (`Slide02Overview.tsx`) — `3 Beats (0..2)`
- Beat `0`: Both planes illuminated (`Active: Coordinated Dual Planes`).
- Beat `1`: Data Path card & left die half emphasized (`Focus: Data Path Plane`).
- Beat `2`: Controller card & right die half emphasized (`Focus: Controller Plane`).

#### Slide 03 (`Slide03DataPath.tsx` & `DataPathDiagram.tsx`) — `4 Beats (0..3)`
- **Beat 0 (`Step 0/3`):** Input A (`5`) and Input B (`3`) ready.
- **Beat 1 (`Step 1/3`):** `.packet-in-a` and `.packet-in-b` travel horizontally (`x: 125 → 235`, `0.65s`) into Registers `R2=5` and `R3=3`.
- **Beat 2 (`Step 2/3`):** `.packet-reg-a` and `.packet-reg-b` stream from `R2`/`R3` along the bent Register→ALU wires (`x: 346 → 435 → 456`) into ALU inputs while `.alu-glow` pulses around `transformOrigin: 'center center'` (`scale: 1 → 1.05`).
- **Beat 3 (`Step 3/3`):** `.packet-out` (`x: 580 → 681`) and `.packet-out-final` (`x: 790 → 848`) travel from ALU → `Register R1 (8)` → `Output (8)`.

#### Slide 04 (`Slide04Controller.tsx` & `ControllerDiagram.tsx`) — `3 Beats (0..2)`
- **Beat 0 (`Step 1/3`):** Instruction `ADD R1, R2, R3` ready.
- **Beat 1 (`Step 2/3`):** Decoder latches `Opcode: 0x01`, Control Unit activates, timing feedback loop illuminates.
- **Beat 2 (`Step 3/3`):** Signal buses (`RegRead = 1`, `ALUOp = ADD`, `RegWrite = 1`) fire into target blocks (`x=762`) with continuous `.signal-pulse` loops (`strokeDashoffset: -32`, `1.4s`).

#### Slide 05 (`Slide05Comparison.tsx`) — `1 Beat`
- Sequential pair reveal for the 5 comparison rows (`0.24s`, `0.05s` stagger) paired with `.scale-beam` (`rotation: -3.2 → 0`, `svgOrigin: '140 32'`, `elastic.out(1, 0.48)`, `0.85s`) and synchronized pan settling (`.scale-pan-left` / `.scale-pan-right`).

#### Slide 06 (`Slide06WorkingTogether.tsx` & `InstructionCycle.tsx`) — `4 Beats (0..3)`
- **Beat 0 (`1. FETCH`):** Instruction Register highlighted; Beat 0 skips `.active-bus-pulse` tweens cleanly (0 console warnings).
- **Beat 1 (`2. DECODE`):** Controller activates (`DECODE: ADD ACTIVE`); `RegRead = 1` control bus pulses from `y=136` to Register File (`R2=5`, `R3=3`).
- **Beat 2 (`3. EXECUTE`):** `ALUOp = ADD` touches ALU top slope (`y=211`); operand wires from `R2` (`y=227`) and `R3` (`y=259`) stream to ALU (`5 + 3 = 8`).
- **Beat 3 (`4. WRITE BACK`):** Write-Back bus (`ALU → R1`) pulses; `R1 (Dest)` updates from `0` to `8`.

#### Slide 07 (`Slide07ThankYou.tsx`) — `1 Beat`
- Tight overlapped entrance timeline (`~0.80s` total completion: chip `0.0s`, title `0.15s`, subtitle `0.25s`, replay button `0.35s` + `0.40s` = `0.75s`, summary capsules `0.45s` + `0.35s` = `0.80s`).

---

### 5. Presenter Controls & Keyboard Mapping

| Input Trigger | Action | Guard / Notes |
|---|---|---|
| `ArrowRight` / `Space` | Advance beat, or move to next slide at final beat | Ignored while `<dialog>` Slide Overview is open |
| `ArrowLeft` | Previous beat, or move to previous slide at beat 0 | Ignored while `<dialog>` Slide Overview is open |
| `Home` | Jump to Slide `01` | Ignored while `<dialog>` Slide Overview is open |
| `End` | Jump to Slide `07` | Ignored while `<dialog>` Slide Overview is open |
| `KeyF` | Toggle browser fullscreen (via `fullscreenchange` listener) | Ignored while `<dialog>` Slide Overview is open |
| `KeyO` | Toggle Slide Overview `<dialog>` | Works globally (excluding `<input>`/`<textarea>`) |
| `Escape` | Close Slide Overview `<dialog>` (native) or exit fullscreen (browser) | Native `<dialog>` cancel/close handler syncs React state |
| Auto-Play | Advances multi-beat stages every `2400ms` (`App.tsx`) | Paused automatically when `prefers-reduced-motion: reduce` |

---

### 6. Accessibility & Reduced-Motion Protocol

When `(prefers-reduced-motion: reduce)` matches:
1. `App.tsx` disables the `2400ms` auto-play beat timer and `PresentationShell` reflects paused playback (`Play Auto Animation`).
2. `SlideRenderer.tsx` replaces sliding/blur/zoom transitions with a `150ms` opacity crossfade.
3. All 7 slides and 4 diagrams immediately `gsap.set(...)` animated selectors to `opacity: 1` and neutral transforms, bypassing infinite floats, packet loops, and pulse tweens.
4. `AnimatedBackground.tsx` renders static minimal Keynote corner SVGs across all motion modes without any GSAP loops or packet elements.
5. `index.css` disables `.overview-dialog` CSS transitions and transforms inside `@media (prefers-reduced-motion: reduce)`.
