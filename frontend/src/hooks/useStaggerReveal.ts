import { useEffect, useRef, useState } from 'react';

// Появление карточек по одной через IntersectionObserver со stagger-задержкой.
// Возвращает набор индексов, которые уже пересекли viewport хотя бы раз.
export function useStaggerReveal(count: number, staggerMs = 90) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisible(new Set(Array.from({ length: count }, (_, i) => i)));
      return undefined;
    }

    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal-index]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.revealIndex);
          setTimeout(() => {
            setVisible((prev) => new Set(prev).add(index));
          }, index * staggerMs);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [count, staggerMs]);

  return { containerRef, visible };
}
