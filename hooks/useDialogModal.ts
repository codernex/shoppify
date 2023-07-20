import { WrongAddressData } from '@/types';
import { create } from 'zustand';

interface DialogModal {
  isOpen: boolean;
  onOpen: (data: WrongAddressData) => void;
  onClose: () => void;
  data?: WrongAddressData;
}

export const useDialogModal = create<DialogModal>(set => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: WrongAddressData) =>
    set({
      isOpen: true,
      data
    }),
  onClose: () =>
    set({
      isOpen: false
    })
}));
