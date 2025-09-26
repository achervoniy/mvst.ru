import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import st from './styles.module.scss';

type Props = {
  link: string;
  title: string;
  images: { desktop: StaticImageData; mobile: StaticImageData };
};

export function StreamBanner({ link, title, images }: Props) {
  return (
    <Link className={st.StreamBanner} href={link}>
      <Image className={st.desktop} src={images.desktop} alt={title} quality={50} />
      <Image className={st.mobile} src={images.mobile} alt={title} quality={50} />
    </Link>
  );
}
