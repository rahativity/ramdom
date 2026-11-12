import React, { useEffect, useId, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Sync declarative `isOpen` prop with native top-layer <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Progressive fallback for browsers lacking `closedby="any"` support (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (event: PointerEvent): boolean => {
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    let pressedOutside = false;

    const handlePointerDown = (event: PointerEvent) => {
      pressedOutside = isOutside(event);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (pressedOutside && isOutside(event)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);

    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleDialogClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = '';
    }
    if (isOpenRef.current) {
      onClose();
    }
  };

  const handleDialogCancel = () => {
    // Let native Esc cancellation proceed to close and reconcile state in onClose
  };

  const handleRequestClose = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    onClose();
  };

  const handleSelectSlide = (index: number) => {
    onSelectSlide(index);
    handleRequestClose();
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby={headingId}
      onClose={handleDialogClose}
      onCancel={handleDialogCancel}
      className="overview-dialog m-auto w-[calc(100%-2rem)] max-w-5xl max-h-[85dvh] bg-[#F8FAFF] rounded-2xl border border-[#2868E8]/20 shadow-2xl p-0 overflow-hidden flex-col text-[#102A50]"
    >
      <div className="p-6 sm:p-8 overflow-y-auto flex-1">
        <div className="flex items-center justify-between pb-4 border-b border-[#2868E8]/15 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-[#1B54C7] tracking-widest uppercase">
              INDEX
            </span>
            <h2
              id={headingId}
              className="text-xl font-bold font-heading text-[#102A50]"
            >
              Presentation Slides
            </h2>
          </div>
          <IconButton
            icon={<X className="w-5 h-5" />}
            label="Close Overview"
            size="sm"
            onClick={handleRequestClose}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SLIDE_CONFIGS.map((slide, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-white border-[#2868E8] shadow-md ring-2 ring-[#2868E8]/20'
                    : 'bg-white/85 hover:bg-white border-[#2868E8]/15 hover:border-[#2868E8]/40 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-mono text-xs font-bold text-[#1B54C7]">
                    {slide.slideNumber}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1B54C7] text-white">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-sm text-[#102A50] line-clamp-2 leading-snug mb-1">
                  {slide.title}
                </h3>
                {slide.subtitle && (
                  <p className="text-xs text-[#102A50]/75 line-clamp-1">
                    {slide.subtitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </dialog>
  );
};
