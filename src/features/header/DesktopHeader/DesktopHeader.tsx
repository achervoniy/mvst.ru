import Link from 'next/link';

import { Icon } from '@/ui/assets/Icon';

import { Nav } from '../Drawer/Drawer';

import st from './styles.module.scss';

export function DesktopHeader() {
  return (
    <>
      <Link href="/" className={st.logo}>
        <Icon name="LogoFull" />
      </Link>

      <Nav />
    </>
  );
}