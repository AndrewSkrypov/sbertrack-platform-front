import { useCallback, useEffect, useRef, useState } from 'react';

// Отслеживает прогресс (0..1) прохождения контейнера через viewport, пока
// он закреплён через position: sticky внутри более высокого родителя.
// Throttle через requestAnimationFrame, без голого scroll-listener'а —
// см. sticky-scroll паттерн в trek-landing-concept.html.
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  // Переводит окно на позицию скролла, соответствующую заданному прогрессу
  // (0..1) внутри контейнера — используется для клика по шагу в рельсе,
  // чтобы навигация работала не только скроллом, но и кликом.
  const scrollToProgress = useCallback((target: number) => {
    const node = ref.current;
    if (!node) return;
    const total = node.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const containerTop = node.getBoundingClientRect().top + window.scrollY;
    const clamped = Math.min(1, Math.max(0, target));
    window.scrollTo({ top: containerTop + total * clamped, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    function update() {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const total = node.offsetHeight - window.innerHeight;
      const next = total > 0 ? -rect.top / total : 0;
      setProgress(Math.min(1, Math.max(0, next)));
      ticking = false;
    }

    update();

    if (prefersReducedMotion) {
      return undefined;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress, scrollToProgress };
}
