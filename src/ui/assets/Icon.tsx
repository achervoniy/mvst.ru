import { forwardRef } from 'react';

import { Icons } from './IconsSchema';

export type IconName = keyof typeof Icons;

type Props = React.ComponentPropsWithoutRef<'svg'> & {
  name: IconName;
  direction?: 'top' | 'left' | 'right' | 'bottom';
};

const rotateStyles = {
  bottom: 'rotate(90deg)',
  right: 'rotate(0deg)',
  top: 'rotate(-90deg)',
  left: 'rotate(180deg)',
};

// eslint-disable-next-line react/display-name
export const Icon = forwardRef<SVGSVGElement, Props>(({ name, direction, ...props }, ref) => {
  const CurrentIcon = Icons[name];
  const styles = direction ? { transform: rotateStyles[direction] } : {};

  if (CurrentIcon) {
    return <CurrentIcon {...props} ref={ref} style={styles} data-name={name} />;
  }

  return null;
});
