import { useState } from "react";

export const useModalState = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openModal = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return { isOpen, selectedItem, openModal, closeModal };
};
