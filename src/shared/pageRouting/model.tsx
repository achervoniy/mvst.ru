import { createFactory } from '@withease/factories';
import { createEvent, sample, createStore, Event } from 'effector';

export type StartParams = {
  params: Record<string, string>;
  query: Record<string, string>;
  url: string | undefined;
};

type HookProps = {
  params?: string[];
  pageName?: string;
};

export function trace(name: string, hooks: ReturnType<typeof createHooks>) {
  if (process?.env?.NODE_ENV === 'development') {
    hooks.loaded.watch(() => {
      console.log(`[page-hooks-trace (loaded)]: ${name}`);
    });

    hooks.entered.watch(params => {
      console.log(`[page-hooks-trace (entered)]: ${name}`, params.url);
    });

    hooks.leaved.watch(() => {
      console.log(`[page-hooks-trace (leaved)]: ${name}`);
    });
  }
}

export const createHooks = createFactory(({ params = [], pageName }: HookProps) => {
  // TODO: по переходу параметры реально всегда есть
  // Иначе не нужны
  const $params = createStore<Omit<StartParams, 'ctrl'>>(null!);

  const enter = createEvent<StartParams>(...params);
  const entered = createEvent<StartParams>(...params);
  const leave = createEvent();
  const load = createEvent();

  $params.on(entered, (_, params) => params).reset(leave);

  const hooks = {
    entered: entered as Event<StartParams>,
    leaved: leave as Event<void>,
    loaded: load as Event<void>,
    $params,
    // Ивенты спрятанные под __ опасные потому что
    // Нам в 99% случаях их не придется вызывать (так же по типам они идут как EventCallable)
    // Вызываются они в строго ограниченных местах (тесты и непосредственно роутинг)
    // Для конечного пользователя (МЫ) эти ивенты не несут нагрузки
    // Для этого нужно использовать осмысленные ивенты выше (Event)
    // entered - факт того что зашли на страницу
    // leaved - факт того что покинули страницу
    // loaded - факт того страница загрузилась
    __: {
      load,
      enter,
      leave,
    },
  };

  sample({ clock: enter, target: entered });

  if (pageName) {
    trace(pageName, hooks);
  }

  return hooks;
});
