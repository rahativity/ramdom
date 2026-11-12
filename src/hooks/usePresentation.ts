import { useState, useEffect, useCallback, useRef } from 'react';
import { SLIDE_CONFIGS } from '../animations/motionConfig';
import type { TransitionDirection, PresentationState } from '../types/presentation';

function getTransitionLockMs(): number {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 160;
    }
  }
  return 750;
}

export function usePresentation(): PresentationState {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [direction, setDirection] = useState<TransitionDirection>('forward');
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const totalSlides = SLIDE_CONFIGS.length;
  const slideConfig = SLIDE_CONFIGS[currentSlide];
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref to track latest state for event listeners and rapid navigation
  const stateRef = useRef({
    currentSlide,
    currentBeat,
    isTransitioning,
    slideConfig,
    isOverviewOpen,
  });

  useEffect(() => {
    stateRef.current = {
      currentSlide,
      currentBeat,
      isTransitioning,
      slideConfig,
      isOverviewOpen,
    };
  }, [currentSlide, currentBeat, isTransitioning, slideConfig, isOverviewOpen]);

  // Clean up any pending transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const startTransitionLock = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    stateRef.current.isTransitioning = true;
    setIsTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      transitionTimerRef.current = null;
      stateRef.current.isTransitioning = false;
      setIsTransitioning(false);
    }, getTransitionLockMs());
  }, []);

  // Jump to specific slide (interrupts active transition cleanly instead of dropping clicks/Home/End)
  const jumpToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSlides) {
        return;
      }

      stateRef.current.isOverviewOpen = false;
      setIsOverviewOpen(false);

      if (index === stateRef.current.currentSlide) {
        return;
      }

      const newDir: TransitionDirection =
        index > stateRef.current.currentSlide ? 'forward' : 'backward';

      stateRef.current.currentSlide = index;
      stateRef.current.currentBeat = 0;
      stateRef.current.slideConfig = SLIDE_CONFIGS[index];

      setDirection(newDir);
      setCurrentSlide(index);
      setCurrentBeat(0);
      startTransitionLock();
    },
    [totalSlides, startTransitionLock]
  );

  // Next action (advances beat, or advances slide)
  const next = useCallback(() => {
    const {
      currentSlide: curSlide,
      currentBeat: curBeat,
      slideConfig: cfg,
      isTransitioning: isTrans,
    } = stateRef.current;
    if (isTrans) return;

    if (curBeat < cfg.maxBeats - 1) {
      const nextBeatIndex = curBeat + 1;
      stateRef.current.currentBeat = nextBeatIndex;
      setCurrentBeat(nextBeatIndex);
    } else if (curSlide < totalSlides - 1) {
      const nextSlideIndex = curSlide + 1;
      stateRef.current.currentSlide = nextSlideIndex;
      stateRef.current.currentBeat = 0;
      stateRef.current.slideConfig = SLIDE_CONFIGS[nextSlideIndex];
      setDirection('forward');
      setCurrentSlide(nextSlideIndex);
      setCurrentBeat(0);
      startTransitionLock();
    }
  }, [totalSlides, startTransitionLock]);

  // Prev action (decreases beat, or retreats slide)
  const prev = useCallback(() => {
    const {
      currentSlide: curSlide,
      currentBeat: curBeat,
      isTransitioning: isTrans,
    } = stateRef.current;
    if (isTrans) return;

    if (curBeat > 0) {
      const prevBeatIndex = curBeat - 1;
      stateRef.current.currentBeat = prevBeatIndex;
      setCurrentBeat(prevBeatIndex);
    } else if (curSlide > 0) {
      const prevSlideIndex = curSlide - 1;
      const prevSlideConfig = SLIDE_CONFIGS[prevSlideIndex];
      const prevMaxBeat = prevSlideConfig.maxBeats - 1;
      stateRef.current.currentSlide = prevSlideIndex;
      stateRef.current.currentBeat = prevMaxBeat;
      stateRef.current.slideConfig = prevSlideConfig;
      setDirection('backward');
      setCurrentSlide(prevSlideIndex);
      setCurrentBeat(prevMaxBeat);
      startTransitionLock();
    }
  }, [startTransitionLock]);

  const nextBeat = useCallback(() => {
    const { currentBeat: curBeat, slideConfig: cfg } = stateRef.current;
    if (curBeat < cfg.maxBeats - 1) {
      const nextBeatIndex = curBeat + 1;
      stateRef.current.currentBeat = nextBeatIndex;
      setCurrentBeat(nextBeatIndex);
    }
  }, []);

  const prevBeat = useCallback(() => {
    if (stateRef.current.currentBeat > 0) {
      const prevBeatIndex = stateRef.current.currentBeat - 1;
      stateRef.current.currentBeat = prevBeatIndex;
      setCurrentBeat(prevBeatIndex);
    }
  }, []);

  const setBeat = useCallback((beatIndex: number) => {
    const cfg = stateRef.current.slideConfig;
    if (beatIndex >= 0 && beatIndex < cfg.maxBeats) {
      stateRef.current.currentBeat = beatIndex;
      setCurrentBeat(beatIndex);
    }
  }, []);

  const toggleOverview = useCallback(() => {
    setIsOverviewOpen((prevOpen) => {
      const nextOpen = !prevOpen;
      stateRef.current.isOverviewOpen = nextOpen;
      return nextOpen;
    });
  }, []);

  const closeOverview = useCallback(() => {
    stateRef.current.isOverviewOpen = false;
    setIsOverviewOpen(false);
  }, []);

  // Rely solely on fullscreenchange event listener (never optimistic state writes)
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay((prevAuto) => !prevAuto);
  }, []);

  // Sync fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tagName = (e.target as HTMLElement | null)?.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        return;
      }

      const overviewOpen = stateRef.current.isOverviewOpen;

      switch (e.code) {
        case 'ArrowRight':
        case 'Space':
          if (overviewOpen) return;
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          if (overviewOpen) return;
          e.preventDefault();
          prev();
          break;
        case 'Home':
          if (overviewOpen) return;
          e.preventDefault();
          jumpToSlide(0);
          break;
        case 'End':
          if (overviewOpen) return;
          e.preventDefault();
          jumpToSlide(totalSlides - 1);
          break;
        case 'KeyF':
          if (overviewOpen) return;
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyO':
          e.preventDefault();
          toggleOverview();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [next, prev, jumpToSlide, toggleFullscreen, toggleOverview, totalSlides]);

  return {
    currentSlide,
    currentBeat,
    direction,
    isOverviewOpen,
    isFullscreen,
    isAutoPlay,
    isTransitioning,
    totalSlides,
    slideConfig,
    next,
    prev,
    jumpToSlide,
    setBeat,
    nextBeat,
    prevBeat,
    toggleOverview,
    closeOverview,
    toggleFullscreen,
    toggleAutoPlay,
  };
}
