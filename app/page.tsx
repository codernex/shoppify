import { Container } from '@/components/container';
import { CustomerForm } from '@/components/customer-form';
import Image from 'next/image';

export default function Home() {
  return (
    <div className=''>
      <Container>
        <CustomerForm />
      </Container>
    </div>
  );
}
