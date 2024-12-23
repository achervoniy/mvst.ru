import { CategoryFilterListCommonItem } from '@/shared/api/catalog';

import { Typography } from '@/ui/index';

import st from './Sidebar.module.scss';

type Props = {
  categories: CategoryFilterListCommonItem[];
};

export function Sidebar({ categories }: Props) {
  return (
    <ul className={st.Sidebar}>
      {categories.map(cat => (
        <li key={cat.slug}>
          <Typography font="paragraph/regular">{cat.title}</Typography>
        </li>
      ))}
    </ul>
  );
}
