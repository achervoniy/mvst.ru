'use client';

import { useUnit } from 'effector-react';
import { usePathname } from 'next/navigation';

import { Filters, ProductList } from '@/features/catalog';

import { Typography, Pagination } from '@/ui/index';

import { catalogQuery } from './model';

import st from './styles.module.scss';

type Props = {
  pageTitle: string;
};

export function CatalogPage({ pageTitle }: Props) {
  const pathname = usePathname();
  const result = useUnit(catalogQuery);

  return (
    <section>
      <div className={st.head}>
        <Typography as="h1" font="leading/h2">
          {pageTitle}
        </Typography>
      </div>

      {result.data?.filters && <Filters filters={result.data?.filters} />}

      <ProductList products={result.data?.catalog?.list ?? []} className={st.catalog} />

      {result.data && (
        <div className={st.pagination}>
          <Pagination
            current={result.data.catalog.currentPage}
            total={result.data.catalog.total}
            pageSize={result.data.catalog.perPage}
            baseUrl={pathname}
          />
        </div>
      )}
    </section>
  );
}
