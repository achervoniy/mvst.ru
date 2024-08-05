import cn from 'classnames';

import { DOWNLOAD_APP_LINK, TSUM_SITE_LINK } from '@/constants/runtimeConfig';

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
        <a href={TSUM_SITE_LINK} target="_blank">
          <Typography font="paragraph/bold">Скачать приложение</Typography>
        </a>
      )}

      <a href={DOWNLOAD_APP_LINK} target="_blank">
        <Typography font="paragraph/bold">Перейти на сайт</Typography>
      </a>
    </div>
  );
}