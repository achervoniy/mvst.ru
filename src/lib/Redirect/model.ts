import { createEvent, createStore } from 'effector';
import { debounce } from 'patronum';

type RedirectProps = { to: string; reloadDocument?: boolean; replace?: boolean };

// app что бы просто перезагрузить страницу
// И не думать о том нужно ли это делать
// Правило простое - если в ссылке есть apps -> ставим app
// Иначе будет стять main
// Передавать из apps в main ключ не нужно
// По умолчанию будет main
export const setRedirect = createEvent<RedirectProps | null>();
const redirectDebounced = debounce({ source: setRedirect, timeout: 100 });

export const $redirect = createStore<RedirectProps | null>(null);

$redirect.on(redirectDebounced, (_, to) => (typeof to === 'string' ? { to } : to));