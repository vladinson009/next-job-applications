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
import { isRedirectError } from '@/lib/redirectError';
import { useState } from 'react';
import { generateVerificationToken } from '@/lib/generateVerificationToken';
import { toast } from 'sonner';
import { resendEmailHelper } from '../../../features/auth/resendEmail';
import { credentialSignIn } from '@/features/auth/actions';

export default function SignInForm() {
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      credential: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInOutputSchema) {
    try {
      const response = await credentialSignIn(data);

      if (!!response?.message) {
        form.setError('password', { message: response.message, type: 'server' });
        form.setError('credential', { message: '', type: 'server' });
      }
      if (response?.reason === 'emailVerified' && response.user) {
        setIsVerified(false);
        setUser(response.user);
      }
    } catch (error) {
      if (isRedirectError(error)) return;
    }
  }
  async function verifyEmail() {
    if (user?.email && user.username) {
      // Create verification token and push in DB
      try {
        const token = await generateVerificationToken(user.email);
        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;
        await resendEmailHelper({
          email: user.email,
          username: user.username,
          verifyUrl,
        });
        setIsVerified(true);
        toast.success('Email sent successfully');
        form.clearErrors();
      } catch {
        form.setError('password', {
          message: 'Something went wrong',
          type: 'server',
        });
      }
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
        <div className="flex flex-col w-fit items-center gap-3 mx-auto">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Thinking...' : 'Sign in'}
          </Button>
          {!isVerified && (
            <Button
              onClick={verifyEmail}
              variant="secondary"
              type="button"
              className="hover:scale-110"
            >
              Resend verification email
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
