'use client';
import cn from 'classnames';
import Link from 'next/link';

import { usePopupState } from '@/lib/hooks';

import { Icon } from '@/ui/assets/Icon';

import { MobileDrawer } from './Drawer';

import st from './styles.module.scss';

type Props = { className?: string };

export function Header({ className }: Props) {
  const popup = usePopupState();

  return (
    <>
      <header className={cn(st.header, className)}>
        <Icon name="NavIcon" onClick={popup.togglePopup} />
        <Link href="/" className={st.logo}>
          <Icon name="LogoFull" />
        </Link>
      </header>

      <MobileDrawer popup={popup} />
    </>
  );
}
