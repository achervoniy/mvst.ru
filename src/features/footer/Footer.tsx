import { Typography } from '@/ui/index';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

export function Footer() {
  return (
    <div className={st.footer}>
      <Typography font="paragraph/regular" align="center" className={st.private}>
        © Все права защищены 2024
      </Typography>
      <Typography font="paragraph/regular" align="center" decoration="underline">
        Политика конфиденциальности
      </Typography>
      <Typography font="paragraph/regular" align="center">
        Мы в социальных сетях
      </Typography>

      <div className={st.socials}>
        <Icon name="VkIcon" />
        <Icon name="TgIcon" />
      </div>
    </div>
  );
}
