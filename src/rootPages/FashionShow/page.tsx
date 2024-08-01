'use client';

import { useUnit } from 'effector-react';
import Link from 'next/link';

import { landingQuery, pageHooks } from './model';

export function FashionShow() {
  const landing = useUnit(landingQuery);
  const params = useUnit(pageHooks.$params);

  if (!landing.data) {
    return <p>нет данных :(</p>;
  }

  return (
    <div>
      <h1>{landing.data.title}</h1>
      <h3>{landing.data.slug}</h3>
      <pre>
        <code>{JSON.stringify(params)}</code>
      </pre>
      <Link href="/">to home</Link>
    </div>
  );
}
