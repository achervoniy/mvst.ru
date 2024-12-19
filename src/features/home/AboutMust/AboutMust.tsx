import { Typography } from '@/ui/index';

import st from './styles.module.scss';

export function AboutMust() {
  return (
    <div className={st.aboutMust} target-id="mvst">
      <div className={st.head}>
        <Typography font="leading/h2" className={st.title} align="center">
          О Бренде
        </Typography>
      </div>

      <Typography font="paragraph/regular" className={st.text}>
        Женские и мужские коллекции MVST — это элегантные вещи вне времени, которые отличают безупречный крой,
        премиальные материалы и благородные оттенки.
        <br />
        Такие достоинства идеально отвечают потребностям взыскательных клиентов, которые привыкли к лучшему.
      </Typography>
    </div>
  );
}
