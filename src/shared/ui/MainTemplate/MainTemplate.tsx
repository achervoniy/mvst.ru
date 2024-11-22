import cn from 'classnames';
import { cloneElement, createContext } from 'react';

import st from './styles.module.scss';

type Props = {
  header: React.JSX.Element;
  footer: React.JSX.Element;
  children?: React.ReactNode;
  contentResetStyles?: boolean;
};

export const templateCtx = createContext<HTMLHeadElement | null>(null);

export function MainTemplate({ header, footer, children, contentResetStyles }: Props) {
  return (
    <section className={cn(st.container)}>
      {cloneElement(header, {
        className: cn(st.header, header.props.className),
      })}

      <main
        className={cn(st.content, {
          [st.contentResetStyles]: contentResetStyles,
        })}
      >
        {children}
      </main>
      <footer className={st.footer}>{cloneElement(footer)}</footer>
    </section>
  );
}
