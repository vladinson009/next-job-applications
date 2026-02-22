'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { setPassword } from '@/db/queries/userQuery';
import { SetPasswordSchema } from '@/types/UserInfoUpdate';
import { passwordMatchSchema } from '@/validations/userValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SetPasswordForm() {
  const form = useForm<SetPasswordSchema>({
    resolver: zodResolver(passwordMatchSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  async function onSubmit(values: SetPasswordSchema) {
    try {
      const result = await setPassword(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Password created successfully');
      form.reset();
    } catch {
      return toast.error('Something went wrong on the server');
    }
    redirect('/profile');
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
              <Input
                {...field}
                type="password"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Type password"
                autoComplete="off"
                readOnly={form.formState.isSubmitting}
              />

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="passwordConfirm"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
              <Input
                {...field}
                type="password"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Type password again"
                autoComplete="off"
                readOnly={form.formState.isSubmitting}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Thinking...' : 'Create password'}
        </Button>
      </FieldGroup>
    </form>
  );
}
