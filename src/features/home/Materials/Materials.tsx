'use client';

import { useState } from 'react';

import st from './styles.module.scss';

type Tone = 'cream' | 'paper' | 'cocoa' | 'tobacco' | 'indigo' | 'leather';

type Item = {
  id: string;
  label: string;
  origin: string;
  text: string;
  tone: Tone;
  // Drop real fabric photos at /public/static/materials/{id}.svg
  // The woven CSS texture stays visible if the file is missing.
  img?: string;
};

const items: Item[] = [
  {
    id: 'linen',
    label: 'лён',
    origin: 'Италия',
    text: 'волокно лучшего европейского льна. эластично, дышит, благородно мнётся.',
    tone: 'cream',
    img: '/static/materials/linen.svg',
  },
  {
    id: 'cotton',
    label: 'хлопок',
    origin: 'Египет',
    text: 'длинноволокнистый хлопок Гиза. почти шёлковая поверхность, износостойкость десятилетий.',
    tone: 'paper',
    img: '/static/materials/cotton.svg',
  },
  {
    id: 'denim',
    label: 'деним',
    origin: 'Япония',
    text: 'сэлвидж-деним из Окаямы. плотное саржевое плетение, насыщенный индиго, ноская мягкость.',
    tone: 'indigo',
    img: '/static/materials/denim.svg',
  },
  {
    id: 'suede',
    label: 'замша',
    origin: 'Франция',
    text: 'мягкая шевретовая замша. матовая поверхность, плотная рука, работает на всех скоростях носки.',
    tone: 'cocoa',
    img: '/static/materials/suede.svg',
  },
  {
    id: 'leather',
    label: 'кожа',
    origin: 'Италия',
    text: 'телячья кожа полного дубления из Тосканы. живая патина, мягкость с первой носки.',
    tone: 'leather',
    img: '/static/materials/leather.svg',
  },
  {
    id: 'cashmere',
    label: 'кашемир',
    origin: 'Монголия',
    text: 'руно горных коз. согревает в три раза эффективнее шерсти, не теряя лёгкости.',
    tone: 'tobacco',
    img: '/static/materials/cashmere.svg',
  },
];

function Swatch({ tone, img, alt }: { tone: Tone; img?: string; alt: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = img && !imgFailed;
  return (
    <div className={`${st.swatch} ${st[`swatch_${tone}`]}`}>
      {showImage && (
        <img
          className={st.swatchImage}
          src={img}
          alt={alt}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      )}
      <span className={st.swatchGrain} aria-hidden />
    </div>
  );
}

export function Materials() {
  return (
    <section className={st.materials}>
      <div className={st.head}>
        <span className={st.eyebrow}>код материала</span>
        <h2 className={st.title}>
          шесть <em>материй</em> сезона
        </h2>
        <p className={st.intro}>
          каждая вещь mvst начинается с ткани. ниже — то, из чего сделан SS26.
        </p>
      </div>

      <div className={st.row}>
        {items.map((it, i) => (
          <article key={it.id} className={st.card} data-pos={i % 3}>
            <Swatch tone={it.tone} img={it.img} alt={it.label} />
            <div className={st.copy}>
              <div className={st.metaRow}>
                <span className={st.index}>
                  {String(i + 1).padStart(2, '0')} <span className={st.indexTotal}>/ {String(items.length).padStart(2, '0')}</span>
                </span>
                <span className={st.origin}>{it.origin}</span>
              </div>
              <span className={st.cardLabel}>{it.label}</span>
              <p className={st.text}>{it.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
