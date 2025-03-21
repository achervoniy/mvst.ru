'use client';

import { Typography } from '@/ui/index';

import { Video } from './Video';

import st from './styles.module.scss';

const VIDEO_SRC = 'https://vkvideo.ru/video_ext.php?oid=-41200683&id=456239608&hd=1&autoplay=1';

export function FashionShowPage() {
  return (
    <div className={st.page}>
      <Typography font="leading/display" align="center">
        MVST SS25
      </Typography>

      <Video src={VIDEO_SRC} />

      <Typography font="body/regular" align="center" className={st.description}>
        Безупречный крой, благородная палитра оттенков и натуральные материалы — отличительные черты бренда MVST.
        <br />
        <br />
        Мужская и женская коллекции MVST SS25 включают блузы и брюки, рубашки и пиджаки, лёгкие платья, изделия из
        тонкого трикотажа, а также верхнюю одежду.
      </Typography>
    </div>
  );
}
