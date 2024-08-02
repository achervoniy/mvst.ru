import { Icon } from '@/ui/assets/Icon';

import st from './styles.module.scss';

export function Header() {
  return (
    <div className={st.header}>
      <Icon name="NavIcon" />
      <Icon name="LogoFull" className={st.logo} />
    </div>
  );
}
