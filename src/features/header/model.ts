import { createEvent, createStore } from 'effector';

type Counter = { current: number; length: number } | null;

export const $collectionCounter = createStore<Counter>(null);
export const changeCollectionCounter = createEvent<Counter>();

$collectionCounter.on(changeCollectionCounter, (_, counter) => counter);