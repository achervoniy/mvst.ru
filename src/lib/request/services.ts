import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { createStore } from 'effector';

import { runtimeConfig } from '@/constants/runtimeConfig';

import { ApiError, toApiError } from './error';
import { BaseApiFailed } from './type';

export type BaseServices = {
  // cookies factory ?
  api: { tsum: AxiosInstance };
};

export const NETWORK_ERROR = 'NETWORK_ERROR';

const isNetworkError = (error: Error) => error?.message === 'Network Error';

export function withInterceptors(axios: AxiosInstance) {
  axios.interceptors.request.use(
    config => {
      return config;
    },
    // @ts-ignore
    (error: Error = {}) => {
      if (isNetworkError(error)) {
        const failure = new ApiError({
          code: NETWORK_ERROR,
          message: 'could not connect to server',
        });

        return Promise.reject({ ...failure });
      }

      return Promise.reject({ ...toApiError(error) });
    },
  );

  axios.interceptors.response.use(
    (response: AxiosResponse<unknown>) => {
      return response;
    },
    (error = {}) => {
      const response = error?.response;

      if (!response) {
        const failure = new ApiError({
          code: NETWORK_ERROR,
          message: error?.message,
        });

        return Promise.reject({ ...failure });
      }

      const errorResponse = response?.data as BaseApiFailed;

      return Promise.reject({ ...new ApiError(errorResponse) });
    },
  );

  return axios;
}

export function createBaseServices(): BaseServices {
  return {
    api: {
      tsum: withInterceptors(
        axios.create({
          baseURL: typeof window === 'undefined' ? runtimeConfig.SSR_API_DOMAIN : `//${runtimeConfig.API_DOMAIN}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      ),
    },
  };
}

export const $baseServices = createStore<BaseServices | null>(
  typeof window !== 'undefined' ? createBaseServices() : null,
);
