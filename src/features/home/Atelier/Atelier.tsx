import st from './styles.module.scss';

const stats = [
  { num: '12', label: 'ателье\nв Москве и СПб' },
  { num: '4', label: 'фирменных\nбутика' },
  { num: '2018', label: 'год основания\nдома' },
  { num: '38', label: 'мастеров\nкройки и шитья' },
];

export function Atelier() {
  return (
    <section className={st.atelier}>
      <div className={st.inner}>
        <span className={st.eyebrow}>наследие</span>
        <ul className={st.row}>
          {stats.map((s) => (
            <li key={s.label} className={st.item}>
              <strong className={st.num}>{s.num}</strong>
              <span className={st.label}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
