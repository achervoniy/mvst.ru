import { Banner } from '@/features/home/Banners';

import st from './styles.module.scss';

export function CollectionBanners() {
  return (
    <div className={st.pair}>
      <Banner gender="f" />
      <Banner gender="m" />
    </div>
  );
}
