'use client';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import { declarePage } from './model';

type Props = {
  hooks: ReturnType<typeof declarePage>;
};

export function usePageLeaved({ hooks }: Props) {
  const leaved = useUnit(hooks.__.leave);

  useEffect(() => {
    return () => {
      leaved();
    };
  }, [leaved]);
}
