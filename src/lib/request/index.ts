import { AxiosResponseHeaders, Method } from 'axios';
import { attach, createEffect, Effect, Store } from 'effector';

import { ApiError } from './error';
import { $baseServices, BaseServices } from './services';

export type Url<Data> = ((_params: Data) => string) | string;
type ResultMapper<Result, MappedResult = Result> = (_result: Result, _headers: AxiosResponseHeaders) => MappedResult;

export type RequestParams<Data, Result, MappedResult = Result> = {
  method: Method;
  query?: Record<string, string | number | null | void> | string;
  data?: Data;
  url: Url<Data>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  mapResult?: ResultMapper<Result, MappedResult>;
  service?: 'tsum';
};

export const baseRequestFx = attach({
  source: $baseServices as Store<BaseServices>,
  effect: (services, params: RequestParams<any, any>): Promise<any> => {
    const { query, url, mapResult, service = 'tsum', ...reqParams } = params;

    return services.api[service]({
      ...reqParams,
      headers: {
        'x-app-platform': 'must',
        ...reqParams.headers,
      },
      data: params.data,
      params: query,
      url: typeof url === 'string' ? url : url(params.data),
    }).then(result => (mapResult ? mapResult(result.data, result.headers as AxiosResponseHeaders) : result.data));
  },
}) as Effect<RequestParams<any, any>, any, any>;

export const createBaseRequest = <Params, Result, MappedResult = Result>({
  method,
  url,
  mapResult,
  service,
  headers,
}: {
  method: Method;
  url: Url<Params>;
  mapResult?: ResultMapper<Result, MappedResult>;
  service?: 'tsum';
  headers?: Record<string, string>;
}) =>
  createEffect<Omit<RequestParams<Params, Result, MappedResult>, 'method' | 'url' | 'service'>, MappedResult, ApiError>(
    params => baseRequestFx({ method, url, mapResult, service, headers, ...params }),
  );

export * from './error';
export * from './services';
export * from './type';