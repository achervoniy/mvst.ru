import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchLanding } from '@/shared/api';
import { createHooks } from '@/shared/pageRouting';

import { pageStatusField } from '@/lib/status';

export const pageHooks = invoke(() => createHooks({ pageName: 'Collection' }));

export const landingQuery = createQuery({
  handler: async ({ slug }: { slug: string }) => {
    const rs = await fetchLanding({ data: { slug } });

    return rs;
  },
});

sample({ clock: pageHooks.entered, fn: ({ params }) => ({ slug: params.slug }), target: landingQuery.start });
sample({ clock: landingQuery.finished.failure, fn: () => 404, target: pageStatusField.change });