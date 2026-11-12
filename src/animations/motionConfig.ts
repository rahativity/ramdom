import type { SlideConfig } from '../types/presentation';

export const motionConfig = {
  transition: {
    duration: 0.75,
    ease: "power3.inOut",
    blur: 5,
  },
  entrance: {
    duration: 0.65,
    stagger: 0.1,
    y: 28,
    ease: "power3.out",
  },
  diagram: {
    duration: 1.1,
    ease: "power1.inOut",
  },
  emphasis: {
    duration: 0.35,
    ease: "power2.out",
  },
  pulse: {
    duration: 0.45,
    ease: "power1.inOut",
  },
};

export const SLIDE_CONFIGS: SlideConfig[] = [
  {
    id: 1,
    index: 0,
    slideNumber: "01 / 07",
    title: "Data Path vs. Controller Architecture",
    subtitle: "Understanding the Core of a Processor",
    maxBeats: 1,
    transitionType: "soft-directional",
  },
  {
    id: 2,
    index: 1,
    slideNumber: "02 / 07",
    title: "Two Components. One Processor.",
    subtitle: "A CPU combines data processing and control.",
    maxBeats: 3, // 0: both, 1: datapath focus, 2: controller focus
    transitionType: "horizontal-blur",
  },
  {
    id: 3,
    index: 2,
    slideNumber: "03 / 07",
    title: "Where Data Comes to Life.",
    subtitle: "The datapath moves and processes data.",
    maxBeats: 4, // 0: Inputs, 1: Operands latched, 2: ALU calc, 3: Result latched
    transitionType: "mask-reveal",
  },
  {
    id: 4,
    index: 3,
    slideNumber: "04 / 07",
    title: "The Brain Behind Every Operation.",
    subtitle: "The controller coordinates processor operations.",
    maxBeats: 3, // 0: Instruction, 1: Decoder, 2: Signals propagated
    transitionType: "directional-split",
  },
  {
    id: 5,
    index: 4,
    slideNumber: "05 / 07",
    title: "Different Roles. Shared Purpose.",
    subtitle: "Architectural comparison at a glance.",
    maxBeats: 1, // Single beat, full comparative overview
    transitionType: "connected-zoom",
  },
  {
    id: 6,
    index: 5,
    slideNumber: "06 / 07",
    title: "One Instruction. A Coordinated Process.",
    subtitle: "Watch the processor execute an instruction.",
    maxBeats: 4, // 0: Fetch, 1: Decode, 2: Execute, 3: Write Back
    transitionType: "soft-fade",
  },
  {
    id: 7,
    index: 6,
    slideNumber: "07 / 07",
    title: "Thank You!",
    subtitle: "Any Questions?",
    maxBeats: 1,
    transitionType: "soft-fade",
  },
];
