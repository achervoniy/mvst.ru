import Link from 'next/link';
import Drawer from 'react-modern-drawer';

import { usePopupState } from '@/lib/hooks';

import 'react-modern-drawer/dist/index.css';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

type Props = {
  popup: ReturnType<typeof usePopupState>;
};

export function MobileDrawer({ popup }: Props) {
  return (
    <Drawer open={popup.isOpen} onClose={popup.closePopup} direction="left" size="100vw" duration={200}>
      <ul className={st.nav}>
        <li>
          <Link href="/collection/must-lookbook" onClick={popup.closePopup}>
            <Typography font="paragraph/regular">Женская коллекция</Typography>
            <Icon name="ArrowRight" />
          </Link>
        </li>
        <li>
          <Link href="/collection/must-lookbook-men" onClick={popup.closePopup}>
            <Typography font="paragraph/regular">Мужская коллекция</Typography>
            <Icon name="ArrowRight" />
          </Link>
        </li>
        <li>
          <Typography font="paragraph/regular" onClick={popup.closePopup}>
            Наши бутики
          </Typography>
          <Icon name="ArrowRight" />
        </li>
      </ul>

      <div className={st.footer}>
        <Typography font="leading/h2" align="center" className={st.title}>
          Купить на сайте tsum.ru или в приложении ЦУМа
        </Typography>

        <div className={st.actions}>
          <a>
            <Typography font="paragraph/bold">Скачать приложение</Typography>
          </a>
          <a>
            <Typography font="paragraph/bold">Перейти на сайт</Typography>
          </a>
        </div>
      </div>
    </Drawer>
  );
}
