import cn from 'classnames';
import { useUnit } from 'effector-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

import { $count, cartOpened } from '@/shared/cart';
import { InAppActions } from '@/shared/ui';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { usePopupState } from '@/lib/hooks';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type Props = {
  popup: ReturnType<typeof usePopupState>;
};

export function Nav({ onLink }: { onLink?: () => void }) {
  const pathname = usePathname();
  const [count, openCart] = useUnit([$count, cartOpened]);

  return (
    <ul className={st.nav}>
      <li
        className={cn(st.item, {
          [st.active]: pathname === `/collection/${LOOK_SLUGS.all}`,
        })}
      >
        <Link href={`/collection/${LOOK_SLUGS.all}`} onClick={onLink}>
          <Typography font="paragraph/regular">Коллекция SS26</Typography>
          <Icon name="ArrowRight" />
        </Link>
      </li>

      <li
        className={cn(st.item, {
          [st.active]: pathname.startsWith('/catalog/women'),
        })}
      >
        <Link href="/catalog/women" onClick={onLink}>
          <Typography font="paragraph/regular">Женщинам</Typography>
          <Icon name="ArrowRight" />
        </Link>
      </li>
      <li
        className={cn(st.item, {
          [st.active]: pathname.startsWith('/catalog/men'),
        })}
      >
        <Link href="/catalog/men" onClick={onLink}>
          <Typography font="paragraph/regular">Мужчинам</Typography>
          <Icon name="ArrowRight" />
        </Link>
      </li>

      <li
        className={cn(st.item, {
          [st.active]: pathname.startsWith('/contacts'),
        })}
      >
        <Link href="/contacts" onClick={onLink}>
          <Typography font="paragraph/regular" onClick={onLink}>
            Бутики
          </Typography>
          <Icon name="ArrowRight" />
        </Link>
      </li>
      <li
        className={cn(st.item, {
          [st.active]: pathname.startsWith('/about'),
        })}
      >
        <Link href="/about" onClick={onLink}>
          <Typography font="paragraph/regular" onClick={onLink}>
            О бренде
          </Typography>
          <Icon name="ArrowRight" />
        </Link>
      </li>
      <li className={cn(st.item, st.cartItem)}>
        <button
          type="button"
          className={st.cartItemBtn}
          onClick={() => {
            onLink?.();
            openCart();
          }}
        >
          <Typography font="paragraph/regular">
            Корзина{count > 0 ? <span className={st.cartCount}>{count > 9 ? '9+' : count}</span> : null}
          </Typography>
          <Icon name="ArrowRight" />
        </button>
      </li>
    </ul>
  );
}

export function MobileDrawer({ popup }: Props) {
  useEffect(() => {
    if (!popup.isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [popup.isOpen]);

  return (
    <Drawer
      open={popup.isOpen}
      onClose={popup.closePopup}
      direction="left"
      size="100vw"
      duration={200}
      lockBackgroundScroll
      zIndex={500}
    >
      <div className={st.drawer}>
        <div className={st.head}>
          <Link href="/" onClick={popup.closePopup} className={st.headLogo} aria-label="MVST">
            <Icon name="LogoFull" />
          </Link>
          <button
            type="button"
            className={st.headClose}
            onClick={popup.closePopup}
            aria-label="Закрыть"
          >
            <Icon name="CloseIcon" />
          </button>
        </div>

        <Nav onLink={popup.closePopup} />

        <div className={st.footer}>
          <Typography font="leading/h2" align="center" className={st.title}>
            Купить на сайте tsum.ru или в приложении ЦУМа
          </Typography>

          <InAppActions />
        </div>
      </div>
    </Drawer>
  );
}
