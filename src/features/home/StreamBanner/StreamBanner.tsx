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
    <Link className={st.StreamBanner} href={link} aria-label={title}>
      <div className={st.imageWrap}>
        <Image className={st.desktop} src={images.desktop} alt={title} quality={75} priority />
        <Image className={st.mobile} src={images.mobile} alt={title} quality={75} priority />
      </div>
      <div className={st.scrollHint} aria-hidden>
        <span className={st.scrollLine} />
      </div>
    </Link>
  );
}
