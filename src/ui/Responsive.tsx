import { createMedia } from '@artsy/fresnel';
import { ReactNode } from 'react';

import { useViewport } from '@/lib/useViewport';

import { BREAKPOINTS } from './breakpoints';

// FROM_TSUM_APP

type Props = {
  className?: string;
  children: ReactNode;
};

const AppMedia = createMedia({
  breakpoints: BREAKPOINTS,
});

// Generate CSS to be injected into the head
export const mediaStyle = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;

const TabletAndBelow: React.FC<Props> = ({ children, className }) => {
  const { isViewportInitialized, isTabletAndBelow } = useViewport();

  if (isViewportInitialized && !isTabletAndBelow) {
    return null;
  }

  return (
    <Media className={className} between={['xxs', 'md']}>
      {children}
    </Media>
  );
};

const Desktop: React.FC<Props> = ({ children, className }) => {
  const { isViewportInitialized, isDesktop } = useViewport();

  if (isViewportInitialized && !isDesktop) {
    return null;
  }

  return (
    <Media className={className} greaterThan="sm">
      {children}
    </Media>
  );
};

export const Responsive = {
  Desktop,
  TabletAndBelow,
};
