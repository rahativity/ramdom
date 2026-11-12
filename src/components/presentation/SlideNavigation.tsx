import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  currentBeat: number;
  maxBeats: number;
  isFullscreen: boolean;
  isAutoPlay: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggleFullscreen: () => void;
  onToggleOverview: () => void;
  onToggleAutoPlay: () => void;
  onResetBeat: () => void;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlide,
  totalSlides,
  currentBeat,
  maxBeats,
  isFullscreen,
  isAutoPlay,
  onNext,
  onPrev,
  onToggleFullscreen,
  onToggleOverview,
  onToggleAutoPlay,
  onResetBeat,
}) => {
  const isFirst = currentSlide === 0 && currentBeat === 0;
  const isLast = currentSlide === totalSlides - 1 && currentBeat === maxBeats - 1;

  return (
    <nav
      aria-label="Presentation controls"
      className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full glass-panel border border-[#2868E8]/20 bg-white/80 backdrop-blur-md shadow-sm transition-opacity duration-300"
    >
      {/* Overview Button */}
      <IconButton
        icon={<Grid className="w-4 h-4" />}
        label="Slide Overview"
        size="sm"
        onClick={onToggleOverview}
      />

      {/* Auto Play Toggle */}
      <IconButton
        icon={isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        label={isAutoPlay ? 'Pause Auto Animation' : 'Play Auto Animation'}
        size="sm"
        active={isAutoPlay}
        onClick={onToggleAutoPlay}
      />

      {/* Replay current slide beat */}
      {maxBeats > 1 && (
        <IconButton
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          label="Replay current animation"
          size="sm"
          onClick={onResetBeat}
        />
      )}

      <div className="w-[1px] h-4 bg-[#102A50]/20 mx-0.5" aria-hidden="true" />

      {/* Prev Button */}
      <IconButton
        icon={<ChevronLeft className="w-4 h-4" />}
        label="Previous"
        size="sm"
        disabled={isFirst}
        onClick={onPrev}
        className={isFirst ? 'opacity-40 cursor-not-allowed hover:bg-white/80 hover:text-[#102A50]' : ''}
      />

      {/* Next Button */}
      <IconButton
        icon={<ChevronRight className="w-4 h-4" />}
        label="Next"
        size="sm"
        disabled={isLast}
        onClick={onNext}
        className={isLast ? 'opacity-40 cursor-not-allowed hover:bg-white/80 hover:text-[#102A50]' : ''}
      />

      <div className="w-[1px] h-4 bg-[#102A50]/20 mx-0.5" aria-hidden="true" />

      {/* Fullscreen Toggle */}
      <IconButton
        icon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        size="sm"
        onClick={onToggleFullscreen}
      />
    </nav>
  );
};
