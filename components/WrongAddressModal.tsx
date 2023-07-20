'use client';

import { useDialogModal } from '@/hooks/useDialogModal';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Checkbox } from './ui/checkbox';

interface WrongAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WrongAddressModal: React.FC<WrongAddressModalProps> = ({
  isOpen,
  onClose
}) => {
  const data = useDialogModal(state => state.data);

  const [check, setCheck] = useState('');

  const [checkedData, setCheckedData] = useState<{
    street: string;
    houseNumber: string;
    cityName: string;
    postCode: string;
  }>({
    cityName: '',
    houseNumber: '',
    street: '',
    postCode: ''
  });

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
                    The address you entered is appeared to be incorrect. Please
                    Select The correct Address
                  </p>
                </div>
                <div className='divider'>
                  <span className=''>Our Suggestions: </span>
                  <div className='hr' />
                </div>

                {data?.predictions && (
                  <div className='py-10'>
                    <div
                      className='p-4 border border-green-300 rounded-sm flex items-center gap-x-4 cursor-pointer'
                      onClick={() => {
                        if (data?.predictions) {
                          setCheckedData(data.predictions);
                        }
                      }}
                    >
                      <Checkbox
                        id='predictions'
                        onClick={e => {
                          setCheck(e.currentTarget.id);
                        }}
                        checked={check === 'predictions'}
                      />
                      <label
                        htmlFor='predictions'
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 '
                      >
                        {data.predictions.street} ,{'  '}
                        {data.predictions.houseNumber} <br />
                        <span className='bg-green-100 border-b border-b-green-300'>
                          {data.predictions.postCode}
                        </span>{' '}
                        {data.predictions.cityName}
                      </label>
                    </div>
                  </div>
                )}

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

                {data?.originalAddress && (
                  <div className='py-10'>
                    <div
                      className='p-4 border border-red-300 rounded-sm flex items-center gap-x-4 cursor-pointer '
                      onClick={() => {
                        if (data?.originalAddress) {
                          setCheckedData(data.originalAddress);
                        }
                      }}
                    >
                      <Checkbox
                        id='original'
                        className='data-[state=checked]:bg-white  border-black'
                        onClick={e => {
                          setCheck(e.currentTarget.id);
                        }}
                        checked={check === 'original'}
                      />
                      <label
                        htmlFor='original'
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 '
                      >
                        {data?.originalAddress.street} ,{'  '}
                        {data?.originalAddress.houseNumber} <br />
                        <span className='bg-red-100 border-b border-b-red-300'>
                          {data?.originalAddress.postCode}
                        </span>{' '}
                        {data?.originalAddress.cityName}
                      </label>
                    </div>
                  </div>
                )}

                <div className='p-4 bg-gray-100 rounded-md text-sm'>
                  Wrong addresses can lead to delivery problems and cause
                  additional costs.
                </div>

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Apply Selection
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
