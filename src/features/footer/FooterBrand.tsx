'use client';

import { useEffect, useRef } from 'react';

import st from './styles.module.scss';

export function FooterBrand() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(st.visible);
        }
      },
      { threshold: 0.05 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={st.footerBrand}>
      <span className={st.footerBrandText}>MVST</span>
    </div>
  );
}
