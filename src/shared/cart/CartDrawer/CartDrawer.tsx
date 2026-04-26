'use client';

import cn from 'classnames';
import { useUnit } from 'effector-react';
import Image from 'next/image';
import Link from 'next/link';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { useMemo, useState } from 'react';

import { BOUTIQUES, getBoutiqueById } from '@/shared/boutiques';

import { Icon } from '@/ui/assets/Icon';

import { transformPrice } from '@/lib/currency';

import {
  $contactName,
  $contactPhone,
  $count,
  $isOpen,
  $items,
  $requestError,
  $requestPending,
  $selectedBoutiqueId,
  $step,
  $total,
  boutiqueSelected,
  cartClosed,
  cartStepSet,
  clearCart,
  contactNameChanged,
  contactPhoneChanged,
  removeFromCart,
  requestError,
  requestReset,
  requestSubmitted,
  type CartItem,
  type CartStep,
} from '../model';

import st from './styles.module.scss';

const STEPS: { id: CartStep; title: string }[] = [
  { id: 'items', title: 'Корзина' },
  { id: 'boutique', title: 'Бутик' },
  { id: 'contacts', title: 'Контакты' },
];

export function CartDrawer() {
  const [isOpen, items, step, count, total, selectedBoutiqueId, name, phone, pending, submitErr] = useUnit([
    $isOpen,
    $items,
    $step,
    $count,
    $total,
    $selectedBoutiqueId,
    $contactName,
    $contactPhone,
    $requestPending,
    $requestError,
  ]);

  const [
    closeCart,
    setStep,
    setBoutique,
    setName,
    setPhone,
    doRemove,
    doClear,
    doSubmit,
    doReset,
  ] = useUnit([
    cartClosed,
    cartStepSet,
    boutiqueSelected,
    contactNameChanged,
    contactPhoneChanged,
    removeFromCart,
    clearCart,
    requestSubmitted,
    requestReset,
  ]);

  const boutique = useMemo(() => getBoutiqueById(selectedBoutiqueId), [selectedBoutiqueId]);

  const canGoToBoutique = items.length > 0;
  const canGoToContacts = canGoToBoutique && !!selectedBoutiqueId;
  const canSubmit = canGoToContacts && name.trim().length > 1 && phone.replace(/\D/g, '').length >= 10;

  const onClose = () => closeCart();
  const onBack = () => {
    if (step === 'boutique') setStep('items');
    else if (step === 'contacts') setStep('boutique');
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      size={460}
      lockBackgroundScroll
      zIndex={600}
      className={st.drawer}
      overlayOpacity={0.55}
    >
      <div className={st.root}>
        {/* header */}
        <div className={st.head}>
          {step !== 'items' && step !== 'done' ? (
            <button type="button" className={st.headBack} onClick={onBack} aria-label="Назад">
              <Icon name="ArrowBack" />
            </button>
          ) : (
            <span className={st.headBackSpacer} />
          )}
          <div className={st.headTitle}>
            {step === 'done' ? 'Запрос отправлен' : 'Корзина'}
            {step !== 'done' && count > 0 ? <span className={st.headCount}>{count}</span> : null}
          </div>
          <button type="button" className={st.headClose} onClick={onClose} aria-label="Закрыть">
            <Icon name="CloseIcon" />
          </button>
        </div>

        {/* stepper */}
        {step !== 'done' && items.length > 0 && (
          <div className={st.stepper}>
            {STEPS.map((s, idx) => {
              const currentIdx = STEPS.findIndex(x => x.id === step);
              const active = s.id === step;
              const done = idx < currentIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={cn(st.stepperItem, {
                    [st.stepperItemActive]: active,
                    [st.stepperItemDone]: done,
                  })}
                  onClick={() => {
                    if (idx <= currentIdx) setStep(s.id);
                  }}
                  disabled={idx > currentIdx}
                >
                  <span className={st.stepperIdx}>{idx + 1}</span>
                  <span className={st.stepperLabel}>{s.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* body */}
        <div className={st.body}>
          {step === 'items' && (
            <ItemsStep
              items={items}
              onRemove={key => doRemove(key)}
              onClear={() => doClear()}
              onNavigate={() => closeCart()}
            />
          )}

          {step === 'boutique' && (
            <BoutiqueStep selected={selectedBoutiqueId} onSelect={id => setBoutique(id)} />
          )}

          {step === 'contacts' && (
            <ContactsStep
              name={name}
              phone={phone}
              boutique={boutique?.title}
              onName={v => setName(v)}
              onPhone={v => setPhone(v)}
            />
          )}

          {step === 'done' && (
            <DoneStep
              boutique={boutique?.title}
              onReset={() => {
                doClear();
                closeCart();
              }}
              onMore={() => {
                doClear();
                doReset();
                closeCart();
              }}
            />
          )}
        </div>

        {/* footer / actions */}
        {step !== 'done' && items.length > 0 && (
          <div className={st.footer}>
            {step === 'items' && (
              <>
                <div className={st.totalRow}>
                  <span className={st.totalLabel}>Итого</span>
                  <span className={st.totalValue}>{transformPrice(total)}</span>
                </div>
                <button
                  type="button"
                  className={st.primaryBtn}
                  disabled={!canGoToBoutique}
                  onClick={() => setStep('boutique')}
                >
                  Выбрать бутик для примерки
                </button>
              </>
            )}

            {step === 'boutique' && (
              <button
                type="button"
                className={st.primaryBtn}
                disabled={!canGoToContacts}
                onClick={() => setStep('contacts')}
              >
                Далее
              </button>
            )}

            {step === 'contacts' && (
              <>
                {submitErr && (
                  <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
                    Ошибка: {submitErr}
                  </p>
                )}
                <button
                  type="button"
                  className={st.primaryBtn}
                  disabled={!canSubmit || pending}
                  onClick={() => { requestError(null); doSubmit(); }}
                >
                  {pending ? 'Отправляем…' : 'Отправить запрос'}
                </button>
              </>
            )}
          </div>
        )}

        {step === 'items' && items.length === 0 && (
          <div className={st.empty}>
            <p className={st.emptyTitle}>В корзине пусто</p>
            <p className={st.emptyHint}>
              Добавьте товар на странице карточки, чтобы записаться на примерку в бутике MVST.
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
}

/* ── steps ── */

function ItemsStep({
  items,
  onRemove,
  onClear,
  onNavigate,
}: {
  items: CartItem[];
  onRemove: (key: string) => void;
  onClear: () => void;
  onNavigate: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <>
      <ul className={st.list}>
        {items.map(item => (
          <li key={item.key} className={st.listItem}>
            <Link
              href={`/product/${item.slug || item.productId}`}
              className={st.listLink}
              onClick={onNavigate}
              prefetch={false}
            >
              <div className={st.listImage}>
                {item.image ? (
                  <Image src={item.image} alt={item.title} width={96} height={128} />
                ) : (
                  <div className={st.listImagePh} />
                )}
              </div>
              <div className={st.listInfo}>
                <div className={st.listInfoTop}>
                  <p className={st.listBrand}>{item.brand}</p>
                  <p className={st.listTitle}>{item.title}</p>
                  <p className={st.listMeta}>
                    {item.color ? <>{item.color} · </> : null}
                    Размер {item.sizeLabel}
                    {item.qty > 1 ? <> · {item.qty} шт.</> : null}
                  </p>
                </div>
                <p className={st.listPrice}>{transformPrice(item.price * item.qty)}</p>
              </div>
            </Link>
            <button
              type="button"
              className={st.listRemove}
              onClick={() => onRemove(item.key)}
              aria-label="Удалить"
            >
              <Icon name="CloseIcon" />
            </button>
          </li>
        ))}
      </ul>
      {items.length > 1 && (
        <button type="button" className={st.clearBtn} onClick={onClear}>
          Очистить корзину
        </button>
      )}
    </>
  );
}

function BoutiqueStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={st.boutiqueList}>
      <p className={st.sectionHelp}>Выберите бутик, где хотите примерить выбранные вещи.</p>
      {BOUTIQUES.map(b => (
        <label
          key={b.id}
          className={cn(st.boutiqueCard, { [st.boutiqueCardActive]: selected === b.id })}
        >
          <input
            type="radio"
            name="boutique"
            value={b.id}
            checked={selected === b.id}
            onChange={() => onSelect(b.id)}
            className={st.boutiqueRadio}
          />
          <div className={st.boutiqueImage}>
            <Image src={b.image} alt={b.title} fill sizes="120px" />
          </div>
          <div className={st.boutiqueInfo}>
            <p className={st.boutiqueTitle}>{b.title}</p>
            <p className={st.boutiqueAddress}>
              {b.city}, {b.address}
            </p>
            <p className={st.boutiqueTime}>{b.schedule}</p>
          </div>
          <span className={st.boutiqueCheck} aria-hidden />
        </label>
      ))}
    </div>
  );
}

function ContactsStep({
  name,
  phone,
  boutique,
  onName,
  onPhone,
}: {
  name: string;
  phone: string;
  boutique?: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
}) {
  return (
    <div className={st.contacts}>
      {boutique && (
        <div className={st.pickSummary}>
          <span className={st.pickLabel}>Бутик для примерки</span>
          <span className={st.pickValue}>{boutique}</span>
        </div>
      )}
      <label className={st.field}>
        <span className={st.fieldLabel}>Имя</span>
        <input
          type="text"
          className={st.fieldInput}
          value={name}
          onChange={e => onName(e.target.value)}
          placeholder="Как к вам обращаться"
          autoComplete="name"
        />
      </label>
      <label className={st.field}>
        <span className={st.fieldLabel}>Телефон</span>
        <input
          type="tel"
          className={st.fieldInput}
          value={phone}
          onChange={e => onPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          autoComplete="tel"
        />
      </label>
      <p className={st.privacy}>
        Мы свяжемся с вами для подтверждения времени примерки. Нажимая «Отправить», вы соглашаетесь с&nbsp;условиями сервиса MVST.
      </p>
    </div>
  );
}

function DoneStep({
  boutique,
  onMore,
  onReset,
}: {
  boutique?: string;
  onMore: () => void;
  onReset: () => void;
}) {
  return (
    <div className={st.done}>
      <div className={st.doneContent}>
        <div className={st.doneBadge}>
          <Icon name="CheckedIcon" />
        </div>
        <h3 className={st.doneTitle}>Запрос на примерку принят</h3>
        <p className={st.doneText}>
          Мы свяжемся с вами в ближайшее время для подтверждения визита
        </p>
        {boutique && (
          <span className={st.doneboutiquePill}>{boutique}</span>
        )}
      </div>
      <div className={st.doneBottom}>
        <div className={st.doneSeparator} />
        <div className={st.doneActions}>
          <button type="button" className={st.primaryBtn} onClick={onMore}>
            Продолжить покупки
          </button>
          <button type="button" className={st.doneGhostBtn} onClick={onReset}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
