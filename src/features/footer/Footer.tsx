import { useMemo } from 'react';

import { TG_LINK } from '@/constants/runtimeConfig';

import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

export function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className={st.footer}>
      <Typography font="paragraph/regular" align="center" className={st.private}>
        Все права защищены {currentYear}
      </Typography>
      {/* <Typography font="paragraph/regular" align="center" decoration="underline">
        Политика конфиденциальности
      </Typography> */}
      <Typography font="paragraph/regular" align="center">
        Мы в социальных сетях
      </Typography>

      <div className={st.socials}>
        {/* <Icon name="VkIcon" /> */}
        <a href={TG_LINK}>
          <Icon name="TgIcon" />
        </a>
      </div>
    </div>
  );
}
