import Link from 'next/link';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

export function ByAppointment() {
  return (
    <section className={st.appt}>
      <div className={st.col}>
        <span className={st.eyebrow}>персональный сервис</span>
        <h2 className={st.title}>
          частная <em>примерка</em>
          <br />в бутике
        </h2>
        <p className={st.text}>
          приватный шопинг с бренд-консультантом mvst в любом из бутиков.
          подбор образа, подгонка по фигуре, сопровождение —
          по предварительной записи.
        </p>
        <Link href="/contacts" className={st.cta} prefetch={false}>
          <span>записаться на примерку</span>
          <Icon name="ArrowRight" />
        </Link>
      </div>

      <div className={st.frame} aria-hidden>
        <span className={st.frameNote}>by appointment only</span>
        <span className={st.frameMeta}>mvst · private fitting</span>
      </div>
    </section>
  );
}
