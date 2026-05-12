import { Link } from "@tanstack/react-router";
import logoFull from "@/assets/icons/LogoFull.svg";
import tgIcon from "@/assets/icons/Tg.svg";
import vkIcon from "@/assets/icons/VK.svg";

export function Footer() {
  return (
    <footer className="border-t hairline bg-background">
      <div className="px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="eyebrow text-foreground/60 mb-4">Покупки</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/catalog/$gender"
                params={{ gender: "women" }}
                preload="intent"
                className="hover:text-accent"
              >
                Для нее
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/$gender"
                params={{ gender: "men" }}
                preload="intent"
                className="hover:text-accent"
              >
                Для него
              </Link>
            </li>
            <li>
              <Link to="/collection-ss26" preload="intent" className="hover:text-accent">
                Коллекция весна-лето 2026
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-foreground/60 mb-4">Сервис</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/contacts" preload="intent" className="hover:text-accent">
                Контакты
              </Link>
            </li>
            <li>
              <Link to="/boutiques" preload="intent" className="hover:text-accent">
                Бутики
              </Link>
            </li>
            <li>
              <span className="text-foreground/60">Доставка и возврат</span>
            </li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-foreground/60 mb-4">Бренд</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" preload="intent" className="hover:text-accent">
                О бренде
              </Link>
            </li>
            <li>
              <Link to="/about" hash="craft" preload="intent" className="hover:text-accent">
                Мастерство
              </Link>
            </li>
            <li>
              <Link to="/about" hash="sustainability" preload="intent" className="hover:text-accent">
                Устойчивое развитие
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-foreground/60 mb-4">Контакты</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-accent"
                href="#"
                aria-label="Telegram"
              >
                <img src={tgIcon} alt="" className="size-5" /> Telegram
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-accent"
                href="#"
                aria-label="VK"
              >
                <img src={vkIcon} alt="" className="size-5" /> VK
              </a>
            </li>
            <li>
              <a className="hover:text-accent" href="mailto:client@mvst.ru">
                client@mvst.ru
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t hairline px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
        <img src={logoFull} alt="MVST" className="h-5 w-auto" />
        <div>© {new Date().getFullYear()} MVST. Все права защищены.</div>
        <div className="eyebrow">Москва · Санкт-Петербург · Сочи</div>
      </div>
    </footer>
  );
}
