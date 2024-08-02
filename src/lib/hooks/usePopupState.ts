import { useCallback, useState } from 'react';

export const usePopupState = (defaultOpened?: boolean) => {
  const [isOpen, setOpen] = useState(defaultOpened ?? false);

  const openPopup = useCallback(() => {
    setOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  const togglePopup = useCallback(() => {
    setOpen(prevState => !prevState);
  }, []);

  return {
    isOpen,
    openPopup,
    closePopup,
    togglePopup,
    setOpen,
  };
};
