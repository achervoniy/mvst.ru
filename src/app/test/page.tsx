import { EffectorNext } from '@effector/next';
import { allSettled, fork, serialize } from 'effector';

import { TestPage as Page, pageStarted } from '@/pages/TestPage';

export default async function TestPage() {
  const scope = fork();

  await allSettled(pageStarted, { scope });

  const values = serialize(scope);

  return (
    <EffectorNext values={values}>
      <Page />
    </EffectorNext>
  );
}
