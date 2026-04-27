import Image from 'next/image';
import Link from 'next/link';

import { Typography } from '@/ui';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

// @ts-ignore
import desktop from './home-banner-all-desktop.png';
// @ts-ignore
import mobile from './home-banner-all-mobile.png';
// @ts-ignore
import w from './home-banner-f.jpg';
// @ts-ignore
import m from './home-banner-m.jpg';

import st from './styles.module.scss';

type Props = {
  gender: 'f' | 'm' | 'all';
};

const getLink = (gender: string) => {
  switch (gender) {
    case 'm':
      return '/catalog/men';

    case 'f':
      return '/catalog/women';

    default:
      return `/collection/${LOOK_SLUGS.all}`;
  }
};

export function Banner({ gender }: Props) {
  return (
    <Link className={st.banner} href={getLink(gender)}>
      {gender === 'all' ? (
        <>
          <Image className={st.desktop} src={desktop} alt="" quality={50} />
          <Image className={st.mobile} src={mobile} alt="" quality={50} />
        </>
      ) : (
        <>
          <div className={st.imageWrap}>
            <Image src={gender === 'f' ? w : m} alt="" />
          </div>

          <div className={st.footer}>
            <Typography font="leading/h2" align="center">
              {gender === 'f' ? 'женская коллекция' : 'мужская коллекция'}
            </Typography>
            <span className={st.link}>Подробнее →</span>
          </div>
        </>
      )}
    </Link>
  );
}