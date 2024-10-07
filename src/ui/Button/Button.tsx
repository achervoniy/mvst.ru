import classNames from 'classnames';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

import st from './Button.module.scss';

type Props = {
  children: ReactNode;
  stretch?: boolean;
  filled?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ children, stretch, className, filled, ...props }: Props) {
  return (
    <button
      {...props}
      className={classNames(st.btn, className, {
        [st.stretch]: stretch,
        [st.filled]: filled,
      })}
    >
      {children}
    </button>
  );
}
