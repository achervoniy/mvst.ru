import { Typography } from '@/ui/index';

import st from './styles.module.scss';

export function InAppActions() {
  return (
    <div className={st.actions}>
      <a>
        <Typography font="paragraph/bold">Скачать приложение</Typography>
      </a>
      <a>
        <Typography font="paragraph/bold">Перейти на сайт</Typography>
      </a>
    </div>
  );
}