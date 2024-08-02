import Image from 'next/image';

import { Typography } from '@/ui/index';

import f from './home-banner-f.jpg';
import m from './home-banner-m.jpg';

import st from './styles.module.scss';

type Props = {
  gender: 'f' | 'm';
};

export function Banner({ gender }: Props) {
  return (
    <div className={st.banner}>
      <Image src={gender === 'f' ? f : m} alt="" />

      <div className={st.footer}>
        <Typography font="leading/h2" align="center">
          {gender === 'f' ? 'женская коллекция' : 'мужская коллекция'}
        </Typography>
        <Typography font="paragraph/regular" decoration="underline" align="center">
          Подробнее
        </Typography>
      </div>
    </div>
  );
}