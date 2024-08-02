import cn from 'classnames';
import { cloneElement, createContext } from 'react';

import st from './styles.module.scss';

type Props = {
  header: React.JSX.Element;
  footer: React.JSX.Element;
  children?: React.ReactNode;
};

export const templateCtx = createContext<HTMLHeadElement | null>(null);

export function MainTemplate({ header, footer, children }: Props) {
  return (
    <section className={cn(st.container)}>
      {cloneElement(header, {
        className: cn(st.header, header.props.className),
      })}

      <main className={st.content}>{children}</main>
      <footer className={st.footer}>{cloneElement(footer)}</footer>
    </section>
  );
}
