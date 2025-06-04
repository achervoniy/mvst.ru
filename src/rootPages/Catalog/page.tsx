'use client';

import { useUnit } from 'effector-react';
import { isEmpty, omit } from 'lodash-es';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { Breadcrumbs, DesktopFilters, Filters, ProductList, Sidebar } from '@/features/catalog';
import { CatalogSidebarWrapper } from '@/features/catalog/Templates';

import { Pagination, Responsive } from '@/ui/index';

import { catalogQuery } from './model';

import st from './styles.module.scss';

export function CatalogPage({ gender }: { gender?: 'w' | 'm' }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const data = useUnit(catalogQuery.$data);

  const categories = data?.filters?.category?.list ?? [];

  const queriesWithoutPage = useMemo(() => {
    const q = omit(Object.fromEntries(search.entries()), 'page');

    return isEmpty(!q) ? `?${new URLSearchParams(q)}` : '';
  }, [search]);
  console.log('data', data);
  return (
    <section className={st.catalogPage}>
      <div className={st.head}>
        <Breadcrumbs gender={gender} category={data?.category} />
      </div>

      {categories.length > 0 && (
        <CatalogSidebarWrapper>
          <Sidebar categories={categories} />
        </CatalogSidebarWrapper>
      )}

      {data?.filters && (
        <>
          <Responsive.TabletAndBelow>
            <Filters filters={data?.filters} />
          </Responsive.TabletAndBelow>
          <Responsive.Desktop className={st.filters}>
            <DesktopFilters filters={data?.filters} />
          </Responsive.Desktop>
        </>
      )}

      <ProductList products={data?.catalog?.list ?? []} className={st.catalog} nosidebar={categories.length === 0} />

      {data && (
        <div className={st.pagination}>
          <Pagination
            current={data.catalog.currentPage}
            total={data.catalog.total}
            pageSize={data.catalog.perPage}
            baseUrl={`${pathname}${queriesWithoutPage}`}
          />
        </div>
      )}
    </section>
  );
}
