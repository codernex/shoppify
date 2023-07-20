import { WrongAddressData } from '@/types';
import { create } from 'zustand';

interface InvalidModalProps {
  isOpen: boolean;
  onOpen: (data: WrongAddressData) => void;
  onClose: () => void;
  data: WrongAddressData | undefined;
}

export const useInvalidModal = create<InvalidModalProps>(set => ({
  data: undefined,
  isOpen: false,
  onClose() {
    return set({ isOpen: false });
  },
  onOpen(data) {
    return set({ isOpen: true, data });
  }
}));
