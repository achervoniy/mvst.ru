import { createBaseRequest } from '@/lib/request';

import { LooksResponse } from './catalog';

export const fetchLanding = createBaseRequest<{ slug: string }, LooksResponse>({
  method: 'GET',
  url: ({ slug }) => `/v1/landing/${slug}`,
});
