import { allSettled, fork, serialize } from 'effector';
import { redirect } from 'next/navigation';

import { declarePage } from '@/shared/pageRouting';

import { $redirect } from './Redirect';
import { $baseServices, createBaseServices } from './request';
import { pageStatusField } from './status';

type Props = {
  pageHooks: ReturnType<typeof declarePage>;
};

export type PageProps = { params: Record<string, string>; searchParams: Record<string, string> };

const baseServices = createBaseServices();

export function createRSC({ pageHooks }: Props) {
  return async ({ params, searchParams }: PageProps) => {
    const scope = fork({
      values: new Map().set($baseServices, baseServices),
    });

    await allSettled(pageHooks.__.enter, {
      scope,
      params: {
        url: '',
        query: searchParams,
        params,
      },
    });

    await allSettled(pageHooks.__.load, { scope });

    const values = serialize(scope, { ignore: [$baseServices] });

    return {
      values,
      onRedirected: scope.getState($redirect) ? () => redirect(scope.getState($redirect)?.to!) : undefined,
      is404: scope.getState(pageStatusField.$value) === 404,
    };
  };
}
