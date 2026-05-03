import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — MVST" },
      { name: "description", content: "Клиентский сервис MVST: телефон, e-mail и форма обратной связи." },
      { property: "og:title", content: "Контакты — MVST" },
      { property: "og:description", content: "Клиентский сервис MVST." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <SiteLayout>
      <section className="px-6 md:px-12 py-20 text-center">
        <div className="eyebrow text-foreground/60 mb-4">Контакты</div>
        <h1 className="font-serif text-5xl md:text-6xl">Клиентский сервис</h1>
        <p className="mt-6 max-w-xl mx-auto text-foreground/75">
          Мы отвечаем ежедневно с 10:00 до 21:00 по московскому времени.
        </p>
      </section>

      <section className="px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-20 pb-24 max-w-6xl mx-auto">
        <div className="space-y-10">
          <div>
            <div className="eyebrow text-foreground/60 mb-2">Телефон</div>
            <a href="tel:+74950000000" className="font-serif text-3xl hover:text-accent">+7 495 000 00 00</a>
          </div>
          <div>
            <div className="eyebrow text-foreground/60 mb-2">E-mail</div>
            <a href="mailto:client@mvst.ru" className="font-serif text-3xl hover:text-accent">client@mvst.ru</a>
          </div>
          <div>
            <div className="eyebrow text-foreground/60 mb-2">Адрес</div>
            <div className="text-foreground/80">Москва, Столешников переулок, 12, стр. 2</div>
          </div>
          <div>
            <div className="eyebrow text-foreground/60 mb-2">Реквизиты</div>
            <div className="text-foreground/80 text-sm leading-relaxed">
              ООО «МВСТ»<br />ИНН 7700000000 · ОГРН 1234567890123<br />
              <a href="#" className="underline hover:text-accent">Политика конфиденциальности</a>
            </div>
          </div>
        </div>

        <form
          className="space-y-6 border hairline p-8 md:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
          }}
        >
          <div className="eyebrow text-foreground/60">Форма обратной связи</div>
          <div>
            <label className="eyebrow text-foreground/60 block mb-2">Имя</label>
            <input
              required
              type="text"
              className="w-full bg-transparent border-b hairline py-2 outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="eyebrow text-foreground/60 block mb-2">E-mail</label>
            <input
              required
              type="email"
              className="w-full bg-transparent border-b hairline py-2 outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="eyebrow text-foreground/60 block mb-2">Сообщение</label>
            <textarea
              required
              rows={4}
              className="w-full bg-transparent border-b hairline py-2 outline-none focus:border-accent resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-foreground text-primary-foreground eyebrow-lg hover:bg-accent transition-colors"
          >
            Отправить
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
