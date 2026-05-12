'use client';

import { useBoutiques } from '@/shared/boutiques';

import st from './styles.module.scss';

export function Atelier() {
  const { boutiques, loading } = useBoutiques();
  const boutiqueCount = !loading && boutiques.length > 0 ? String(boutiques.length) : '6';

  const stats = [
    { num: '12', label: 'ателье\nв Москве и СПб' },
    { num: boutiqueCount, label: 'фирменных\nбутиков' },
    { num: '2018', label: 'год основания\nдома' },
    { num: '38', label: 'мастеров\nкройки и шитья' },
  ];

  return (
    <section className={st.atelier}>
      <div className={st.inner}>
        <span className={st.eyebrow}>наследие</span>
        <ul className={st.row}>
          {stats.map((s) => (
            <li key={s.label} className={st.item}>
              <strong className={st.num}>{s.num}</strong>
              <span className={st.label}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
