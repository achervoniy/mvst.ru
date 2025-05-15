import classNames from 'classnames';
import { ComponentPropsWithoutRef } from 'react';

import st from './Segment.module.scss';

type InputProps = ComponentPropsWithoutRef<'input'>;
type RequiredInputPropsKeys = 'value' | 'checked';

type SegmentProps = {
  isSmall?: boolean;
} & Omit<InputProps, RequiredInputPropsKeys> &
  Required<Pick<InputProps, RequiredInputPropsKeys>>;

export const Segment = ({ children, id, isSmall, ...props }: SegmentProps) => {
  return (
    <label
      className={classNames(st.label, {
        [st.label_small]: isSmall,
      })}
      htmlFor={id}
    >
      <input {...props} id={id} className={st.input} type="radio" />
      {children}
    </label>
  );
};
