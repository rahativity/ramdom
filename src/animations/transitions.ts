import gsap from 'gsap';
import type { TransitionType, TransitionDirection } from '../types/presentation';
import { motionConfig } from './motionConfig';

export function animateSlideTransition(
  container: HTMLElement,
  type: TransitionType,
  direction: TransitionDirection,
  onComplete?: () => void
): gsap.core.Timeline {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isForward = direction === 'forward';
  const sign = isForward ? 1 : -1;

  const tl = gsap.timeline({
    onComplete: () => {
      // Clear temporary inline styles to prevent styling conflicts
      gsap.set(container, { clearProps: 'filter,transform,clipPath' });
      onComplete?.();
    },
  });

  if (isReducedMotion) {
    tl.fromTo(
      container,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power1.out' }
    );
    return tl;
  }

  const { duration, ease } = motionConfig.transition;

  switch (type) {
    case 'horizontal-blur':
      // Fast directional slide with momentary motion blur
      tl.fromTo(
        container,
        {
          x: sign * 120,
          opacity: 0,
          filter: 'blur(6px)',
        },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: duration,
          ease: ease,
        }
      );
      break;

    case 'connected-zoom':
      // Zoom in/out spatial shift
      tl.fromTo(
        container,
        {
          scale: isForward ? 0.94 : 1.04,
          opacity: 0,
          y: sign * 20,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: duration * 1.1,
          ease: 'power3.out',
        }
      );
      break;

    case 'mask-reveal':
      // Controlled circle/clip-path reveal
      tl.fromTo(
        container,
        {
          opacity: 0,
          clipPath: isForward ? 'circle(10% at 70% 50%)' : 'circle(10% at 30% 50%)',
          scale: 0.98,
        },
        {
          opacity: 1,
          clipPath: 'circle(150% at 50% 50%)',
          scale: 1,
          duration: duration * 1.15,
          ease: 'power2.inOut',
        }
      );
      break;

    case 'directional-split':
      tl.fromTo(
        container,
        {
          y: sign * 35,
          opacity: 0,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: duration,
          ease: ease,
        }
      );
      break;

    case 'soft-fade':
      tl.fromTo(
        container,
        {
          opacity: 0,
          scale: 0.985,
        },
        {
          opacity: 1,
          scale: 1,
          duration: duration * 0.9,
          ease: 'power2.out',
        }
      );
      break;

    case 'soft-directional':
    default:
      tl.fromTo(
        container,
        {
          x: sign * 60,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: duration,
          ease: ease,
        }
      );
      break;
  }

  return tl;
}

