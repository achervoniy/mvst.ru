declare module '*.svg?react' {
  import * as React from 'react';

  // const content: React.SVGProps<SVGSVGElement>;
  const content: React.VFC<React.SVGProps<SVGSVGElement>>;

  export default content;
}

// eslint-disable-next-line no-unused-vars
declare type Nullable<T> = T | null;