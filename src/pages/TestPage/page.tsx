'use client';

import { useUnit } from 'effector-react';

import { $status } from './model';

export function TestPage() {
  const status = useUnit($status);

  return <p>Test page status {status}</p>;
}
