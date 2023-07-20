import { create } from 'zustand';

interface AddressConfirmationProps {
  isConfirmed: boolean;
  setConfirm: () => void;
  isInvalid: boolean;
  setInvalid: () => void;
  setConfirmFalse: () => void;
}

export const useAddressConfirmation = create<AddressConfirmationProps>(set => ({
  isConfirmed: false,
  setConfirm() {
    return set({
      isConfirmed: true
    });
  },
  isInvalid: false,
  setInvalid: () => {
    return set({
      isInvalid: true
    });
  },
  setConfirmFalse: () => set({ isConfirmed: false })
}));
