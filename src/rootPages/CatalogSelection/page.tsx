'use client';

import { useUnit } from 'effector-react';
import { isEmpty, omit } from 'es-toolkit/compat';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { BreadcrumbsSelection, DesktopFilters, MobileFilters, ProductList, Sidebar } from '@/features/catalog';
import { CatalogSidebarWrapper } from '@/features/catalog/Templates';

import { Pagination, Responsive } from '@/ui/index';

import { catalogQuery } from './model';

import st from './styles.module.scss';

export function CatalogSelection() {
  const { selection } = useParams() as { selection: string };
  const pathname = usePathname();
  const search = useSearchParams();
  const data = useUnit(catalogQuery.$data);
  const categories = data?.filters?.category?.list ?? [];

  const queriesWithoutPage = useMemo(() => {
    const q = omit(Object.fromEntries(search.entries()), 'page') as Record<string, string>;

    return !isEmpty(q) ? `?${new URLSearchParams(q)}` : '';
  }, [search]);

  return (
    <section className={st.catalogPage}>
      <div className={st.head}>
        <BreadcrumbsSelection category={data?.category} selection={data?.selectionInfo} />
      </div>

      {categories.length > 0 && (
        <CatalogSidebarWrapper>
          <Sidebar categories={categories} selection={selection} />
        </CatalogSidebarWrapper>
      )}

      {data?.filters && (
        <>
          <MobileFilters filters={data?.filters} />
          <Responsive.Desktop className={st.filters}>
            <DesktopFilters filters={data?.filters} />
          </Responsive.Desktop>
        </>
      )}

      <ProductList products={data?.catalog?.list ?? []} className={st.catalog} noSidebar={categories.length === 0} />

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
