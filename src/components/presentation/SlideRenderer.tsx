import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Slide01Welcome } from '../../slides/Slide01Welcome';
import { Slide02Overview } from '../../slides/Slide02Overview';
import { Slide03DataPath } from '../../slides/Slide03DataPath';
import { Slide04Controller } from '../../slides/Slide04Controller';
import { Slide05Comparison } from '../../slides/Slide05Comparison';
import { Slide06WorkingTogether } from '../../slides/Slide06WorkingTogether';
import { Slide07ThankYou } from '../../slides/Slide07ThankYou';
import { animateSlideTransition } from '../../animations/transitions';
import { SLIDE_CONFIGS } from '../../animations/motionConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { PresentationState } from '../../types/presentation';

interface SlideRendererProps {
  presentation: PresentationState;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ presentation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevSlideRef = useRef<number>(presentation.currentSlide);
  const prefersReducedMotion = useReducedMotion();

  const {
    currentSlide,
    currentBeat,
    direction,
    isAutoPlay,
    jumpToSlide,
    setBeat,
  } = presentation;

  const currentConfig = SLIDE_CONFIGS[currentSlide];
  const effectiveAutoPlay = isAutoPlay && !prefersReducedMotion;

  // Trigger transition animation on slide switch (150ms opacity fade when reduced motion is enabled)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slideChanged = prevSlideRef.current !== currentSlide;
    prevSlideRef.current = currentSlide;

    if (prefersReducedMotion) {
      if (!slideChanged) {
        gsap.set(container, { opacity: 1, clearProps: 'transform,filter,clipPath' });
        return;
      }

      const fadeTween = gsap.fromTo(
        container,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.15,
          ease: 'power1.out',
          clearProps: 'opacity,transform,filter,clipPath',
        }
      );

      return () => {
        fadeTween.kill();
        gsap.set(container, { opacity: 1, clearProps: 'transform,filter,clipPath' });
      };
    }

    const tl = animateSlideTransition(
      container,
      currentConfig.transitionType,
      direction
    );

    return () => {
      tl.kill();
      gsap.set(container, { clearProps: 'filter,transform,clipPath,opacity' });
    };
  }, [currentSlide, currentConfig.transitionType, direction, prefersReducedMotion]);

  const renderActiveSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide01Welcome onExplore={() => jumpToSlide(1)} />;
      case 1:
        return <Slide02Overview currentBeat={currentBeat} />;
      case 2:
        return <Slide03DataPath currentBeat={currentBeat} isAutoPlay={effectiveAutoPlay} />;
      case 3:
        return <Slide04Controller currentBeat={currentBeat} isAutoPlay={effectiveAutoPlay} />;
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
      className="w-full min-h-full lg:h-full relative flex items-center justify-center overflow-x-hidden lg:overflow-hidden"
    >
      {renderActiveSlide()}
    </div>
  );
};
