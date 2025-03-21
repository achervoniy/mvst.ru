import { useMemo } from 'react';

import { getVKSrc, getYTSrc, getRTSrc } from './utils';

import st from './styles.module.scss';

type Props = {
  src: string;
}

export function Video({ src }: Props)  {
  const link = useMemo(() => {
    const parsedUrl = new URL(src);
    const domain = parsedUrl.hostname;

    if (domain.includes('vk.com') || domain.includes('vk.ru')) {
      return getVKSrc(src);
    }

    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return getYTSrc(src);
    }

    if (domain.includes('rutube.ru')) {
      return getRTSrc(src);
    }

    return src;
  }, [src]);

  if (!link) {
    return null;
  }

  return (
    <div className={st.video}>
      <iframe className={st.videoMedia} src={link} title="video" frameBorder="0" allowFullScreen />
    </div>
  );
};
