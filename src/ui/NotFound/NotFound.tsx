import Link from 'next/link';

import { Typography } from '../Typography';

import st from './styles.module.scss';

export function NotFound() {
  return (
    <div className={st.notFound}>
      <Typography font="leading/h1" as="h1">
        СТРАНИЦА НЕ НАЙДЕНА
      </Typography>
      <Typography font="leading/display" className={st.code}>
        404
      </Typography>
      <Typography font="paragraph/regular" align="center">
        Вы перешли по неправильной ссылке или страница была удалена.
      </Typography>
      <Link href="/">Вернуться на главную</Link>
    </div>
  );
}