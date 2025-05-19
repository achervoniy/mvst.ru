import classNames from 'classnames';
import { ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import { useViewport } from '@/lib/useViewport';

import { Segment } from './Segment';

import st from './Segments.module.scss';

type InputProps = ComponentPropsWithoutRef<'input'>;
type RequiredInputPropsKeys = 'name' | 'onChange' | 'value';

type SegmentsProps = {
  options: {
    label: string;
    value: string;
  }[];
} & Omit<InputProps, RequiredInputPropsKeys> &
  Required<Pick<InputProps, RequiredInputPropsKeys>>;

const SEGMENTS_STYLES_SWITCH_NUMBER = 3;

export const Segments = forwardRef<HTMLDivElement, SegmentsProps>(
  ({ className, options, value: propsValue, ...props }, ref) => {
    const { device } = useViewport();
    const innerRef = useRef<HTMLDivElement>(null);
    const activeIndex = options.findIndex(option => option.value === propsValue);

    useImperativeHandle(ref, () => innerRef.current!, []);

    useLayoutEffect(() => {
      const updater = () => {
        const key = `label:nth-of-type(${activeIndex + 1})`;
        const element = innerRef.current?.querySelector(key) as HTMLElement;

        if (element) {
          innerRef.current?.style.setProperty('--highlight-width', `${element.offsetWidth}px`);
          innerRef.current?.style.setProperty('--highlight-x-pos', `${element.offsetLeft}px`);
        }
      };

      updater();
      window.addEventListener('resize', updater);

      return () => {
        window.removeEventListener('resize', updater);
      };
    }, [activeIndex, device]);

    return (
      <div className={classNames(st.Segments, className)} ref={innerRef}>
        {options.map(({ label, value }, index) => (
          <Segment
            {...props}
            key={value}
            id={`${props.name}-segment-${index}`}
            value={value}
            checked={propsValue === value}
            isSmall={options.length > SEGMENTS_STYLES_SWITCH_NUMBER}
          >
            {label}
          </Segment>
        ))}
      </div>
    );
  },
);
