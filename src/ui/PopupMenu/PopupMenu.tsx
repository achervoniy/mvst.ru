import cn from 'classnames';
import { forwardRef, ReactNode, ComponentPropsWithoutRef } from 'react';
import { Icon } from '@/ui/assets/Icon';

import st from './style.module.scss';

interface Props extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  closePopup?: (_e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  title?: string;
  children?: ReactNode;
}

export const PopupMenu = forwardRef<HTMLDivElement, Props>(
  ({ className, children, title, closePopup, ...props }, ref) => {
    return (
      <div className={cn(st.container, className)} {...props} ref={ref}>
        {children}
      </div>
    );
  },
);
