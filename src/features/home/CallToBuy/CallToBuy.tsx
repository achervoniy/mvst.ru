import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

import { InAppActions } from '@/shared/ui';

import { Responsive, Typography } from '@/ui/index';

// @ts-ignore
import app from './app.png';

import st from './styles.module.scss';

export function CallToBuy() {
  return (
    <>
      <Responsive.TabletAndBelow className={st.responsive}>
        <section className={st.callToBuy}>
          <Typography font="leading/h2" align="center" className={st.title}>
            Купить на сайте tsum.ru или в приложении ЦУМа
          </Typography>

          <Image src={app} alt="" />
          <InAppActions />
        </section>
      </Responsive.TabletAndBelow>

      <Responsive.Desktop className={st.responsive}>
        <section className={st.callToBuy}>
          <Typography font="leading/h2" align="center" className={st.title}>
            Купить на сайте tsum.ru или в приложении ЦУМа
          </Typography>

          <div className={st.appWithQr}>
            <Image src={app} alt="" />

            <QRCodeSVG value="https://tsum.ru/" className={st.qrCode} includeMargin size={124} />
          </div>

          <InAppActions downloadAppVisibility={false} className={st.inAppActions} />
        </section>
      </Responsive.Desktop>
    </>
  );
}
