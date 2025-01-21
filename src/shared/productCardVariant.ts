import { invoke } from '@withease/factories';
import { useUnit } from 'effector-react';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

import { createField } from '@/lib/createField';

export type ProductCardVariant = 'product' | 'model' | null;

export const productCardVariantField = invoke(() => createField<ProductCardVariant>(null));

export function useProductVariantSync() {
  const { value, onChange } = useUnit(productCardVariantField);

  useEffect(() => {
    if (!value) {
      const imageVariant = Cookies.get('p-image') === '1' ? 'model' : 'product';

      onChange(imageVariant);
    }
  }, [onChange, value]);

  return value;
}
