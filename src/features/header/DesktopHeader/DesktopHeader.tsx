import Link from 'next/link';

import { Icon } from '@/ui/assets/Icon';

import { Nav } from '../Drawer/Drawer';

import st from './styles.module.scss';

type Props = {
  scrollIsDown: boolean;
};

export function DesktopHeader(_: Props) {
  return (
    <>
      <Link href="/" className={st.logo} aria-label="MVST">
        <Icon name="LogoFull" />
      </Link>
      <Nav />
    </>
  );
}
