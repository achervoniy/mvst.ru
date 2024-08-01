import { createFactory } from '@withease/factories';
import { createEvent, createStore } from 'effector';

export type FieldType<T> = ReturnType<typeof createField<T>>;
export type FieldResult<T> = {
  value: T;
  onChange: (_arg0: T) => void;
};

export const createField = createFactory(<T>(initial: T) => {
  const $value = createStore<T>(initial);
  const change = createEvent<T>();
  const reset = createEvent<void>();

  $value.on(change, (_, next) => next).on(reset, () => initial);

  return {
    $value,
    change,
    reset,
    reinit: $value.reinit!,
    '@@unitShape': () => ({
      value: $value,
      onChange: change,
    }),
  };
});
