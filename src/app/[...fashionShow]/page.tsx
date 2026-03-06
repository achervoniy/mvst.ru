import { EffectorNext } from '@effector/next';
import { notFound } from 'next/navigation';

import { FashionShowPage as Page } from '@/rootPages/FashionShow';
import { MainTemplate } from '@/shared/ui';

import { FS_SCHEME } from '@/constants/fsScheme';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';

import { PageProps } from '@/lib/rsc';

export default function DynamicFashionShow({ params }: PageProps<{ fashionShow: string | string[] }>) {
  const path = Array.isArray(params.fashionShow) ? params.fashionShow.join('/') : params.fashionShow;

  const FASHION_SHOW_PREFIX = 'fashion-show-';

  if (!path.startsWith(FASHION_SHOW_PREFIX)) {
    return notFound();
  }

  const fs = path.slice(FASHION_SHOW_PREFIX.length) as keyof typeof FS_SCHEME;
  const activeFS = FS_SCHEME[fs];

  if (!fs || fs.includes('/') || !activeFS) {
    return notFound();
  }

  return (
    <EffectorNext>
      <MainTemplate header={<Header />} footer={<Footer />}>
        <Page videoSRC={activeFS.video} title={activeFS.title} description={activeFS.description} />
      </MainTemplate>
    </EffectorNext>
  );
}
