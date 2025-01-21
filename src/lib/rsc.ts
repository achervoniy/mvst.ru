import { allSettled, fork, serialize } from 'effector';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { declarePage } from '@/shared/pageRouting';

import { $redirect } from './Redirect';
import { $baseServices, createBaseServices } from './request';
import { pageStatusField } from './status';

type Props = {
  pageHooks: ReturnType<typeof declarePage>;
};

export type PageProps<Params = Record<string, string>> = {
  params: Params;
  searchParams: Record<string, string>;
  updateInitialState?: (_state: Map<any, any>) => Map<any, any>;
};

export const baseServices = createBaseServices();

export function createRSC({ pageHooks }: Props) {
  return async ({ params, searchParams, updateInitialState }: PageProps) => {
    const headerList = headers();
    const pathname = headerList.get('x-current-path');

    const scope = fork({
      values: (updateInitialState ? updateInitialState(new Map()) : new Map()).set($baseServices, baseServices),
    });

    await allSettled(pageHooks.__.enter, {
      scope,
      params: {
        url: pathname ?? '',
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
