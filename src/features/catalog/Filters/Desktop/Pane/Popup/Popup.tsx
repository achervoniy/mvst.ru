import cn from 'classnames';
import { ReactNode, useCallback, ReactElement, forwardRef } from 'react';
import { Popover, ArrowContainer, PopoverState, PopoverAlign } from 'react-tiny-popover';

import { PopupMenu } from '@/ui/index';

import st from './styles.module.scss';

interface Props {
  closePopup: () => void;
  isOpen: boolean;
  children: ReactElement & ReactNode;
  tag: React.JSX.Element;
  menuClassName?: string;
  withArrow?: boolean;
  align?: PopoverAlign;
}

export const Popup = forwardRef<HTMLDivElement, Props>(
  ({ menuClassName, closePopup, isOpen, tag, children, withArrow, align = 'start' }, ref) => {
    const renderContent = useCallback(
      ({ position, childRect, popoverRect }: PopoverState) =>
        withArrow ? (
          <ArrowContainer
            position={position}
            childRect={childRect}
            popoverRect={popoverRect}
            arrowColor="white"
            arrowSize={12}
            arrowClassName={st.arrow}
          >
            <PopupMenu className={cn(menuClassName, st.popup)} ref={ref}>
              {children}
            </PopupMenu>
          </ArrowContainer>
        ) : (
          <PopupMenu className={cn(menuClassName, st.popup)} ref={ref}>
            {children}
          </PopupMenu>
        ),
      [children, menuClassName, ref, withArrow],
    );

    return (
      <Popover
        containerClassName={st.popupContainer}
        align={align}
        padding={6}
        positions={['bottom']}
        isOpen={isOpen}
        content={renderContent}
        onClickOutside={closePopup}
        clickOutsideCapture={false}
      >
        {tag}
      </Popover>
    );
  },
);
