import { EffectorNext } from '@effector/next';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Must',
  description: 'Must description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <EffectorNext>
        <body>{children}</body>
      </EffectorNext>
    </html>
  );
}
