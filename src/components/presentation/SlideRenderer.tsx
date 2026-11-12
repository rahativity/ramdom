import React, { useRef, useEffect } from 'react';
import { Slide01Welcome } from '../../slides/Slide01Welcome';
import { Slide02Overview } from '../../slides/Slide02Overview';
import { Slide03DataPath } from '../../slides/Slide03DataPath';
import { Slide04Controller } from '../../slides/Slide04Controller';
import { Slide05Comparison } from '../../slides/Slide05Comparison';
import { Slide06WorkingTogether } from '../../slides/Slide06WorkingTogether';
import { Slide07ThankYou } from '../../slides/Slide07ThankYou';
import { animateSlideTransition } from '../../animations/transitions';
import { SLIDE_CONFIGS } from '../../animations/motionConfig';
import type { PresentationState } from '../../types/presentation';

interface SlideRendererProps {
  presentation: PresentationState;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ presentation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentSlide,
    currentBeat,
    direction,
    isAutoPlay,
    jumpToSlide,
    setBeat,
  } = presentation;

  const currentConfig = SLIDE_CONFIGS[currentSlide];

  // Trigger transition animation on slide switch
  useEffect(() => {
    if (!containerRef.current) return;
    const tl = animateSlideTransition(
      containerRef.current,
      currentConfig.transitionType,
      direction
    );

    return () => {
      tl.kill();
    };
  }, [currentSlide, currentConfig.transitionType, direction]);

  const renderActiveSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide01Welcome onExplore={() => jumpToSlide(1)} />;
      case 1:
        return <Slide02Overview currentBeat={currentBeat} />;
      case 2:
        return <Slide03DataPath currentBeat={currentBeat} isAutoPlay={isAutoPlay} />;
      case 3:
        return <Slide04Controller currentBeat={currentBeat} isAutoPlay={isAutoPlay} />;
      case 4:
        return <Slide05Comparison currentBeat={currentBeat} />;
      case 5:
        return (
          <Slide06WorkingTogether
            currentBeat={currentBeat}
            onSetBeat={(beat) => setBeat(beat)}
          />
        );
      case 6:
        return <Slide07ThankYou onRestart={() => jumpToSlide(0)} />;
      default:
        return <Slide01Welcome onExplore={() => jumpToSlide(1)} />;
    }
  };

  return (
    <div
      ref={containerRef}
      key={currentSlide}
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
    >
      {renderActiveSlide()}
    </div>
  );
};

