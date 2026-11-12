import { useEffect } from 'react';
import { PresentationShell } from './components/presentation/PresentationShell';
import { SlideRenderer } from './components/presentation/SlideRenderer';
import { usePresentation } from './hooks/usePresentation';
import { useReducedMotion } from './hooks/useReducedMotion';

export function App() {
  const presentation = usePresentation();
  const { isAutoPlay, nextBeat, currentBeat, slideConfig, currentSlide } = presentation;
  const prefersReducedMotion = useReducedMotion();

  // Auto-play progression through slide beats (paused when reduced motion is preferred)
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!isAutoPlay) return;
    if (slideConfig.maxBeats <= 1) return;
    if (currentBeat >= slideConfig.maxBeats - 1) return;

    const timer = setTimeout(() => {
      nextBeat();
    }, 2400);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, isAutoPlay, currentBeat, slideConfig.maxBeats, nextBeat, currentSlide]);

  return (
    <PresentationShell presentation={presentation}>
      <SlideRenderer presentation={presentation} />
    </PresentationShell>
  );
}

export default App;
