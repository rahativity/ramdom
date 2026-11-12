# Motion Design Specification
## Data Path vs. Controller Architecture Presentation

### 1. Motion Architecture Principles

The motion design translates the mechanical logic of a central processing unit into fluid, intelligible visual motion.

- **Purpose-Driven Animation:** Every animation represents an actual physical or logical phenomenon (signal propagation, data bus transfer, latching, state transition).
- **Dual Orchestration Model:**
  - **GSAP 3 (`gsap`, `@gsap/react`):** Primary master timeline orchestrator for slide transitions, multi-stage CPU cycles, SVG path packet interpolation, and coordinated timeline scrubbing.
  - **Motion (`motion`):** High-level React component mounts, UI hover interactions, button feedback states, and micro-dialog reveals.
  - **Zero Collision Guarantee:** GSAP and Motion never bind to the same DOM nodes.
- **Strict Performance Standards:** Animations operate strictly on hardware-composited properties (`transform`, `opacity`, `filter: blur`). No layout reflow properties (`top`, `left`, `width`, `height`, `margin`) are animated.

---

### 2. Global Slide Transitions

Each transition between slides has an intentional spatial narrative that mirrors advancing through architectural abstractions.

| Transition | Transition Type | Visual Behavior | Duration | Easing |
|---|---|---|---|---|
| **01 → 02** | Soft Directional | Smooth leftward slide with progressive opacity blend | `750ms` | `power3.inOut` |
| **02 → 03** | Horizontal Blur | Fast directional translation with temporary 4px dynamic blur | `750ms` | `power3.inOut` |
| **03 → 04** | Controlled Mask Reveal | Radial or clip-path expansion revealing controller logic | `800ms` | `power3.inOut` |
| **04 → 05** | Directional Split | Staggered two-column entrance reinforcing contrast | `700ms` | `power3.inOut` |
| **05 → 06** | Connected Zoom | Camera zooms into the interconnected execution matrix (`scale: 0.95 → 1.0`) | `850ms` | `power3.inOut` |
| **06 → 07** | Elegant Soft Fade | Quiet settling cross-fade with subtle upward lift | `750ms` | `power2.inOut` |

#### Reversible & Overlap-Safe Transition Protocol
- If a user navigates backwards, the inverse spatial transformation is computed (`x: -100% → 0%`).
- `isTransitioning` lock prevents concurrent or interrupted animations. All active GSAP tweens are safely killed upon unmount or interrupt.

---

### 3. Slide Entrance Specification

Standard entrance parameters applied to all slides upon mounting:

```typescript
export const entranceConfig = {
  headline: {
    y: 28,
    opacity: 0,
    duration: 0.65,
    ease: "power3.out",
  },
  subtitle: {
    y: 18,
    opacity: 0,
    duration: 0.55,
    delay: 0.1,
    ease: "power3.out",
  },
  diagramNodes: {
    scale: 0.94,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "power2.out",
  },
  traces: {
    strokeDashoffset: 100,
    duration: 0.9,
    ease: "power1.inOut",
  }
};
```

---

### 4. Technical Diagram Animation Specifications

#### Slide 01: Welcome
1. **0.0s – 0.4s:** Soft background gradient expands (`opacity: 0 → 1`).
2. **0.2s – 0.8s:** 2.5D CPU die floats into center (`y: 40px → 0px`, `opacity: 0 → 1`).
3. **0.5s – 1.2s:** Circuit interconnect traces draw outward (`strokeDashoffset` from 1000 to 0).
4. **0.7s – 1.1s:** Headline reveals with clean character/word stagger.
5. **1.1s+:** Subtle ambient idle breathing on CPU glow (`y: -4px ↔ 4px`, 4s loop).

#### Slide 02: Architecture Overview
1. **0.0s – 0.5s:** Unified CPU block manifests.
2. **0.5s – 1.0s:** A clean dividing vector splits the chip into Data Path (left) and Controller (right).
3. **1.0s – 1.6s:** Shared bus channels between the two halves ignite with electric blue pulses.

