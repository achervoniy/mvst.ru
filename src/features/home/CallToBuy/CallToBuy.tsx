import Image from 'next/image';
// import { QRCodeSVG } from 'qrcode.react';

import { InAppActions } from '@/shared/ui';

// import { DOWNLOAD_APP_LINK } from '@/constants/runtimeConfig';

import { Responsive, Typography } from '@/ui/index';

// @ts-ignore
import app from './MVST_desktop.png';
// @ts-ignore
import appMobile from './MVST_mobile.png';

import st from './styles.module.scss';

export function CallToBuy() {
  return (
    <section className={st.callToBuy}>
      <Typography font="leading/h2" align="center" className={st.title}>
        Купить на сайте tsum.ru или в приложении ЦУМа
      </Typography>

      <div className={st.appWithQr}>
        <Responsive.Desktop>
          <Image src={app} alt="" quality={50} />
        </Responsive.Desktop>
        <Responsive.TabletAndBelow>
          <Image src={appMobile} alt="" quality={50} />
        </Responsive.TabletAndBelow>
        {/* <QRCodeSVG
          value={DOWNLOAD_APP_LINK}
          className={st.qrCode}
          includeMargin={false}
          size={124 + 32}
          level="M"
          bgColor="#fff"
        /> */}
      </div>

      <InAppActions downloadAppVisibility={false} className={st.inAppActions} />
    </section>
  );
}
