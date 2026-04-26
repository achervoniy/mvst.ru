'use client';
import cn from 'classnames';
import { useUnit } from 'effector-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usePopupState, useScrollEventListener } from '@/lib/hooks';
import { useViewport } from '@/lib/useViewport';

import { CartButton, CartDrawer } from '@/shared/cart';

import { BREAKPOINTS } from '@/ui/breakpoints';
import { Responsive, Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import { DesktopHeader } from './DesktopHeader';
import { $collectionCounter } from './model';

import st from './styles.module.scss';

type Props = { className?: string };

const MobileDrawer = dynamic(() => import('./Drawer'), { ssr: false });

export function Header({ className }: Props) {
  const popup = usePopupState();
  const { isTabletAndBelow, isDesktop } = useViewport();
  const pathname = usePathname();
  const counter = useUnit($collectionCounter);
  const [scrollIsDown, setScrollIsDown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isCollectionPage = pathname.startsWith('/collection/');

  const backIcon = isCollectionPage ? 'ArrowBack' : popup.isOpen ? 'CloseIcon' : 'NavIcon';

  const onIconClicked = (e: MouseEvent) => {
    if (isCollectionPage) {
      return;
    }

    e.preventDefault();
    popup.togglePopup();
  };

  useScrollEventListener((_, { scrollDirection }) => {
    if (window.innerWidth >= BREAKPOINTS.md && isDesktop) {
      setScrollIsDown(scrollDirection === 'down');
    }
  });

  useEffect(() => {
    const onScroll = () => {
      // trigger only after the promo strip is already out of view —
      // prevents content reflow / jump as glass kicks in
      setIsScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {!isCollectionPage && (
        <div className={st.promoStrip} role="region" aria-label="Promo">
          <span>Бесплатная доставка по Москве</span>
          <span className={st.promoDivider} />
          <span>Запись на частную примерку в бутик</span>
          <span className={st.promoDivider} />
          <span>Весна — лето 2026</span>
        </div>
      )}
      <header
        className={cn(st.header, className, {
          [st.isCollectionPage]: isCollectionPage,
          [st.glass]: isScrolled,
        })}
      >
        <div className={st.bar}>
          <Responsive.TabletAndBelow className={st.responsive}>
            <div className={st.content}>
              {/* @ts-ignore */}
              <Link href="/" onClick={onIconClicked}>
                <Icon name={backIcon} />
              </Link>
              <Link href="/" className={st.logo}>
                <Icon name="LogoFull" />
              </Link>

              {counter && isCollectionPage && (
                <Typography font="paragraph/regular" className={st.counter}>
                  {counter.current} / {counter.length}
                </Typography>
              )}

              {!isCollectionPage && <CartButton className={st.cartBtn} compact />}
            </div>
          </Responsive.TabletAndBelow>

          <Responsive.Desktop className={st.responsive}>
            <div className={st.content}>
              <DesktopHeader scrollIsDown={scrollIsDown} />
            </div>
          </Responsive.Desktop>
        </div>
      </header>

      {isTabletAndBelow && <MobileDrawer popup={popup} />}
      <CartDrawer />
    </>
  );
}
