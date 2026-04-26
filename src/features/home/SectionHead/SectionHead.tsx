import cn from 'classnames';
import Link from 'next/link';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

type Props = {
  eyebrow?: string;
  title: string;
  linkHref?: string;
  linkText?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHead({
  eyebrow,
  title,
  linkHref,
  linkText,
  align = 'center',
  className,
}: Props) {
  return (
    <div className={cn(st.head, st[align], className)}>
      {eyebrow && (
        <Typography font="body/bold" className={st.eyebrow}>
          {eyebrow}
        </Typography>
      )}
      <Typography font="leading/h2" as="h2" className={st.title}>
        {title}
      </Typography>
      {linkHref && linkText && (
        <Link href={linkHref} className={st.link} prefetch={false}>
          <Typography font="paragraph/regular" decoration="underline" className={st.linkText}>
            {linkText}
          </Typography>
        </Link>
      )}
    </div>
  );
}
