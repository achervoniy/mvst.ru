import cn from 'classnames';
import React, { ReactNode } from 'react';

import st from './styles.module.scss';

export type BaseFont =
  | 'leading/display'
  | 'leading/h1'
  | 'leading/h2'
  | 'paragraph/bold'
  | 'paragraph/regular'
  | 'body/bold'
  | 'body/regular';

type Props = {
  children: ReactNode;
  className?: string;
  size?: 'medium' | 'normal';
  bold?: boolean;
  decoration?: 'underline' | 'none';
  onClick?: (_event: React.MouseEvent<Element, MouseEvent>) => void;
  font: BaseFont;
  align?: 'center' | 'left' | 'right';
};

export function Typography({
  children,
  className,
  size = 'normal',
  bold,
  decoration = 'none',
  onClick,
  font,
  align,
}: Props) {
  return (
    <p
      {...(onClick
        ? {
            onClick,
            role: 'presentation',
          }
        : {})}
      className={cn(
        st.typography,
        st[size],
        st[decoration],
        st[font.replace('/', '-')],
        align && st[align],
        className,
        {
          [st.bold]: bold,
        },
      )}
    >
      {children}
    </p>
  );
}
