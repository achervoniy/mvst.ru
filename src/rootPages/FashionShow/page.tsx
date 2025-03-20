'use client';

import { Typography } from '@/ui/index';

import { Video } from './Video';

import st from './styles.module.scss';

const VIDEO_SRC = 'https://rutube.ru/play/embed/49555172d5d235a92323e50cdb58ef70';

export function FashionShowPage() {
  return (
    <div className={st.page}>
      <Typography font="leading/display" align="center">
        TSUM Fashion Show
      </Typography>

      <Video src={VIDEO_SRC} />

      <Typography font="body/regular" align="center" className={st.description}>
        Время обновить гардероб к весне с новинками Dolce & Gabbana, Jil Sander, MVST, Valentino и других брендов ЦУМа.
        Нежные оттенки, мягкие материалы и интересные сочетания — главные герои нового сезона.
        <br />
        <br />
        Образы с новинками, представленными на TSUM Fashion Show в Малом театре, можно оценить в лукбуке.
      </Typography>
    </div>
  );
}
