'use client';

import { signUpSchema } from '@/validations/userValidation';
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
import { SignUpOutputSchema, SignUpSchema } from '@/types/User';
import { createUser } from './actions/create-user';
import { toast } from 'sonner';

export default function SignUpForm() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  async function onSubmit(data: SignUpOutputSchema) {
    try {
      const response = await createUser(data);

      if (!response.success) {
        const err = response.error;
        if (err.type === 'validation') {
          err.issues.forEach((issue) => {
            const fieldName = issue.path[0] as keyof SignUpSchema;
            form.setError(fieldName, { type: 'server', message: issue.message });
          });
        } else {
          toast.error(err.message);
        }
        return;
      }
    } catch (error) {
      console.log('SignUpForm', error);
    }
  }
  /**
   * username
   * email
   * password
   * passwordConfirm
   */
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormControl>
                <Input
                  id="username"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
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
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password-confirm">Repeat password</FormLabel>
              <FormControl>
                <Input
                  id="password-confirm"
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
          {form.formState.isSubmitting ? 'Thinking...' : 'Sign up'}
        </Button>
      </form>
    </Form>
  );
}
