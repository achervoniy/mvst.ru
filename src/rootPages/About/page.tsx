'use client';

import Image from 'next/image';
import Link from 'next/link';

import { LOOK_SLUGS } from '@/constants/runtimeConfig';

import { Typography } from '@/ui/index';

import heroDesktop from '@/rootPages/Contacts/BoutiqueList/assets/must_td.jpg';
import heroMobile from '@/rootPages/Contacts/BoutiqueList/assets/must_raddison.jpg';
import storyImage from '@/features/home/Banners/home-banner-f.jpg';
import galleryA from '@/rootPages/Contacts/BoutiqueList/assets/must_tsum.jpg';
import galleryB from '@/rootPages/Contacts/BoutiqueList/assets/must_barviha.jpg';
import galleryC from '@/rootPages/Contacts/BoutiqueList/assets/must_dlt.jpg';

import st from './styles.module.scss';

const FABRICS = [
  {
    name: 'Итальянская шерсть',
    origin: 'Ланифичио Верджиниа · Бьелла',
    note: 'Тонкое сукно и плотные костюмные ткани с&nbsp;мягкой структурой и&nbsp;выраженным ворсом.',
  },
  {
    name: 'Японский деним',
    origin: 'Кайхара · Фукуяма',
    note: 'Плотный нескользящий джинс с&nbsp;характерным угольным оттенком, который живёт со&nbsp;временем.',
  },
  {
    name: 'Кашемир',
    origin: 'Монголия · Шотландия',
    note: 'Пряжа 2-fold — ощутимо тяжёлая и&nbsp;тёплая, без лишнего объёма на&nbsp;силуэте.',
  },
  {
    name: 'Мерсеризованный хлопок',
    origin: 'Египет · Supima',
    note: 'Гладкая поверхность, стойкость цвета и&nbsp;натуральный шёлковый блеск.',
  },
  {
    name: 'Шёлковая смесь',
    origin: 'Комо · Италия',
    note: 'Лёгкая драпировка и тактильная роскошь без утяжеления силуэта.',
  },
];

const PRINCIPLES = [
  { label: 'Крой', text: 'Каждая выкройка дорабатывается на нескольких типах фигур — посадка остаётся безупречной вне зависимости от комплекции.' },
  { label: 'Цвет', text: 'Приглушённая палитра: камень, слоновая кость, табак, охра. Оттенки живут дольше одного сезона.' },
  { label: 'Качество', text: 'Один силуэт дорабатывается 4–6 месяцев. Такой подход позволяет сохранять стабильность год за годом.' },
];

const STATS = [
  { value: '2018', label: 'год основания' },
  { value: '6', label: 'бутиков' },
  { value: '2', label: 'города' },
  { value: '4', label: 'коллекции в год' },
];

