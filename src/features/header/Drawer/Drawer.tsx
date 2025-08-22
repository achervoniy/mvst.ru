import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

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

  return (
    <ul className={st.nav}>
      <li
        className={cn(st.item, {
          [st.active]: pathname === `/collection/${LOOK_SLUGS.all}`,
        })}
      >
        <Link href={`/collection/${LOOK_SLUGS.all}`} onClick={onLink}>
          <Typography font="paragraph/regular">Коллекция FW25-26</Typography>
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
      <li className={st.item}>
        <Link href="/#mvst" onClick={onLink}>
          <Typography font="paragraph/regular" onClick={onLink}>
            О бренде
          </Typography>
          <Icon name="ArrowRight" />
        </Link>
      </li>
    </ul>
  );
}

export function MobileDrawer({ popup }: Props) {
  return (
    <Drawer open={popup.isOpen} onClose={popup.closePopup} direction="left" size="100vw" duration={200}>
      <div className={st.drawer}>
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
