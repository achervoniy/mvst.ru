import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFittingCart } from "@/lib/fitting-cart";

export function HeaderCartButton({ className, dark = false }: { className?: string; dark?: boolean }) {
  const { count, setOpen } = useFittingCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Корзина для примерки${count > 0 ? `: ${count}` : ""}`}
      className={cn(
        "relative p-2 -m-2 transition-colors",
        dark ? "text-cream/85 hover:text-cream" : "text-foreground/75 hover:text-accent",
        className,
      )}
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      {count > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium leading-[18px] text-center",
            dark ? "bg-cream text-foreground" : "bg-foreground text-primary-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
