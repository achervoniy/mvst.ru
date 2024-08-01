import { invoke } from '@withease/factories';

import { createField } from './createField';

export const pageStatusField = invoke(() => createField(200));
