import { useUnit } from 'effector-react';
import Cookies from 'js-cookie';

import { useProductVariantSync, productCardVariantField } from '@/shared/productCardVariant';

export function ProductImageVariantFilter() {
  const variantChanged = useUnit(productCardVariantField.change);
  const variant = useProductVariantSync();

  if (!variant) {
    return null;
  }

  return (
    <p
      onClick={() => {
        const nextVariant = variant === 'model' ? 'product' : 'model';

        Cookies.set('p-image', nextVariant === 'model' ? '1' : '0');
        variantChanged(nextVariant);
      }}
    >
      {variant}
    </p>
  );
}
