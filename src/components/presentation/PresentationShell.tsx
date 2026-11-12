import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { SlideNavigation } from './SlideNavigation';
import { SlideOverview } from './SlideOverview';
import { AnimatedBackground } from './AnimatedBackground';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { PresentationState } from '../../types/presentation';

interface PresentationShellProps {
  presentation: PresentationState;
  children: React.ReactNode;
}

export const PresentationShell: React.FC<PresentationShellProps> = ({
  presentation,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const {
    currentSlide,
    totalSlides,
    currentBeat,
    slideConfig,
    isFullscreen,
    isAutoPlay,
    isOverviewOpen,
    next,
    prev,
    jumpToSlide,
    setBeat,
    toggleFullscreen,
    toggleOverview,
    closeOverview,
    toggleAutoPlay,
  } = presentation;

  const effectiveAutoPlay = isAutoPlay && !prefersReducedMotion;

  return (
    <div className="relative w-full h-dvh min-h-dvh overflow-hidden bg-[#F8FAFF] flex flex-col justify-between select-none">
      {/* Static Minimal Keynote Corner Accents */}
      <AnimatedBackground currentSlide={currentSlide} />

      {/* Top Header Bar */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-8 lg:px-10 pt-3 sm:pt-4 pb-1 shrink-0">
        <ProgressIndicator
          currentSlide={currentSlide}
          totalSlides={totalSlides}
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <SlideNavigation
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            currentBeat={currentBeat}
            maxBeats={slideConfig.maxBeats}
            isFullscreen={isFullscreen}
            isAutoPlay={effectiveAutoPlay}
            onNext={next}
            onPrev={prev}
            onToggleFullscreen={toggleFullscreen}
            onToggleOverview={toggleOverview}
            onToggleAutoPlay={toggleAutoPlay}
            onResetBeat={() => setBeat(0)}
          />
        </div>
      </header>

      {/* Center 16:9 Presentation Stage Viewport (graceful scroll on small screens) */}
      <main className="relative z-10 flex-1 min-h-0 w-full flex items-start lg:items-center justify-center px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-3 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <div className="relative w-full min-h-full lg:min-h-0 lg:h-full max-w-[1680px] lg:max-h-[960px] flex items-center justify-center">
          {children}
        </div>
      </main>

      {/* Native <dialog> Slide Overview Modal */}
      <SlideOverview
        isOpen={isOverviewOpen}
        currentSlide={currentSlide}
        onSelectSlide={jumpToSlide}
        onClose={closeOverview}
      />
    </div>
  );
};
