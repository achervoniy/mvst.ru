import { createBaseRequest } from '@/lib/request';

export const fetchLanding = createBaseRequest<{ slug: string }, any>({
  method: 'GET',
  url: ({ slug }) => `/v1/landing/${slug}`,
});
