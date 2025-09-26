'use client';

import { Typography } from '@/ui/index';

import { Video } from './Video';

import st from './styles.module.scss';

type Props = {
  title: string;
  description: JSX.Element;
  videoSRC: string;
};

export function FashionShowPage({ title, description, videoSRC }: Props) {
  return (
    <div className={st.page}>
      <Typography font="leading/display" align="center">
        {title}
      </Typography>

      <Video src={videoSRC} />

      <Typography font="body/regular" align="center" className={st.description}>
        {description}
      </Typography>
    </div>
  );
}
