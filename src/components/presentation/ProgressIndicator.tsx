import React from 'react';

interface ProgressIndicatorProps {
  currentSlide: number;
  totalSlides: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentSlide,
  totalSlides,
}) => {
  const currentFormatted = String(currentSlide + 1).padStart(2, '0');
  const totalFormatted = String(totalSlides).padStart(2, '0');

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none">
      <span className="font-mono text-xs md:text-sm font-semibold tracking-wider text-[#102A50]">
        {currentFormatted}{' '}
        <span className="text-[#102A50]/70 font-normal">/</span>{' '}
        {totalFormatted}
      </span>
      <div
        className="w-8 sm:w-10 md:w-12 h-[2px] bg-[#2868E8] rounded-full"
        aria-hidden="true"
      />
    </div>
  );
};