#### Slide 03: Data Path Execution (`5 + 3 = 8`)
1. **Beat 1 (Input Stage):** Input badges `5` and `3` appear and illuminate.
2. **Beat 2 (Bus Travel to Registers):** Packets glide along SVG curve into registers R2 and R3; registers illuminate with `#2868E8`.
3. **Beat 3 (ALU Compute):** Operands stream from R2 and R3 into ALU inputs; ALU core pulses with computation ripple (`scale: 1.05`, glow).
4. **Beat 4 (Output Latch):** ALU emits result packet `8`, which flows along the output bus to destination register R1.

#### Slide 04: Controller Signal Propagation
1. **Beat 1 (Fetch Opcode):** Instruction hex `ADD 0x01` enters instruction register.
2. **Beat 2 (Decoder Activation):** Decoder matrix lights up; microcode branches.
3. **Beat 3 (Signal Broadcast):** Distinct control signals (`RegRead`, `ALUOp[ADD]`, `RegWrite`) shoot along dedicated copper-colored and electric blue traces toward the datapath interface.

#### Slide 05: Key Differences Comparison
1. **0.0s – 0.4s:** Two-column card container smoothly fades in.
2. **0.4s – 1.0s:** Rows reveal in sequential pairs (Data Path row vs Controller row) with 100ms stagger.
3. **1.0s – 1.5s:** Digital balance scale balances into equilibrium with subtle damping spring (`tension: 180, friction: 12`).

#### Slide 06: Master Coordinated Cycle (`ADD R1, R2, R3`)
The presentation centerpiece. Features 4 interactive or auto-advancing beats:
- **Beat 1: FETCH**
  - PC / Bus emits instruction address.
  - Instruction Register (IR) latches `ADD R1, R2, R3`.
  - Status chip displays: `FETCH: IR ← MEM[PC]`.
- **Beat 2: DECODE**
  - IR passes opcode bits to Controller.
  - Controller decodes opcode: Identifies ALU operation (`ADD`), source registers (`R2`, `R3`), and destination (`R1`).
  - Control lines ignite: `RegRead = 1`, `ALUOp = ADD`.
  - Status chip displays: `DECODE: Control lines armed`.
- **Beat 3: EXECUTE**
  - Register File outputs value `5` (from R2) and value `3` (from R3).
  - Values flow simultaneously into ALU Input A and Input B.
  - ALU executes addition: `5 + 3 → 8`.
  - Status chip displays: `EXECUTE: ALU Result = 8`.
- **Beat 4: WRITE BACK**
  - Control line `RegWrite = 1` pulses.
  - Value `8` travels along the Write-Back Bus into Register File.
  - R1 updates from `0` to `8` with a crisp numerical counter tick.
  - Status chip displays: `WRITE BACK: R1 ← 8 Complete`.

#### Slide 07: Thank You & Closing
1. **0.0s – 0.6s:** Central CPU mascot/die settles into place with gentle deceleration.
2. **0.5s – 1.0s:** Circuit tracks radiate with soft ambient breathing.
3. **0.8s – 1.2s:** "Thank You!" and "Any Questions?" reveal cleanly.

---

### 5. Presenter Controls & Keyboard Mapping

| Key Trigger | Presentation Action |
|---|---|
| `ArrowRight` / `Space` | Next stage beat; if at last beat, advance to next slide |
| `ArrowLeft` | Previous stage beat; if at beat 0, return to previous slide |
| `Home` | Jump to Slide 01 |
| `End` | Jump to Slide 07 |
| `KeyF` / Double Click | Toggle standard browser fullscreen |
| `Escape` | Exit fullscreen |

*Note:* All keyboard shortcuts operate silently with zero on-screen instructional clutter.

---

### 6. Accessibility & Reduced Motion Protocol

When `prefers-reduced-motion: reduce` is detected:
1. All directional slide sliding and zoom transforms are bypassed; replaced with instant or gentle 150ms opacity fades.
2. SVG path motion is replaced with instant state snapshots.
3. Looping idle glows are paused.
4. Numerical counter animations snap directly to final values (`5 + 3 = 8`).

