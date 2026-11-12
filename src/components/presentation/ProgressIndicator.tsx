import React from 'react';
import { SLIDE_CONFIGS } from '../../animations/motionConfig';

interface ProgressIndicatorProps {
  currentSlide: number;
  totalSlides: number;
  currentBeat?: number;
  maxBeats?: number;
  onSelectSlide?: (index: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentSlide,
  totalSlides,
  currentBeat = 0,
  maxBeats = 1,
  onSelectSlide,
}) => {
  const currentFormatted = String(currentSlide + 1).padStart(2, '0');
  const totalFormatted = String(totalSlides).padStart(2, '0');

  return (
    <div className="flex items-center gap-4 select-none">
      {/* Slide number and accent line matching reference */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs md:text-sm font-semibold tracking-wider text-[#102A50]/80">
          {currentFormatted} <span className="text-[#102A50]/30 font-normal">/</span> {totalFormatted}
        </span>
        <div className="w-8 md:w-12 h-[2px] bg-[#2868E8] rounded-full" />
      </div>

      {/* Discrete slide dots */}
      <div className="hidden sm:flex items-center gap-1.5 ml-2">
        {SLIDE_CONFIGS.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const isPassed = idx < currentSlide;
          return (
            <button
              key={slide.id}
              onClick={() => onSelectSlide?.(idx)}
              title={slide.title}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-6 bg-[#2868E8]'
                  : isPassed
                  ? 'w-2 bg-[#102A50]/30 hover:bg-[#102A50]/50'
                  : 'w-2 bg-[#102A50]/15 hover:bg-[#102A50]/30'
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Animation beat stages for slides with multi-step reveals (Slide 3 & 6) */}
      {maxBeats > 1 && (
        <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-[#2868E8]/20">
          <span className="text-[10px] font-mono uppercase text-[#2868E8] font-semibold tracking-widest mr-1">
            Stage
          </span>
          {Array.from({ length: maxBeats }).map((_, bIdx) => (
            <div
              key={bIdx}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                bIdx === currentBeat
                  ? 'bg-[#2868E8] ring-2 ring-[#2868E8]/30 scale-110'
                  : bIdx < currentBeat
                  ? 'bg-[#102A50]/40'
                  : 'bg-[#102A50]/15'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

