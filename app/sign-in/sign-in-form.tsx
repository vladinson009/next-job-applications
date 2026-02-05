'use client';

import { signInSchema } from '@/validations/userValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignInOutputSchema, SignInSchema } from '@/types/User';
import { handleSignIn } from './actions/sign-in-action';
import { isRedirectError } from '@/lib/redirectError';

export default function SignInForm() {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      credential: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInOutputSchema) {
    try {
      const response = await handleSignIn(data);
      if (!!response?.message) {
        form.setError('password', { message: response.message, type: 'server' });
        form.setError('credential', { message: '', type: 'server' });
      }
    } catch (error) {
      if (isRedirectError(error)) return;
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="credential"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="credential">Username or Email</FormLabel>
              <FormControl>
                <Input
                  id="credential"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? 'Thinking...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}
