import React from 'react';
import { X } from 'lucide-react';
import { SLIDE_CONFIGS } from '../../animations/motionConfig';
import { IconButton } from '../ui/IconButton';

interface SlideOverviewProps {
  isOpen: boolean;
  currentSlide: number;
  onSelectSlide: (index: number) => void;
  onClose: () => void;
}

export const SlideOverview: React.FC<SlideOverviewProps> = ({
  isOpen,
  currentSlide,
  onSelectSlide,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Slide Overview"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#102A50]/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[85vh] bg-[#F8FAFF] rounded-2xl border border-[#2868E8]/20 shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2868E8]/15 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-[#2868E8] tracking-widest uppercase">
              INDEX
            </span>
            <h2 className="text-xl font-bold font-heading text-[#102A50]">
              Presentation Slides
            </h2>
          </div>
          <IconButton
            icon={<X className="w-5 h-5" />}
            label="Close Overview"
            size="sm"
            onClick={onClose}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SLIDE_CONFIGS.map((slide, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  onSelectSlide(idx);
                  onClose();
                }}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-white border-[#2868E8] shadow-md ring-2 ring-[#2868E8]/20'
                    : 'bg-white/70 hover:bg-white border-[#2868E8]/15 hover:border-[#2868E8]/40 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-mono text-xs font-bold text-[#2868E8]">
                    {slide.slideNumber}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#2868E8] text-white">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-sm text-[#102A50] line-clamp-2 leading-snug mb-1">
                  {slide.title}
                </h3>
                {slide.subtitle && (
                  <p className="text-xs text-[#102A50]/60 line-clamp-1">
                    {slide.subtitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

