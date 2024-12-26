import { ReactNode } from 'react';
import { useStickyBox } from 'react-sticky-box';

import st from './styles.module.scss';

const HEADER_HEIGHT = 74;

export function CatalogSidebarWrapper({ children }: { children: ReactNode }) {
  const stickyRef = useStickyBox({
    offsetTop: HEADER_HEIGHT,
    offsetBottom: HEADER_HEIGHT,
  });

  return (
    <div className={st.sidebar} ref={stickyRef}>
      <aside className={st.box}>{children}</aside>
    </div>
  );
}
