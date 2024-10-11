import { Typography } from '@/ui/index';

import st from './styles.module.scss';

export function AboutMust() {
  return (
    <div className={st.aboutMust} target-id="must">
      <div className={st.head}>
        <Typography font="leading/h2" className={st.title} align="center">
          О Бренде
        </Typography>
      </div>

      <Typography font="paragraph/regular" className={st.text}>
        Женские и мужские коллекции MUST - это элегантные вещи вне времени, верность традициям, лучшие материалы и эталонное качество!
        <br />
        Главные ценности MUST - безупречный крой, премиальные
        материалы и благородные оттенки.
        Такие достоинства идеально
        отвечают потребностям
        взыскательных клиентов, которые
        привыкли к лучшему.
      </Typography>
    </div>
  );
}
