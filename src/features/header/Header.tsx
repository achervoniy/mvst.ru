'use client';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { usePopupState } from '@/lib/hooks';
import { useViewport } from '@/lib/useViewport';

import { Responsive } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { DesktopHeader } from './DesktopHeader';

import st from './styles.module.scss';

type Props = { className?: string };

const MobileDrawer = dynamic(() => import('./Drawer'), { ssr: false });

export function Header({ className }: Props) {
  const popup = usePopupState();
  const { isTabletAndBelow } = useViewport();

  return (
    <>
      <header className={cn(st.header, className)}>
        <Responsive.TabletAndBelow className={st.responsive}>
          <div className={st.content}>
            <Icon name={popup.isOpen ? 'CloseIcon' : 'NavIcon'} onClick={popup.togglePopup} />
            <Link href="/" className={st.logo}>
              <Icon name="LogoFull" />
            </Link>
          </div>
        </Responsive.TabletAndBelow>

        <Responsive.Desktop className={st.responsive}>
          <div className={st.content}>
            <DesktopHeader />
          </div>
        </Responsive.Desktop>
      </header>

      {isTabletAndBelow && <MobileDrawer popup={popup} />}
    </>
  );
}
