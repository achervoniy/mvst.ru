import st from './styles.module.scss';

export function Manifesto() {
  return (
    <section className={st.manifesto}>
      <div className={st.inner}>
        <p className={st.eyebrow}>дом mvst</p>
        <h2 className={st.statement}>
          <span>ткани.</span>
          <span>крой.</span>
          <span>спокойствие.</span>
        </h2>
        <p className={st.tail}>
          одежда, в которую не нужно одеваться.
          <br />
          вещи, которые остаются с вами на годы.
        </p>
      </div>
    </section>
  );
}
