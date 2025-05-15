import { useUnit } from 'effector-react';
import Cookies from 'js-cookie';

import { useProductVariantSync, productCardVariantField, ProductCardVariant } from '@/shared/productCardVariant';

import { Segments } from '@/ui/Segments';

export function ProductImageVariantFilter() {
  const variantChanged = useUnit(productCardVariantField.change);
  const variant = useProductVariantSync();

  return (
    <Segments
      name="variant"
      value={variant ?? ''}
      onChange={e => {
        Cookies.set('p-image', e.target.value === 'model' ? '1' : '0');
        variantChanged(e.target.value as ProductCardVariant);
      }}
      options={[
        {
          label: 'Товары',
          value: 'product',
        },
        {
          label: 'Образы',
          value: 'model',
        },
      ]}
    />
  );
}
