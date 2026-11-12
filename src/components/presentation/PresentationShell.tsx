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
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 xl:px-10 pt-2 sm:pt-2.5 pb-1 shrink-0">
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

      {/* Full-Screen Presentation Stage Viewport (graceful scroll on small screens) */}
      <main className="relative z-10 flex-1 min-h-0 w-full flex items-start lg:items-stretch justify-center px-3 sm:px-5 lg:px-6 xl:px-8 pt-1 pb-2.5 sm:pb-3 lg:pb-4 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <div
          data-stage-shell="fullscreen"
          className="relative w-full h-full min-h-full lg:min-h-0 flex items-stretch justify-center"
        >
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
