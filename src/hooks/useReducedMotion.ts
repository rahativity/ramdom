import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', callback);
    return () => {
      mediaQueryList.removeEventListener('change', callback);
    };
  }

  mediaQueryList.addListener(callback);
  return () => {
    mediaQueryList.removeListener(callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribes live to the user's `prefers-reduced-motion: reduce` media query.
 * Safe for SSR / non-DOM environments.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
