import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { z } from "zod";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFittingCart, submitFittingOrder, type FittingBoutique } from "@/lib/fitting-cart";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { boutiques } from "@/routes/boutiques";
import { formatRub, pluralizeRu } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Step = "cart" | "boutique" | "confirm" | "success";

const formSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(60, "Слишком длинное имя"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+7|7|8)[\s\-(]*\d{3}[\s\-)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}$/, "Введите корректный номер"),
});

export function FittingCartDialog() {
  const { items, count, total, remove, clear, open, setOpen, addNonce } = useFittingCart();
  const recentlyViewed = useRecentlyViewed();
  const [step, setStep] = useState<Step>("cart");
  const [boutique, setBoutique] = useState<FittingBoutique | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBoutique, setConfirmedBoutique] = useState<FittingBoutique | null>(null);

  // reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(items.length === 0 && step === "success" ? "cart" : step);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open, items.length, step]);

  // если корзина опустела на шаге cart — ок; если на других — вернуть на cart
  useEffect(() => {
    if (count === 0 && (step === "boutique" || step === "confirm")) setStep("cart");
  }, [count, step]);

  // при добавлении нового товара — откатываемся на шаг "cart"
  useEffect(() => {
    if (addNonce === 0) return;
    setStep("cart");
  }, [addNonce]);

  const closeAndReset = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("cart");
      setBoutique(null);
      setConfirmedBoutique(null);
      setName("");
      setPhone("");
      setErrors({});
    }, 250);
  };

  const handleSubmit = async () => {
    const parsed = formSchema.safeParse({ name, phone });
    if (!parsed.success) {
      const fieldErrors: { name?: string; phone?: string } = {};
      for (const e of parsed.error.issues) {
        const k = e.path[0] as "name" | "phone";
        fieldErrors[k] = e.message;
      }
      setErrors(fieldErrors);
      return;
    }
    if (!boutique) return;
    setErrors({});
    setSubmitting(true);
    try {
      await submitFittingOrder({
        data: {
          items,
          boutique,
          name: parsed.data.name,
          phone: parsed.data.phone,
          recentlyViewed,
        },
      });
      setConfirmedBoutique(boutique);
      clear();
      setStep("success");
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 flex flex-col gap-0"
      >
        <SheetTitle className="sr-only">
          {step === "cart" && "Корзина для примерки"}
          {step === "boutique" && "Выбор бутика"}
          {step === "confirm" && "Подтверждение"}
          {step === "success" && "Заявка принята"}
        </SheetTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b hairline">
          {step !== "cart" && step !== "success" ? (
            <button
              type="button"
              onClick={() => setStep(step === "boutique" ? "cart" : "boutique")}
              className="-ml-2 p-2 text-foreground/70 hover:text-foreground"
              aria-label="Назад"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          <div className="eyebrow text-foreground">
            {step === "cart" && "Корзина"}
            {step === "boutique" && "Выбор бутика"}
            {step === "confirm" && "Подтверждение"}
            {step === "success" && "Готово"}
          </div>
          <div className="w-9" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {step === "cart" && <CartStep items={items} remove={remove} clear={clear} />}
          {step === "boutique" && (
            <BoutiqueStep selected={boutique} onSelect={setBoutique} />
          )}
          {step === "confirm" && (
            <ConfirmStep
              items={items}
              total={total}
              boutique={boutique!}
              name={name}
              phone={phone}
              errors={errors}
              setName={setName}
              setPhone={setPhone}
            />
          )}
          {step === "success" && <SuccessStep boutique={confirmedBoutique} />}
        </div>

        {/* Footer */}
        <div className="border-t hairline px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background">
          {step === "cart" && (
            <>
              <div className="flex items-baseline justify-between mb-3">
                <div className="eyebrow text-foreground/60">
                  Итого{" "}
                  <span className="text-foreground/40 normal-case">
                    · {count} {pluralizeRu(count, ["вещь", "вещи", "вещей"])}
                  </span>
                </div>
                <div className="font-serif text-lg">{formatRub(total)}</div>
              </div>
              <button
                type="button"
                disabled={count === 0}
                onClick={() => setStep("boutique")}
                className="w-full h-12 bg-foreground text-primary-foreground eyebrow-lg hover:bg-accent transition-colors disabled:opacity-40 disabled:hover:bg-foreground"
              >
                Выбрать бутик
              </button>
            </>
          )}
          {step === "boutique" && (
            <button
              type="button"
              disabled={!boutique}
              onClick={() => setStep("confirm")}
              className="w-full h-12 bg-foreground text-primary-foreground eyebrow-lg hover:bg-accent transition-colors disabled:opacity-40 disabled:hover:bg-foreground"
            >
              Подтвердить
            </button>
          )}
          {step === "confirm" && (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="w-full h-12 bg-foreground text-primary-foreground eyebrow-lg hover:bg-accent transition-colors disabled:opacity-40 disabled:hover:bg-foreground"
            >
              {submitting ? "Отправляем…" : "Оформить примерку"}
            </button>
          )}
          {step === "success" && (
            <button
              type="button"
              onClick={closeAndReset}
              className="w-full h-12 bg-foreground text-primary-foreground eyebrow-lg hover:bg-accent transition-colors"
            >
              Закрыть
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CartStep({
  items,
  remove,
  clear,
}: {
  items: ReturnType<typeof useFittingCart>["items"];
  remove: (id: number) => void;
  clear: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-foreground/60">
        В корзине пока ничего нет.
      </div>
    );
  }
  return (
    <div className="px-6 py-5">
      <ul className="divide-y hairline">
        {items.map((it) => (
          <li key={it.skuId} className="py-4 flex gap-4">
            <Link
              to="/product/$slug"
              params={{ slug: it.productSlug }}
              className="relative shrink-0 size-20 bg-background border hairline"
            >
              {it.image && (
                <img
                  src={it.image}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-contain mix-blend-multiply"
                />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to="/product/$slug"
                params={{ slug: it.productSlug }}
                className="block text-sm leading-snug hover:text-accent line-clamp-2"
              >
                {it.title}
              </Link>
              <div className="mt-1 text-xs text-foreground/55">
                {it.color} · размер {it.size}
              </div>
              <div className="mt-2 text-sm">{formatRub(it.price)}</div>
            </div>
            <button
              type="button"
              onClick={() => remove(it.skuId)}
              className="shrink-0 -mr-2 p-2 text-foreground/40 hover:text-foreground"
              aria-label="Удалить"
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={clear}
        className="mt-4 eyebrow text-foreground/55 hover:text-accent border-b border-foreground/30 hover:border-accent pb-0.5"
      >
        Очистить корзину
      </button>
    </div>
  );
}

function BoutiqueStep({
  selected,
  onSelect,
}: {
  selected: FittingBoutique | null;
  onSelect: (b: FittingBoutique) => void;
}) {
  return (
    <div className="px-6 py-5 space-y-3">
      {boutiques.map((b) => {
        const isSel = selected?.name === b.name;
        return (
          <button
            key={b.name}
            type="button"
            onClick={() => onSelect({ slug: b.slug, name: b.name, addr: b.addr, img: b.img })}
            className={cn(
              "w-full flex gap-4 items-center p-3 border text-left transition-colors",
              isSel
                ? "border-foreground bg-foreground/[0.03]"
                : "border-foreground/15 hover:border-foreground/50",
            )}
          >
            <div className="relative size-20 shrink-0 overflow-hidden">
              <img src={b.img} alt={b.name} className="absolute inset-0 size-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-lg leading-tight">{b.name}</div>
              <div className="mt-1 text-xs text-foreground/60">{b.addr}</div>
            </div>
            <div
              className={cn(
                "size-5 rounded-full border shrink-0 flex items-center justify-center",
                isSel ? "border-foreground bg-foreground" : "border-foreground/30",
              )}
            >
              {isSel && <Check className="size-3 text-primary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ConfirmStep({
  items,
  total,
  boutique,
  name,
  phone,
  errors,
  setName,
  setPhone,
}: {
  items: ReturnType<typeof useFittingCart>["items"];
  total: number;
  boutique: FittingBoutique;
  name: string;
  phone: string;
  errors: { name?: string; phone?: string };
  setName: (v: string) => void;
  setPhone: (v: string) => void;
}) {
  return (
    <div className="px-6 py-5 space-y-6">
      <div>
        <div className="eyebrow text-foreground/60 mb-2">Бутик</div>
        <div className="text-sm">{boutique.name}</div>
        <div className="text-xs text-foreground/60 mt-0.5">{boutique.addr}</div>
      </div>

      <div>
        <div className="eyebrow text-foreground/60 mb-2">
          Вещей на примерку · {items.length}
        </div>
        <ul className="text-sm space-y-1">
          {items.map((it) => (
            <li key={it.skuId} className="flex justify-between gap-3">
              <span className="text-foreground/80 truncate">
                {it.title} <span className="text-foreground/45">· {it.size}</span>
              </span>
              <span className="text-foreground/80 shrink-0">{formatRub(it.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t hairline flex justify-between">
          <span className="eyebrow text-foreground/60">Итого</span>
          <span className="font-serif text-lg">{formatRub(total)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fc-name" className="eyebrow text-foreground/60">
            Имя
          </Label>
          <Input
            id="fc-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 rounded-none border-foreground/30 focus-visible:ring-0 focus-visible:border-foreground"
          />
          {errors.name && <div className="mt-1 text-xs text-destructive">{errors.name}</div>}
        </div>
        <div>
          <Label htmlFor="fc-phone" className="eyebrow text-foreground/60">
            Телефон
          </Label>
          <Input
            id="fc-phone"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 h-11 rounded-none border-foreground/30 focus-visible:ring-0 focus-visible:border-foreground"
          />
          {errors.phone && <div className="mt-1 text-xs text-destructive">{errors.phone}</div>}
        </div>
        <p className="text-xs text-foreground/55">
          Менеджер свяжется с вами для подтверждения времени примерки.
        </p>
      </div>
    </div>
  );
}

function SuccessStep({ boutique }: { boutique: FittingBoutique | null }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto size-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
        <Check className="size-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 font-serif text-2xl">Заявка принята</h3>
      <p className="mt-3 text-sm text-foreground/70 leading-relaxed max-w-xs mx-auto">
        Мы свяжемся с вами в ближайшее время для подтверждения примерки
        {boutique ? ` в бутике ${boutique.name}` : ""}.
      </p>
    </div>
  );
}
