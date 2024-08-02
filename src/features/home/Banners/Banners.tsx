import Image from 'next/image';
import Link from 'next/link';

import { Typography } from '@/ui/index';

// @ts-ignore
import f from './home-banner-f.jpg';
// @ts-ignore
import m from './home-banner-m.jpg';

import st from './styles.module.scss';

type Props = {
  gender: 'f' | 'm';
};

export function Banner({ gender }: Props) {
  return (
    <Link className={st.banner} href={gender === 'f' ? '/collection/must-lookbook' : '/collection/must-lookbook-men'}>
      <Image src={gender === 'f' ? f : m} alt="" />

      <div className={st.footer}>
        <Typography font="leading/h2" align="center">
          {gender === 'f' ? 'женская коллекция' : 'мужская коллекция'}
        </Typography>
        <Typography font="paragraph/regular" decoration="underline" align="center">
          Подробнее
        </Typography>
      </div>
    </Link>
  );
}