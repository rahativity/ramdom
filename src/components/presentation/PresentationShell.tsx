import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { SlideNavigation } from './SlideNavigation';
import { SlideOverview } from './SlideOverview';
import type { PresentationState } from '../../types/presentation';

interface PresentationShellProps {
  presentation: PresentationState;
  children: React.ReactNode;
}

export const PresentationShell: React.FC<PresentationShellProps> = ({
  presentation,
  children,
}) => {
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
    toggleAutoPlay,
  } = presentation;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F8FAFF] flex flex-col justify-between select-none">
      {/* Decorative Organic Blue Backdrops from Reference Image */}
      <div 
        className="pointer-events-none absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#2868E8]/10 via-[#2868E8]/5 to-transparent blur-3xl opacity-70"
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -bottom-36 -left-28 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#2868E8]/8 via-[#2868E8]/3 to-transparent blur-3xl opacity-60"
        aria-hidden="true" 
      />

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-6 pb-2 shrink-0">
        <ProgressIndicator
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          currentBeat={currentBeat}
          maxBeats={slideConfig.maxBeats}
          onSelectSlide={jumpToSlide}
        />

        {/* Minimal top right icon shortcut for overview */}
        <div className="flex items-center gap-3">
          <SlideNavigation
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            currentBeat={currentBeat}
            maxBeats={slideConfig.maxBeats}
            isFullscreen={isFullscreen}
            isAutoPlay={isAutoPlay}
            onNext={next}
            onPrev={prev}
            onToggleFullscreen={toggleFullscreen}
            onToggleOverview={toggleOverview}
            onToggleAutoPlay={toggleAutoPlay}
            onResetBeat={() => setBeat(0)}
          />
        </div>
      </header>

      {/* Center 16:9 Presentation Stage Viewport */}
      <main className="relative z-10 flex-1 w-full h-full flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden">
        <div className="relative w-full h-full max-w-[1440px] max-h-[810px] aspect-[16/9] flex items-center justify-center">
          {children}
        </div>
      </main>

      {/* Slide Overview Modal */}
      <SlideOverview
        isOpen={isOverviewOpen}
        currentSlide={currentSlide}
        onSelectSlide={jumpToSlide}
        onClose={toggleOverview}
      />
    </div>
  );
};

