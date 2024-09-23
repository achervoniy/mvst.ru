import classNames from 'classnames';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

import st from './Button.module.scss';

type Props = {
  children: ReactNode;
  stretch?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ children, stretch, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={classNames(st.btn, className, {
        [st.stretch]: stretch,
      })}
    >
      {children}
    </button>
  );
}
