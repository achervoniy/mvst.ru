import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Must',
  description: 'Must description',
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru">
      <EffectorNext>
        <body>{children}</body>
      </EffectorNext>
    </html>
  );
}
