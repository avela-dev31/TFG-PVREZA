import { useEffect, useCallback, useState } from 'react';

export default function useScrollReveal(selector = '.reveal, .reveal-scale, .reveal-left, .reveal-right', threshold = 0.15) {
  const [container, setContainer] = useState(null);

  const refCallback = useCallback(node => {
    setContainer(node);
  }, []);

  useEffect(() => {
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    const observeNewElements = () => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    };

    observeNewElements();

    const mutation = new MutationObserver(observeNewElements);
    mutation.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [container, selector, threshold]);

  return refCallback;
}
