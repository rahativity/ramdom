# Design System Specification
## Data Path vs. Controller Architecture Presentation

### 1. Visual Direction & Reference Fidelity
This design system translates the visual identity established in the reference presentation into a full-screen, 16:9 interactive presentation experience.

**Core Aesthetics:**
- **Background:** Bright, luminous Soft White (`#F8FAFF`) with subtle radial gradients and soft organic blue curves (`#EBF2FF` / `#DCE9FE`).
- **Typography:** Deep Navy (`#102A50`) for maximum legibility and academic authority, accented by Electric Blue (`#2868E8`).
- **Containers & Surfaces:** Clean rounded rectangular cards with subtle border strokes (`rgba(40, 104, 232, 0.12)`), soft ambient shadows (`0 8px 30px rgba(16, 42, 80, 0.04)`), and generous padding.
- **Diagrams & Hardware Art:** Precision vector illustrations representing CPU dies, silicon interconnects, registers, ALUs, and control buses with isometric and orthogonal clarity.

---

### 2. Color Palette (Strict 3-Color Triad)

| Token Name | Hex Code | Opacity / Tint Variants | Primary Usage |
|---|---|---|---|
| **Deep Navy** | `#102A50` | `100%`, `80%`, `60%`, `20%`, `10%` | Primary headlines, structural borders, dark component containers, diagrams |
| **Electric Blue** | `#2868E8` | `100%`, `80%`, `25%`, `15%`, `8%` | Accent headlines, active bus lines, clock pulses, animated packets, key buttons |
| **Soft White** | `#F8FAFF` | `100%`, `90%`, `white (#FFFFFF)` | Viewport background, card fill surfaces, neutral diagram node fills |

#### Functional Palette Mapping
- **Canvas Base:** `#F8FAFF`
- **Elevated Surfaces / Cards:** `#FFFFFF` with `box-shadow: 0 10px 40px -10px rgba(16, 42, 80, 0.06)`
- **Border Stroke:** `rgba(40, 104, 232, 0.12)`
- **Data Signal Accent:** `#2868E8`
- **Control Signal Accent:** `#102A50` with `#2868E8` pulses
- **Text Primary:** `#102A50`
- **Text Secondary / Muted:** `rgba(16, 42, 80, 0.65)`

---

### 3. Typography Hierarchy

Fonts loaded via Google Fonts:
- **Display & Headings:** `Space Grotesk`, sans-serif (Weights: 600, 700)
- **Body, UI & Technical Labels:** `Inter`, sans-serif (Weights: 400, 500, 600)
- **Monospace & Code Tokens:** `JetBrains Mono` / `SF Mono`, monospace (Weight: 500)

| Level | Size | Weight | Line Height | Tracking | Application |
|---|---|---|---|---|---|
| **Display (Slide 01)** | `3.75rem` (60px) | 700 | 1.1 | `-0.03em` | Main Title |
| **Slide Headline** | `2.75rem` (44px) | 700 | 1.15 | `-0.025em` | Slide primary headline |
| **Supporting Subtitle** | `1.25rem` (20px) | 400 | 1.4 | `-0.01em` | Slide supporting phrase |
| **Diagram Headings** | `1.125rem` (18px) | 600 | 1.3 | `-0.01em` | Component blocks (ALU, Controller) |
| **Technical Labels** | `0.875rem` (14px) | 500 / 600 | 1.2 | `0.02em` | Bus names, opcode flags, register values |
| **Micro Labels** | `0.75rem` (12px) | 600 | 1.2 | `0.05em` | Step indicators (`01 / 07`), status pills |

---

### 4. Layout & Grid Architecture

- **Canvas Viewport:** 16:9 fixed presentation canvas, scaled responsively with CSS `aspect-ratio: 16/9` and container queries or SVG viewbox preservation.
- **Reference Resolution:** `1440 × 810 px`.
- **Safe Margins:**
  - Top: `48px` (Reserved for unobtrusive slide tracker `01 / 07` and accent line)
  - Left & Right: `64px`
  - Bottom: `48px` (Reserved for minimal navigation controls and stage dots)
- **Whitespace Ratio:** Minimum 45% of the slide area remains negative space to focus attention directly on the architectural diagram.

---

### 5. Slide-by-Slide Visual Composition

