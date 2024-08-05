import { useEffect, useRef } from 'react';

type Handler = (_event: Event, _options: { scrollDirection?: 'up' | 'down' }) => (() => void) | void;

export const useScrollEventListener = (handler: Handler, additionalOffset = 0) => {
  const savedHandler = useRef<Handler>(handler);

  if (savedHandler.current !== handler) {
    savedHandler.current = handler;
  }

  useEffect(() => {
    let lastScroll = 0;
    let unsubScribe: ((() => void) | void) | null = null;
    let prevDir = '';

    const eventListener = (event: Event) => {
      // Элементы из-за которых зависит позиция элементов
      // На пример хедера
      // Или фильтров (офсеты)
      const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;

      const currentScroll = window.scrollY;
      const scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
      // const scrollDownTooFast = scrollY - lastScroll > diff;
      // const scrollUpTooFast = scrollY - lastScroll < -diff;

      const shouldToggleHeader = prevDir !== scrollDirection;
      const hasOffset = currentScroll > headerHeight + additionalOffset;

      if (shouldToggleHeader && (scrollDirection === 'up' || hasOffset)) {
        prevDir = scrollDirection;
        unsubScribe = savedHandler.current(event, { scrollDirection });
      }

      lastScroll = currentScroll > 0 ? currentScroll : 0;
    };

    window.addEventListener('scroll', eventListener);

    return () => {
      window.removeEventListener('scroll', eventListener);
      unsubScribe?.();
    };
  }, [additionalOffset]);
};
