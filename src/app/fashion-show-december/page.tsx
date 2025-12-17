import { EffectorNext } from '@effector/next';

import { FashionShowPage as Page } from '@/rootPages/FashionShow';
import { MainTemplate } from '@/shared/ui';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

export default async function FashionShowPage() {
  return (
    <EffectorNext>
      <MainTemplate header={<Header />} footer={<Footer />}>
        <Page
          videoSRC="https://vkvideo.ru/video_ext.php?oid=-41200683&id=456239652&hd=1&autoplay=1"
          title="MVST FW25/26"
          description={
            <>
              Безупречный крой, благородная палитра и драгоценные материалы — отличительные черты бренда MVST.
              <br />
              <br /> В женской и мужской коллекциях MVST FW25/26 — одежда, обувь и аксессуары для повседневного
              гардероба и элегантные наряды на выход.
            </>
          }
        />
      </MainTemplate>
    </EffectorNext>
  );
}