#### Slide 01: Welcome
- **Left Column (55%):**
  - Slide index tag: `01 / 07` with 32px electric blue accent rule.
  - Headline: "Data Path vs. Controller" (Deep Navy) and "Architecture" (Electric Blue).
  - Subtitle: "Understanding the Core of a Processor".
  - Sleek pill button: "Let's Explore →"
- **Right Column (45%):**
  - Isometric 2.5D CPU silicon die on a multi-layer glowing plinth.
  - Interconnect pins and animated bus traces radiating outward.
  - Subtle blue ambient glow ring.

#### Slide 02: Architecture Overview
- **Header:** "Two Components. One Processor." | "A CPU combines data processing and control."
- **Content Distribution:**
  - **Left Domain Card (Data Path):** Concise supporting bullets (*"Processes and moves data."*, *"Includes ALU and registers."*) with component badges.
  - **Centerpiece:** Enlarged master CPU die divided into two clear cooperative domains (Data Path & Controller) with interactive split illumination.
  - **Right Domain Card (Controller):** Concise supporting bullets (*"Decodes instructions."*, *"Generates control signals."*, *"Coordinates processor operations."*) with component badges.

#### Slide 03: Data Path
- **Header:** "Where Data Comes to Life." | "The datapath moves and processes data."
- **Content Balance (32% Text / 68% Diagram):**
  - **Left Educational Card:** Core mechanisms (*"Registers store temporary data."*, *"ALU performs arithmetic and logic."*, *"Buses transfer data between components."*, *"Results move to destination registers."*).
  - **Right Diagram Flow (Enlarged by ~25%):** Linear processing pipeline:
    `Input Data` → `Registers (R2, R3)` → `ALU` → `Destination Register (R1)` → `Output Data`
    Illustrative packet flow: `5 + 3 = 8` with real-time value latches.

#### Slide 04: Controller
- **Header:** "The Brain Behind Every Operation." | "The controller coordinates processor operations."
- **Content Balance (32% Text / 68% Diagram):**
  - **Left Educational Card:** Control mechanics (*"Fetches and decodes instructions."*, *"Generates control signals."*, *"Coordinates datapath operations."*, *"Controls execution sequence."*).
  - **Right Diagram Flow (Enlarged by ~25%):**
    `Instruction [0x01: ADD]` → `Instruction Decoder` → `Control Unit`
    Radiating control lines: `RegRead`, `ALUOp[ADD]`, `RegWrite` with feedback timing loop.

#### Slide 05: Key Differences
- **Header:** "Different Roles. Shared Purpose."
- **Composition:**
  - Left: Enlarged comparison table with Deep Navy header bar and Electric Blue highlights.
  - Right: Digital balance scale card integrated with concise takeaway:
    **"Data Path performs. Controller coordinates."**

#### Slide 06: Working Together (Master Demonstration)
- **Header:** "One Instruction. A Coordinated Process." | "Watch the processor execute an instruction."
- **Architecture Diagram (Enlarged by ~30%):**
  - Top Left: `Instruction Register` (`ADD R1, R2, R3`)
  - Top Right: `Control Unit`
  - Bottom Left: `Register File` (`R2=5`, `R3=3`, `R1=0 → 8`)
  - Bottom Right: `ALU`
- **Execution Beats & Supporting Sequence:**
  1. `FETCH`: Instruction loaded into Instruction Register.
  2. `DECODE`: Control unit decodes opcode and enables registers R2, R3.
  3. `EXECUTE`: Values (5, 3) travel to ALU, ALU computes `5 + 3 = 8`.
  4. `WRITE BACK`: Result 8 travels via write-back bus to register R1.

#### Slide 07: Thank You
- **Header:** "Thank You!" | "Any Questions?"
- **Visual:** Polished CPU die with circuit tracks and gentle floating aura.
- **Controls:** Discrete replay and slide jump shortcuts.

---

### 6. Interactive Controls & Accessibility
- Discreet bottom navigation bar with current slide index `01 / 07`.
- Minimalist icon buttons with smooth hover feedback.
- Keyboard navigation: `Right`/`Space` (Next beat/slide), `Left` (Prev beat/slide), `Home`/`End`, `Escape` (fullscreen toggle).
- Full compliance with `prefers-reduced-motion`.

