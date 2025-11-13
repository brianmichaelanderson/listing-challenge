'use client';

import { FormProvider as Form } from 'react-hook-form';

/**
 * Form Provider Wrapper
 * Wraps React Hook Form's FormProvider with our conventions
 */
export default function FormProvider({ children, methods, onSubmit }) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}













