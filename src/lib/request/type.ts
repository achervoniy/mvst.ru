export type BaseApiResponse<Payload> = {
  code: string;
  payload: Payload;
  message: 'Success' | string;
};

export type BaseApiFailed = {
  code: string;
  error: string[];
  message: string;
};
