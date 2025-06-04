import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

import { InAppActions } from '@/shared/ui';

import { DOWNLOAD_APP_LINK } from '@/constants/runtimeConfig';

import { Typography } from '@/ui/index';

// @ts-ignore
import app from './MVST_desktop.png';

import st from './styles.module.scss';

export function CallToBuy() {
  return (
    <section className={st.callToBuy}>
      <Typography font="leading/h2" align="center" className={st.title}>
        Купить на сайте tsum.ru или в приложении ЦУМа
      </Typography>

      <div className={st.appWithQr}>
        <Image src={app} alt="" quality={50} />
        <QRCodeSVG
          value={DOWNLOAD_APP_LINK}
          className={st.qrCode}
          includeMargin={false}
          size={124 + 32}
          level="M"
          bgColor="#fff"
        />
      </div>

      <InAppActions downloadAppVisibility={false} className={st.inAppActions} />
    </section>
  );
}
