import Image from 'next/image';

import { InAppActions } from '@/shared/ui';

import { Typography } from '@/ui/index';

import app from './app.jpg';

import st from './styles.module.scss';

export function CallToBuy() {
  return (
    <section className={st.callToBuy}>
      <Typography font="leading/h2" align="center" className={st.title}>
        Купить на сайте tsum.ru или в приложении ЦУМа
      </Typography>

      <Image src={app} alt="" />
      <InAppActions />
    </section>
  );
}
