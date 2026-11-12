import { useEffect } from 'react';
import { PresentationShell } from './components/presentation/PresentationShell';
import { SlideRenderer } from './components/presentation/SlideRenderer';
import { usePresentation } from './hooks/usePresentation';

export function App() {
  const presentation = usePresentation();
  const { isAutoPlay, nextBeat, currentBeat, slideConfig, currentSlide } = presentation;

  // Auto-play progression through slide beats
  useEffect(() => {
    if (!isAutoPlay) return;
    if (slideConfig.maxBeats <= 1) return;
    if (currentBeat >= slideConfig.maxBeats - 1) return;

    // Advance to next beat after 2.4 seconds
    const timer = setTimeout(() => {
      nextBeat();
    }, 2400);

    return () => clearTimeout(timer);
  }, [isAutoPlay, currentBeat, slideConfig.maxBeats, nextBeat, currentSlide]);

  return (
    <PresentationShell presentation={presentation}>
      <SlideRenderer presentation={presentation} />
    </PresentationShell>
  );
}

export default App;
