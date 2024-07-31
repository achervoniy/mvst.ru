import { createEffect, createEvent, createStore, sample } from 'effector';

function delay() {
  return new Promise(rs => {
    setTimeout(() => {
      rs(true);
    }, 100);
  });
}

export const pageStarted = createEvent();

export const $status = createStore('initial');

const mainFx = createEffect(() => delay());

$status.on(mainFx.doneData, () => 'ready');

sample({ clock: pageStarted, target: mainFx });