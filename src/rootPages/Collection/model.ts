import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchLanding } from '@/shared/api';
import { LooksBlock, TextBlock } from '@/shared/api/catalog';
import { declarePage } from '@/shared/pageRouting';

import { createField } from '@/lib/createField';
import { pageStatusField } from '@/lib/status';

export const pageHooks = invoke(() => declarePage({ pageName: 'Collection' }));

type Version = 'v1' | 'v2';
// Для каруселей
export const versionField = invoke(() => createField<'v1' | 'v2'>('v2'));

export const landingQuery = createQuery({
  handler: async ({ slug }: { slug: string }) => {
    const rs = await fetchLanding({ data: { slug } });

    return rs;
  },
});

export const $collectionTitle = landingQuery.$data.map(data => data?.title ?? '');

export const $collectionText = landingQuery.$data.map(data => {
  const text = (data?.blocks?.find(block => block.type === 'text') ?? null) as TextBlock;

  return text;
});

export const $collectionLooks = landingQuery.$data.map(data => {
  const text = (data?.blocks?.find(block => block.type === 'looks') ?? null) as LooksBlock;

  return text;
});

sample({
  clock: pageHooks.entered,
  fn: ({ params, query }) => ({ slug: params.slug, page: query.page }),
  target: landingQuery.start,
});

sample({
  clock: pageHooks.entered,
  fn: params => (params.params.version ?? 'v1') as Version,
  target: versionField.change,
});

sample({ clock: landingQuery.finished.failure, fn: () => 404, target: pageStatusField.change });