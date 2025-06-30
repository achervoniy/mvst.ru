import cn from 'classnames';
import Link from 'next/link';
import { useMemo, ComponentPropsWithoutRef } from 'react';

import { Icon } from '../assets/Icon';

import { PaginationPage } from './types';

import st from './styles.module.scss';

export const DOTS = '…' as const;

interface Props extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  current: number;
  total: number;
  pageSize: number;
  baseUrl?: string;
  pageRender?: React.FC<{
    className: string;
    onClick: (_event: React.MouseEvent<Element, MouseEvent>) => void;
    key: string | number | null;
  }>;
  numberToShow?: number;
}

export const Pagination = ({
  current,
  total,
  pageSize,
  pageRender: PageRender,
  baseUrl,
  className,
  numberToShow = 5,
  ...rest
}: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = [...Array(totalPages)].map((_, i) => ({ page: i + 1, id: `page${i}` }));

  const actualPages = useMemo(
    () =>
      pages
        .map(page => {
          const pageNumber = page.page;
          const leftOffset = 2;
          const rightOffset = 1;

          const dots: PaginationPage = { page: DOTS, id: `dots${pageNumber}` };
          const skip: PaginationPage = { page: null, id: `null${pageNumber}` };
          const inStart = current < numberToShow;
          const inEnd = totalPages + 1 - current < numberToShow;

          const offsetFromEdge = inStart ? pageNumber : totalPages + 1 - pageNumber;
          const currentLeftOffset = current - pageNumber;
          const currentRightOffset = pageNumber - current;

          const isDots = currentLeftOffset === leftOffset + 1 || currentRightOffset === rightOffset + 1;
          const isSkip = currentLeftOffset > leftOffset + 1 || currentRightOffset > rightOffset + 1;

          if (pageNumber === 1 || pageNumber === totalPages) {
            return page;
          }

          if (inStart || inEnd) {
            if (offsetFromEdge === numberToShow + 1) {
              return dots;
            }

            if (offsetFromEdge > numberToShow) {
              return skip;
            }

            return page;
          }

          if (isDots) {
            return dots;
          }

          if (isSkip) {
            return skip;
          }

          return page;
        })
        .filter(({ page }) => Boolean(page)),
    [current, numberToShow, pages, totalPages],
  );

  if (totalPages === 1) return null;

  const hasQuery = baseUrl?.includes('?');
  const buildPage = (page: number) => (hasQuery ? `${baseUrl}&page=${page}` : `${baseUrl}?page=${page}`);

  return (
    <div className={cn(st.paginationWrapper, className)} {...rest}>
      <Link
        className={cn(st.prevBtn, { [st.disable]: current === 1 })}
        href={current > 1 ? buildPage(current - 1) : '#'}
      >
        <Icon name="Chevron" />
      </Link>

      {actualPages.map(({ page, id }) => {
        const hasQuery = baseUrl?.includes('?');
        const pagePath = hasQuery ? `${baseUrl}&page=${page}` : `${baseUrl}?page=${page}`;

        return (
          <Link
            href={page === 1 ? baseUrl! : pagePath}
            key={id}
            className={cn(st.numberBtn, { [st.active]: page === current, [st.dots]: page === DOTS })}
          >
            {page}
          </Link>
        );
      })}

      <Link className={cn(st.nextBtn, { [st.disable]: current === totalPages })} href={buildPage(current + 1)}>
        <Icon name="Chevron" />
      </Link>
    </div>
  );
};
