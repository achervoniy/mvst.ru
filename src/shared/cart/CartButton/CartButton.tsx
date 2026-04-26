'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';

import { Icon } from '@/ui/assets/Icon';

import { $count, cartOpened } from '../model';
import { useHydrateCart } from '../useHydrateCart';

import st from './styles.module.scss';

type Props = { className?: string; compact?: boolean };

export function CartButton({ className, compact }: Props) {
  const [count, open] = useUnit([$count, cartOpened]);
  useHydrateCart();

  return (
    <button
      type="button"
      className={cn(st.btn, { [st.compact]: compact }, className)}
      onClick={() => open()}
      aria-label="Открыть корзину"
    >
      <Icon name="Bag" className={st.icon} />
      {count > 0 && <span className={st.badge}>{count > 9 ? '9+' : count}</span>}
    </button>
  );
}
