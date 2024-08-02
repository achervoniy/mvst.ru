'use client';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { usePopupState } from '@/lib/hooks';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type Props = { className?: string };

const MobileDrawer = dynamic(() => import('./Drawer'), { ssr: false });

export function Header({ className }: Props) {
  const popup = usePopupState();

  return (
    <>
      <header className={cn(st.header, className)}>
        <Icon name={popup.isOpen ? 'CloseIcon' : 'NavIcon'} onClick={popup.togglePopup} />
        <Link href="/" className={st.logo}>
          <Icon name="LogoFull" />
        </Link>
      </header>

      <MobileDrawer popup={popup} />
    </>
  );
}
