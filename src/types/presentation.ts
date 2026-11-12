export type SlideId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TransitionDirection = 'forward' | 'backward';

export type TransitionType = 
  | 'soft-directional' 
  | 'horizontal-blur' 
  | 'mask-reveal' 
  | 'directional-split' 
  | 'connected-zoom' 
  | 'soft-fade';

export interface SlideConfig {
  id: SlideId;
  index: number; // 0-based
  slideNumber: string; // "01 / 07"
  title: string;
  subtitle?: string;
  maxBeats: number;
  transitionType: TransitionType;
}

export interface PresentationState {
  currentSlide: number; // 0..6
  currentBeat: number;  // 0..maxBeats - 1
  direction: TransitionDirection;
  isOverviewOpen: boolean;
  isFullscreen: boolean;
  isAutoPlay: boolean;
  isTransitioning: boolean;
  totalSlides: number;
  slideConfig: SlideConfig;
  next: () => void;
  prev: () => void;
  jumpToSlide: (slideIndex: number) => void;
  setBeat: (beatIndex: number) => void;
  nextBeat: () => void;
  prevBeat: () => void;
  toggleOverview: () => void;
  closeOverview: () => void;
  toggleFullscreen: () => void;
  toggleAutoPlay: () => void;
}

