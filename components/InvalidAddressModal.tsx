'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useInvalidModal } from '@/hooks/useInvalidModal';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { shippingFormSchema } from './customer-form';
import { useAddressConfirmation } from '@/hooks/useAddressConfirmation';
interface InvalidAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<z.infer<typeof shippingFormSchema>>;
}

export const InvalidAddressModal: React.FC<InvalidAddressModalProps> = ({
  isOpen,
  onClose,
  form
}) => {
  const data = useInvalidModal(state => state.data);

  const onConfirmAddress = useAddressConfirmation(state => state.setConfirm);

  const onConfirm = () => {
    if (data) {
      form.setValue('city', data.originalAddress.cityName);
      form.setValue('postCode', data.originalAddress.postCode);
      form.setValue('street', data.originalAddress.street);
      form.setValue('houseNumber', data.originalAddress.houseNumber);
      onConfirmAddress();
      form.setFocus('firstname');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h1'
                  className='text-lg font-medium leading-6 text-red-700'
                >
                  Check billing address
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    Your address could not be verified, please check and edit or
                    confirm it
                  </p>
                </div>

                <div className='divider'>
                  <span className=''>
                    Your Input:{' '}
                    <small
                      className='text-blue-400 cursor-pointer'
                      onClick={() => onClose()}
                    >
                      (edit)
                    </small>
                  </span>
                  <div className='hr' />
                </div>
                <div className='p-4 space-y-2'>
                  {data?.status &&
                    data.status.map((status, i) => {
                      return (
                        <li
                          key={i}
                          className='bg-red-200 text-red-500 rounded px-2 capitalize'
                        >
                          {status.split('_').join(' ')}
                        </li>
                      );
                    })}
                </div>

                {data?.originalAddress && (
                  <div className='py-10'>
                    <div
                      className='p-4 border border-red-300 rounded-sm flex items-center gap-x-4 cursor-pointer '
                      // onClick={() => {
                      //   if (data?.originalAddress) {
                      //     setCheckedData(data.originalAddress);
                      //   }
                      // }}
                    >
                      <label
                        htmlFor='original'
                        className='text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 leading-5 '
                      >
                        <span
                          className={cn(
                            '',
                            data.status?.includes(
                              'street_name_needs_correction'
                            )
                              ? 'bg-red-100 border-b border-red-300'
                              : ''
                          )}
                        >
                          {data?.originalAddress.street} ,
                        </span>
                        <span
                          className={cn(
                            '',
                            data.status?.includes('building_number_not_found')
                              ? 'bg-red-100 border-b border-red-300'
                              : ''
                          )}
                        >
                          {data?.originalAddress.houseNumber} <br />
                        </span>
                        <span
                          className={cn(
                            '',
                            data.status?.includes(
                              'postal_code_needs_correction'
                            )
                              ? 'bg-red-100 border-b border-red-300'
                              : 'postal_code_needs_correction'
                          )}
                        >
                          {data?.originalAddress.postCode}
                        </span>{' '}
                        <span
                          className={cn(
                            '',
                            data.status?.includes('locality_needs_correction')
                              ? 'bg-red-100 border-b border-red-300'
                              : ''
                          )}
                        >
                          {data?.originalAddress.cityName}
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <div className='p-4 bg-gray-100 rounded-md text-sm'>
                  Wrong addresses can lead to delivery problems and cause
                  additional costs.
                </div>

                <div className='mt-4 flex justify-end gap-x-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    Confirm Address
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Edit Address
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
