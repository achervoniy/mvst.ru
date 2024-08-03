import cn from 'classnames';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

type Props = {
  downloadAppVisibility?: boolean;
  className?: string;
};

export function InAppActions({ downloadAppVisibility = true, className }: Props) {
  return (
    <div className={cn(st.actions, className)}>
      {downloadAppVisibility && (
        <a>
          <Typography font="paragraph/bold">Скачать приложение</Typography>
        </a>
      )}

      <a>
        <Typography font="paragraph/bold">Перейти на сайт</Typography>
      </a>
    </div>
  );
}