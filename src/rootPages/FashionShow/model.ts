import { createQuery } from '@farfetched/core';
import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { fetchLanding } from '@/shared/api';
import { createHooks } from '@/shared/pageRouting';

export const pageHooks = invoke(() => createHooks({ pageName: 'FashionShow' }));

export const landingQuery = createQuery({
  handler: async ({ slug }: { slug: string }) => {
    const rs = await fetchLanding({ data: { slug } });

    return rs;
  },
});

sample({ clock: pageHooks.entered, fn: ({ params }) => ({ slug: params.slug }), target: landingQuery.start });