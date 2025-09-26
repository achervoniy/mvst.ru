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
          videoSRC="https://vk.com/video_ext.php?oid=-41200683&id=456239639&autoplay=1"
          title="MVST FW25/26"
          description={
            <>
              Безупречный крой, благородная палитра оттенков и натуральные материалы — отличительные черты бренда MVST.
              <br />
              <br />
              Мужская и женская коллекции MVST FW25/26 включают блузы и брюки, рубашки и пиджаки, изделия из трикотажа,
              а также верхнюю одежду.
            </>
          }
        />
      </MainTemplate>
    </EffectorNext>
  );
}
