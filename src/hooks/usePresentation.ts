import { useState, useEffect, useCallback, useRef } from 'react';
import { SLIDE_CONFIGS } from '../animations/motionConfig';
import type { TransitionDirection, PresentationState } from '../types/presentation';

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

  // Ref to track latest state for event listeners
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

  // Jump to specific slide (guarded against concurrent transitions)
  const jumpToSlide = useCallback((index: number) => {
    if (stateRef.current.isTransitioning) return;
    if (index < 0 || index >= totalSlides || index === stateRef.current.currentSlide) {
      return;
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    const newDir: TransitionDirection = index > stateRef.current.currentSlide ? 'forward' : 'backward';
    setDirection(newDir);
    setIsTransitioning(true);
    setCurrentSlide(index);
    setCurrentBeat(0);
    setIsOverviewOpen(false);

    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 750);
  }, [totalSlides]);

  // Next action (advances beat, or advances slide)
  const next = useCallback(() => {
    const { currentSlide: curSlide, currentBeat: curBeat, slideConfig: cfg, isTransitioning: isTrans } = stateRef.current;
    if (isTrans) return;

    if (curBeat < cfg.maxBeats - 1) {
      setCurrentBeat((b) => b + 1);
    } else if (curSlide < totalSlides - 1) {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      setDirection('forward');
      setIsTransitioning(true);
      setCurrentSlide((s) => s + 1);
      setCurrentBeat(0);
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 750);
    }
  }, [totalSlides]);

  // Prev action (decreases beat, or retreats slide)
  const prev = useCallback(() => {
    const { currentSlide: curSlide, currentBeat: curBeat, isTransitioning: isTrans } = stateRef.current;
    if (isTrans) return;

    if (curBeat > 0) {
      setCurrentBeat((b) => b - 1);
    } else if (curSlide > 0) {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      const prevSlideIndex = curSlide - 1;
      const prevSlideConfig = SLIDE_CONFIGS[prevSlideIndex];
      setDirection('backward');
      setIsTransitioning(true);
      setCurrentSlide(prevSlideIndex);
      setCurrentBeat(prevSlideConfig.maxBeats - 1);
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 750);
    }
  }, []);

  const nextBeat = useCallback(() => {
    const { currentBeat: curBeat, slideConfig: cfg } = stateRef.current;
    if (curBeat < cfg.maxBeats - 1) {
      setCurrentBeat((b) => b + 1);
    }
  }, []);

  const prevBeat = useCallback(() => {
    if (stateRef.current.currentBeat > 0) {
      setCurrentBeat((b) => b - 1);
    }
  }, []);

  const setBeat = useCallback((beatIndex: number) => {
    const cfg = stateRef.current.slideConfig;
    if (beatIndex >= 0 && beatIndex < cfg.maxBeats) {
      setCurrentBeat(beatIndex);
    }
  }, []);

  const toggleOverview = useCallback(() => {
    setIsOverviewOpen((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay((prev) => !prev);
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
      // Ignore when focusing input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'ArrowRight':
        case 'Space':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'Home':
          e.preventDefault();
          jumpToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          jumpToSlide(totalSlides - 1);
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyO':
          e.preventDefault();
          toggleOverview();
          break;
        case 'Escape':
          if (stateRef.current.isOverviewOpen) {
            e.preventDefault();
            setIsOverviewOpen(false);
          }
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
    toggleFullscreen,
    toggleAutoPlay,
  };
}