export function AboutPage() {
  return (
    <div className={st.about}>
      <section className={st.hero}>
        <div className={st.heroMedia}>
          <Image
            src={heroDesktop}
            alt="MVST"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            className={st.heroImageDesktop}
          />
          <Image
            src={heroMobile}
            alt="MVST"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            className={st.heroImageMobile}
          />
          <div className={st.heroOverlay} />
        </div>
        <div className={st.heroContent}>
          <Typography font="body/regular" className={st.heroEyebrow}>
            MVST · с&nbsp;2018
          </Typography>
          <Typography font="leading/display" className={st.heroTitle} as="h1">
            Элегантность
            <br />
            вне&nbsp;времени
          </Typography>
          <Typography font="paragraph/regular" className={st.heroLead}>
            Современный российский бренд мужской и&nbsp;женской одежды,
            основанный на&nbsp;традициях европейского ателье и&nbsp;культуре
            осознанного потребления.
          </Typography>
        </div>
      </section>

      <section className={st.manifest}>
        <Typography font="body/bold" className={st.sectionEyebrow} align="center">
          Манифест
        </Typography>
        <Typography font="leading/h1" className={st.manifestText} align="center">
          Мы создаём вещи, которые остаются в&nbsp;гардеробе дольше, чем длится
          мода. Вещи, в&nbsp;которых удобно быть собой — на&nbsp;деловой встрече,
          в&nbsp;путешествии, на&nbsp;ужине с&nbsp;близкими.
        </Typography>
        <Typography font="paragraph/regular" className={st.manifestSub} align="center">
          MVST&nbsp;— это уважение к&nbsp;материалам, внимание к&nbsp;деталям
          и&nbsp;отказ от&nbsp;лишнего. Наш дизайн-код&nbsp;— чистые линии,
          благородные оттенки и&nbsp;качество, которое вы чувствуете пальцами.
        </Typography>
      </section>

      <section className={st.fabrics}>
        <div className={st.fabricsHead}>
          <Typography font="body/bold" className={st.sectionEyebrow}>
            Материалы
          </Typography>
          <Typography font="leading/h1" className={st.fabricsTitle} as="h2">
            Из чего сделана коллекция
          </Typography>
        </div>
        <ul className={st.fabricsList}>
          {FABRICS.map((f) => (
            <li key={f.name} className={st.fabricsItem}>
              <div className={st.fabricsLeft}>
                <span className={st.fabricsName}>{f.name}</span>
                <span className={st.fabricsOrigin}>{f.origin}</span>
              </div>
              <Typography
                font="paragraph/regular"
                className={st.fabricsNote}
                dangerouslySetInnerHTML={{ __html: f.note }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={st.principles}>
        {PRINCIPLES.map((p) => (
          <div key={p.label} className={st.principleItem}>
            <span className={st.principleLabel}>{p.label}</span>
            <Typography font="paragraph/regular" className={st.principleText}>
              {p.text}
            </Typography>
          </div>
        ))}
      </section>

      <section className={st.story}>
        <div className={st.storyMedia}>
          <Image
            src={storyImage}
            alt="Ателье MVST"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={st.storyImage}
          />
        </div>
        <div className={st.storyContent}>
          <Typography font="body/bold" className={st.sectionEyebrow}>
            Ателье
          </Typography>
          <Typography font="leading/h1" className={st.storyTitle} as="h2">
            От&nbsp;лекала до&nbsp;финальной примерки
          </Typography>
          <Typography font="paragraph/regular" className={st.storyText}>
            Каждая модель проходит долгий путь: конструктор отрабатывает посадку
            на&nbsp;нескольких типах фигур, технолог подбирает дублирующие
            материалы, портной собирает изделие вручную. Такой подход позволяет
            сохранять стабильное качество и&nbsp;узнаваемую посадку год
            за&nbsp;годом.
          </Typography>
          <Typography font="paragraph/regular" className={st.storyText}>
            Мы&nbsp;намеренно избегаем быстрых решений: один силуэт может
            дорабатываться 4–6&nbsp;месяцев. Поэтому каждая вещь MVST&nbsp;—
            результат десятков решений, а&nbsp;не&nbsp;случайной находки.
          </Typography>
        </div>
      </section>

      <section className={st.stats}>
        {STATS.map(stat => (
          <div key={stat.label} className={st.statCard}>
            <Typography font="leading/display" className={st.statValue}>
              {stat.value}
            </Typography>
            <Typography font="body/regular" className={st.statLabel}>
              {stat.label}
            </Typography>
          </div>
        ))}
      </section>

      <section className={st.quote}>
        <Typography font="leading/h1" className={st.quoteText} align="center">
          «Мы&nbsp;не&nbsp;продаём тренды. Мы&nbsp;возвращаем ценность вещи,
          которую хочется носить годами».
        </Typography>
        <Typography font="body/bold" className={st.quoteAuthor} align="center">
          Команда MVST
        </Typography>
      </section>

      <section className={st.gallery}>
        <div className={st.galleryItem}>
          <Image src={galleryA} alt="Бутик MVST в ЦУМ" fill sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
        <div className={st.galleryItem}>
          <Image src={galleryB} alt="Бутик MVST в Третьяковском проезде" fill sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
        <div className={st.galleryItem}>
          <Image src={galleryC} alt="Бутик MVST в ДЛТ" fill sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
      </section>

      <section className={st.cta}>
        <Typography font="leading/h1" className={st.ctaTitle} align="center" as="h2">
          Познакомьтесь с&nbsp;коллекцией
        </Typography>
        <Typography font="paragraph/regular" className={st.ctaText} align="center">
          Актуальный сезон SS26 уже в&nbsp;продаже&nbsp;— онлайн и&nbsp;в&nbsp;бутиках.
        </Typography>
        <div className={st.ctaActions}>
          <Link href={`/collection/${LOOK_SLUGS.all}`} className={st.ctaPrimary}>
            Смотреть коллекцию
          </Link>
          <Link href="/contacts" className={st.ctaSecondary}>
            Наши бутики
          </Link>
        </div>
      </section>
    </div>
  );
}
