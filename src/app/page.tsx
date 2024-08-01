import Link from 'next/link';

import { Button } from '@/ui/index';

import styles from './page.module.css';

const slug = ['must-lookbook', 'must-lookbook-men'];

export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {slug.map(s => (
          <Link href={`/fashion/${s}`} key={s}>
            to {s}
          </Link>
        ))}
      </div>
      <Button />
    </main>
  );
}
