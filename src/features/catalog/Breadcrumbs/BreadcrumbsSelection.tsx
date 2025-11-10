import Link from 'next/link';

import { CategoryInfoResponse, SelectionInfoResponse } from '@/shared/api/catalog';

import { Typography } from '@/ui/index';

import st from './styles.module.scss';

const links = ({
  selection,
  category,
}: {
  category?: CategoryInfoResponse | null;
  selection?: SelectionInfoResponse | null;
}) => {
  return [
    {
      title: 'Главная',
      link: '/',
    },
    selection && { title: selection.title, link: `/catalog/sel/${selection.slug}/` },
    category && { title: category.title },
  ].filter(Boolean) as { title: string; link?: string }[];
};

export function BreadcrumbsSelection({
  selection,
  category,
}: {
  gender?: 'w' | 'm';
  category?: CategoryInfoResponse | null;
  selection?: SelectionInfoResponse | null;
}) {
  return (
    <ol className={st.Breadcrumbs} itemScope itemType="https://schema.org/BreadcrumbList">
      {links({ category, selection }).map((link, index, arr) => {
        const content = (
          <Typography font="body/regular" itemProp="name">
            {link.title}
            {arr.length - 1 > index ? <>&nbsp;&nbsp;•&nbsp;&nbsp;</> : ''}
          </Typography>
        );
        const meta = <meta itemProp="position" content={String(index + 1)} />;
        return link.link ? (
          <li key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={link.link ?? '#'} itemProp="item">
              {content}
            </Link>
            {meta}
          </li>
        ) : (
          <li key={index}>
            {content}
            {meta}
          </li>
        );
      })}
    </ol>
  );
}