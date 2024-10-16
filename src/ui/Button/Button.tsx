import classNames from 'classnames';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

import st from './Button.module.scss';

type Props = {
  children: ReactNode;
  stretch?: boolean;
  filled?: boolean;
  outline?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ children, stretch, className, filled, outline, ...props }: Props) {
  return (
    <button
      {...props}
      className={classNames(st.btn, className, {
        [st.stretch]: stretch,
        [st.filled]: filled,
        [st.outline]: outline,
      })}
    >
      {children}
    </button>
  );
}
