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
      return `/collection/${LOOK_SLUGS.men}`;

    case 'f':
      return `/collection/${LOOK_SLUGS.women}`;

    default:
      return `/collection/${LOOK_SLUGS.all}`;
  }
};

export function Banner({ gender }: Props) {
  return (
    <Link className={st.banner} href={getLink(gender)}>
      {gender === 'all' ? (
        <>
          <Image className={st.desktop} src={desktop} alt="" />

          <Image className={st.mobile} src={mobile} alt="" />
        </>
      ) : (
        <>
          <Image src={gender === 'f' ? w : m} alt="" />

          <div className={st.footer}>
            <Typography font="leading/h2" align="center">
              {gender === 'f' ? 'женская коллекция' : 'мужская коллекция'}
            </Typography>
            <Typography font="paragraph/regular" decoration="underline" align="center">
              Подробнее
            </Typography>
          </div>
        </>
      )}
    </Link>
  );
}