'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { addressCheck, getNameCheck, loadCountryStates } from '@/hooks';
import { cn } from '@/lib/utils';
import PostCodeAutoComplete from '@/components/PostCodeAutoComplete';
import CityAutoComplete from '@/components/CityAutoComplete';
import StreetAutoCompletion from '@/components/StreetAutoCompletion';
import { CountryState, NameCheckResponse, PredictionForAddress } from '@/types';
import { useDialogModal } from '@/hooks/useDialogModal';
import { WrongAddressModal } from './WrongAddressModal';
import { useInvalidModal } from '@/hooks/useInvalidModal';
import { InvalidAddressModal } from './InvalidAddressModal';

export const shippingFormSchema = z.object({
  salutation: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  country: z.string(),
  state: z.string(),
  postCode: z.string(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.string()
});

const countryData = [
  {
    countryId: '84702aaa0e434716a805a4e35bdf0bb6',
    countryCode: 'DE',
    language: 'de',
    countryName: 'Germany'
  }
];

export const CustomerForm = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  // Country State Data
  const [countryState, setCountryState] = useState<CountryState[]>([]);
  //Name Change Data
  const [nameChangeData, setNameChangeData] = useState<NameCheckResponse>({
    score: '',
    status: [],
    predictions: []
  });

  // Dialog Type
  const [dialogType, setDialogType] = useState<'wrong' | 'incorrect'>('');

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema)
  });

  // Watch the values of salutation, firstname, and lastname
  const salutation = form.watch('salutation');
  const firstName = form.watch('firstname');
  const lastName = form.watch('lastname');

  // Watch Country Data
  const country = form.getValues('country') || countryData[0].countryId;

  //Coutnry Data
  useEffect(() => {
    if (country)
      loadCountryStates(country).then(result => {
        setCountryState(result);
      });
  }, [country]);

  // Send API request when any of the three fields are updated
  useEffect(() => {
    // Perform your API request to verify salutation, firstname, and lastname
    if (firstName && lastName && salutation) {
      const verifyNameData = async () => {
        try {
          const response = await getNameCheck({
            lastName,
            firstName,
            salutation
          });

          // Handle the API response here
          if (response) {
            console.log(response);

            setNameChangeData(response);
          }
        } catch (error) {
          console.error('API error:', error);
        }
      };

      verifyNameData();
    }
  }, [salutation, firstName, lastName]);

  useEffect(() => {
    if (firstName && lastName && !salutation) {
      const verifyNameData = async () => {
        try {
          const response = await getNameCheck({
            lastName,
            firstName,
            salutation: 'x'
          });

          // Handle the API response here
          if (response) {
            form.setValue('salutation', response.predictions[0].salutation);
            setNameChangeData(response);
          }
        } catch (error) {
          console.error('API error:', error);
        }
      };

      verifyNameData();
    }
  }, [firstName, lastName, salutation]);

  useEffect(() => {
    form.setValue('country', countryData[0].countryId);
  }, []);

  // House Number & Address Validation
  const dialogModal = useDialogModal();
  const invalidModal = useInvalidModal();

  // Function to handle API call and response
  const handleAPICall = async () => {
    try {
      const result: { status: string[]; predictions: PredictionForAddress[] } =
        await addressCheck({
          cityName: form.getValues('city'),
          country: countryData[0].countryCode,
          language: countryData[0].language,
          postCode: form.getValues('postCode'),
          houseNumber: form.getValues('houseNumber'),
          street: form.getValues('street')
        });

      if (result.status && result.status.length > 0) {
        const correct = result.status.filter(st => st === 'address_correct');

        console.log(correct);

        if (correct.length === 0) {
          if (result.predictions.length > 0) {
            dialogModal.onOpen({
              originalAddress: {
                cityName: form.getValues('city'),
                houseNumber: form.getValues('houseNumber'),
                postCode: form.getValues('postCode'),
                street: form.getValues('street')
              },
              predictions: result.predictions[0]
            });
          } else {
            invalidModal.onOpen({
              status: result.status.filter(
                s =>
                  s !== 'A1000' &&
                  s !== 'A1100' &&
                  s !== 'A3000' &&
                  s.split('_')[s.split('_').length - 1] !== 'correct'
              ),
              originalAddress: {
                cityName: form.getValues('city'),
                houseNumber: form.getValues('houseNumber'),
                postCode: form.getValues('postCode'),
                street: form.getValues('street')
              }
            });
          }
        }
      }

      // Save the API response in state
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-10'>
      <WrongAddressModal
        isOpen={dialogModal.isOpen}
        onClose={dialogModal.onClose}
      />
      <InvalidAddressModal
        isOpen={invalidModal.isOpen}
        onClose={invalidModal.onClose}
      />
      <h1 className='text-xl font-semibold'>I'm a new customer</h1>
      <hr className='my-4 text-black' />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(value => {
            console.log(value);
          })}
          className={'space-y-8 w-full'}
        >
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salutation*</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl
                    className={cn(
                      'w-80 focus:ring-0',
                      nameChangeData.predictions.length
                        ? salutation ===
                          nameChangeData.predictions[0]?.salutation
                          ? 'border-green-400'
                          : 'border-yellow-400'
                        : 'border border-gray-200'
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder={'Salutation*'}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='x'>Not specified</SelectItem>
                    <SelectItem value='f'>Woman</SelectItem>
                    <SelectItem value='m'>Mister</SelectItem>
                    <SelectItem value='d'>Diverse</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
            name='salutation'
          />

          <div className='grid grid-cols-2 gap-8'>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name*</FormLabel>
                  <FormControl
                    className={cn(
                      '',
                      salutation ===
                        nameChangeData.predictions[0]?.salutation &&
                        nameChangeData.status.includes('name_is_real')
                        ? 'border border-green-500'
                        : ''
                    )}
                  >
                    <Input
                      autoComplete='off'
                      placeholder={'First Name'}
                      onChange={async e => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name='firstname'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name*</FormLabel>
                  <FormControl
                    className={cn(
                      '',
                      salutation ===
                        nameChangeData.predictions[0]?.salutation &&
                        nameChangeData.status.includes('name_is_real')
                        ? 'border border-green-500'
                        : ''
                    )}
                  >
                    <Input
                      autoComplete='off'
                      placeholder={'Last Name'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name='lastname'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New E-mail Address*</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='off'
                      placeholder={'Enter a new email address..'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name='email'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='off'
                      placeholder={'Enter password..'}
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <p className='text-sm text-neutral-500'>
                    Password must be atleast 8 character long
                  </p>
                  <FormMessage />
                </FormItem>
              )}
              name='password'
            />
          </div>

          <h1 className='text-xl font-semibold'>Your Address</h1>
          <hr />
          <div className='grid grid-cols-2 gap-x-8'>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={countryData[0].countryId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder={'Select Your Country...'}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryData.map(country => (
                        <SelectItem
                          key={country.countryId}
                          value={country.countryId}
                        >
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
              name='country'
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fedaral State *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder={'Select Your State..'}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryState.map(state => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
              name='state'
            />
          </div>

          <div className='grid grid-cols-12 gap-8'>
            <div className='col-span-2'>
              <FormField
                render={() => (
                  <FormItem>
                    <FormLabel>Post Code*</FormLabel>
                    <FormControl>
                      <PostCodeAutoComplete
                        countryData={countryData}
                        countryState={countryState}
                        form={form}
                      />
                    </FormControl>
                  </FormItem>
                )}
                name={'postCode'}
              />
            </div>
            <div className='col-span-4'>
              <FormField
                render={() => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <CityAutoComplete
                        countryData={countryData}
                        countryState={countryState}
                        form={form}
                      />
                    </FormControl>
                  </FormItem>
                )}
                name={'city'}
              />
            </div>
            <div className='col-span-4'>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address*</FormLabel>
                    <FormControl>
                      <StreetAutoCompletion
                        form={form}
                        countryData={countryData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name='street'
              />
            </div>
            <div className='col-span-2'>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Number*</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        placeholder={'House Number'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name='houseNumber'
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={handleAPICall}
              className='bg-[#0b539b] w-1/2'
            >
              Continue To Shipping
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
