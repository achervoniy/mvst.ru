import Image from 'next/image';
import Link from 'next/link';

// @ts-ignore
import desktop from './home-banner-all-desktop.png';
// @ts-ignore
import mobile from './home-banner-all-mobile.png';

import st from './styles.module.scss';

type Props = {
  gender: 'f' | 'm';
};

export function Banner({ }: Props) {
  return (
    <Link
      className={st.banner}
      href={'/collection/must-web'}
      // href={gender === 'f' ? `/collection/${LOOK_SLUGS.women}` : `/collection/${LOOK_SLUGS.men}`}
    >
      <Image className={st.desktop} src={desktop} alt="" />

      <Image className={st.mobile} src={mobile} alt="" />

      {/*<div className={st.footer}>*/}
      {/*  <Typography font="leading/h2" align="center">*/}
      {/*    {gender === 'f' ? 'женская коллекция' : 'мужская коллекция'}*/}
      {/*  </Typography>*/}
      {/*  <Typography font="paragraph/regular" decoration="underline" align="center">*/}
      {/*    Подробнее*/}
      {/*  </Typography>*/}
      {/*</div>*/}
    </Link>
  );
}