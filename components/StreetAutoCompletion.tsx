import { Fragment, useMemo, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { getStreetNames } from '@/hooks';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { shippingFormSchema } from '@/components/customer-form';
import { CountryData, StreetData } from '@/types';

interface ICityProps {
  countryData: CountryData[];
  form: UseFormReturn<z.infer<typeof shippingFormSchema>>;
}

export default function StreetAutoCompletion({
  countryData,
  form
}: ICityProps) {
  const [streetData, setStreetData] = useState<StreetData[]>([]);
  const [selected, setSelected] = useState(streetData[0]);
  const [query, setQuery] = useState('');

  const filteredStreetData = useMemo(() => {
    return query === ''
      ? streetData
      : streetData.filter(street =>
          street.street.toLowerCase().includes(query.toLowerCase())
        );
  }, [streetData, query]);

  const formValue = form.getValues('street');

  return (
    <Combobox
      value={selected || formValue}
      onChange={value => {
        setSelected(value);
        form.setValue('street', value.streetName);
      }}
    >
      <div className='relative mt-1'>
        <div className='relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
          <Combobox.Input
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            displayValue={() => formValue}
            onChange={event => {
              form.setValue('street', event.target.value);
              setQuery(event.target.value);

              if (form.getValues('postCode') && form.getValues('city'))
                getStreetNames({
                  country: countryData[0].countryCode,
                  language: countryData[0].language,
                  postCode: form.getValues('postCode'),
                  cityName: form.getValues('city'),
                  street: event.target.value,
                  houseNumber: ''
                }).then(res => {
                  if (res.predictions) setStreetData(res.predictions);
                });
              else alert('Please select a city and postal code first');
            }}
            placeholder={'Enter your city ...'}
          />
        </div>
      </div>
      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
        afterLeave={() => setQuery('')}
      >
        <Combobox.Options className='absolute mt-1 max-h-60 w-full max-w-[380px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {filteredStreetData.length === 0 && query !== '' ? (
            <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
              Nothing found.
            </div>
          ) : (
            filteredStreetData.map((street, key) => (
              <Combobox.Option
                key={key}
                className={({ active }) =>
                  `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                    active ? '' : 'text-gray-900'
                  }`
                }
                value={street}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      <span>
                        <span className='bg-green-300 border-b border-dashed border-green-500'>
                          {street.streetName.substring(0, formValue.length)}
                        </span>
                        <span>
                          {street.streetName.substring(formValue.length)}
                        </span>
                      </span>
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-teal-600'
                        }`}
                      >
                        <CheckIcon className='h-5 w-5' aria-hidden='true' />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
