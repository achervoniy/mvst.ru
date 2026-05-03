## Что меняем

Файл: `src/components/site/ProductShelf.tsx` — обе полки («С чем носить», «Вы недавно смотрели») рендерятся через этот компонент, поэтому правок в одном месте достаточно.

### 1. Фон карточки сливается с фоном страницы (как в каталоге)

Сейчас у контейнера фото жёстко прописан `bg-cream` + `overflow-hidden`, поэтому видна «карточка». В каталожном `ProductCard` фона нет вообще: фото ложится через `mix-blend-multiply` прямо на фон страницы.

- Убираем `bg-cream` и `overflow-hidden` с обёртки изображения.
- Увеличиваем внутренний паддинг изображения на десктопе до `md:p-6` (как в каталоге), на мобиле оставляем `p-2`.

### 2. Адаптив — плитка 2×N вместо горизонтального свайпа

Внутри `ProductShelf` рендерим два варианта:

- **Mobile** (`md:hidden`): `grid grid-cols-2 gap-x-3 gap-y-6`, ограничиваем до 6 товаров (3 ряда), карточки занимают всю ширину колонки.
- **Desktop** (`hidden md:block`): остаётся текущий горизонтальный скроллер со стрелками.

`ShelfCard` получает проп `variant: "scroll" | "grid"`:
- `scroll` — текущая фиксированная ширина `w-[44vw] sm:w-[32vw] md:w-[220px] lg:w-[240px]`.
- `grid` — `w-full`, без `shrink-0` и `snap-start`.

Заодно убираем боковой «вынос» `-mx-6 md:mx-0` и внутренний `px-6` у скроллера — на мобиле он больше не нужен (там грид), а на десктопе и так был не нужен.

### 3. Отступы над/под полками

Сейчас секция: `py-12 md:py-16`, заголовок `mb-6 md:mb-8`. Между двумя полками подряд получается двойной воздух.

Уменьшаем:
- Секция: `pt-6 md:pt-10 pb-10 md:pb-14` (верхний отступ заметно меньше, особенно на мобиле — над «С чем носить» сразу после блока «Возврат» сейчас слишком пусто, см. скриншот пользователя).
- Заголовок→контент: `mb-4 md:mb-6`.

Разделитель `border-t hairline` над всем блоком в `product.$slug.tsx` остаётся — он отделяет рекомендации от карточки.

## Технические детали

```tsx
// ProductShelf.tsx — упрощённо
<section className="px-6 md:px-12 pt-6 md:pt-10 pb-10 md:pb-14">
  <div className="flex items-end justify-between mb-4 md:mb-6 gap-4">
    <h2>…</h2>
    <div className="hidden md:flex …">{/* стрелки */}</div>
  </div>

  {/* mobile */}
  <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:hidden">
    {items.slice(0, 6).map(i => <ShelfCard variant="grid" … />)}
  </div>

  {/* desktop */}
  <div className="hidden md:block">
    <div ref={scrollerRef} className="flex gap-4 overflow-x-auto snap-x …">
      {items.map(i => <ShelfCard variant="scroll" … />)}
    </div>
  </div>
</section>
```

`ShelfCard` — добавляем `variant`, удаляем `bg-cream`/`overflow-hidden`, паддинг фото `p-2 md:p-6`.

Файл `src/routes/product.$slug.tsx` править не нужно.
