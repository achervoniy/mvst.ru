import { Link } from "@tanstack/react-router";
import type { CatalogProduct } from "@/lib/tsum/types";
import { formatRub } from "@/lib/format";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative aspect-[3/4]">
        {product.primaryImage && (
          <img
            src={product.primaryImage}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 size-full object-contain p-2 md:p-6 mix-blend-multiply group-hover:opacity-0"
          />
        )}
        {product.hoverImage && product.hoverImage !== product.primaryImage && (
          <img
            src={product.hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-contain p-2 md:p-6 mix-blend-multiply opacity-0 group-hover:opacity-100"
          />
        )}
        {product.hasDiscount && (
          <div className="absolute top-2 left-2 eyebrow bg-foreground text-primary-foreground px-2 py-1 text-[10px]">
            −{product.discountPercent}%
          </div>
        )}
      </div>
      <div className="pt-3 text-center">
        <div className="font-serif text-[15px] md:text-base leading-snug text-foreground line-clamp-2 min-h-[2.6em]">
          {product.title}
        </div>
        <div className="mt-1 text-xs text-foreground/80">
          {formatRub(product.minPrice)}
          {product.hasDiscount && (
            <span className="ml-2 text-foreground/40 line-through text-[10px]">
              {formatRub(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
