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
  children?: ReactNode;
  className?: string;
  size?: 'medium' | 'normal';
  bold?: boolean;
  decoration?: 'underline' | 'none';
  onClick?: (_event: React.MouseEvent<Element, MouseEvent>) => void;
  font: BaseFont;
  align?: 'center' | 'left' | 'right';
  dangerouslySetInnerHTML?:
    | {
        __html: string | TrustedHTML;
      }
    | undefined;
  as?: 'p' | 'h1' | 'h2';
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
  dangerouslySetInnerHTML,
  as = 'p',
}: Props) {
  const props = {
    ...(onClick
      ? {
          onClick,
          role: 'presentation',
        }
      : {}),
    className: cn(st.typography, st[size], st[decoration], st[font.replace('/', '-')], align && st[align], className, {
      [st.bold]: bold,
    }),
    ...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : { children }),
  };

  switch (as) {
    case 'h1':
      return <h1 {...props} />;
    case 'h2':
      return <h1 {...props} />;
    default:
      return <p {...props} />;
  }
}
