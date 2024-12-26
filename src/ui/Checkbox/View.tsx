import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';

import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

// FROM_TSUM_APP
type Props = {
  checked: boolean;
  value?: string | number | readonly string[];
  name?: string;
  disabled?: boolean;
  className?: string;
  stretch?: boolean;
  children?: ReactNode;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (_event: React.MouseEvent<HTMLInputElement>) => void;
  colored?: boolean;
  rounded?: boolean;
  isRadio?: boolean;
  checkedAsIcon?: boolean;
};

type Ref = HTMLInputElement;

export const Checkbox = forwardRef<Ref, Props>(({ checkedAsIcon = true, ...props }, ref) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label
    className={classNames(st.wrap, props.className, {
      [st.stretch]: props.stretch,
      [st.disabled]: props.disabled,
      [st.checkedAsIcon]: checkedAsIcon,
    })}
  >
    <input
      ref={ref}
      type={props.isRadio ? 'radio' : 'checkbox'}
      checked={props.checked}
      disabled={props.disabled}
      name={props.name}
      value={props.value}
      className={classNames(st.input)}
      onChange={props.onChange}
      onClick={props.onClick}
    />

    <span
      data-control
      className={classNames(st.control, {
        [st.colored]: props.colored,
        [st.rounded]: props.rounded,
      })}
    >
      <Icon name="CheckedIcon" className={st.icon} />
    </span>

    <span className={st.title} data-title>
      {props.children}
    </span>
  </label>
));
