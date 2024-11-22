import cn from 'classnames';
import Link from 'next/link';

import { Icon } from '@/ui/assets/Icon';

import { Nav } from '../Drawer/Drawer';

import st from './styles.module.scss';

type Props = {
  scrollIsDown: boolean;
};

export function DesktopHeader({ scrollIsDown }: Props) {
  return (
    <>
      <Link href="/" className={st.logo}>
        <Icon name="LogoFull" />
      </Link>

      <div className={st.navWrapper}>
        <Icon
          name="ShortLogo"
          className={cn(st.shortLogo, {
            [st.scrollIsDown]: scrollIsDown,
          })}
        />
        <Nav />
      </div>
    </>
  );
}