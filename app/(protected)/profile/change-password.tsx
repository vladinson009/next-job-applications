'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { changePassword } from '@/db/queries/userQuery';
import { ChangePasswordSchema } from '@/types/UserInfoUpdate';
import { changePasswordSchema } from '@/validations/userValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    },
  });

  async function onSubmit(values: ChangePasswordSchema) {
    try {
      const result = await changePassword(values);
      if (!result.success) {
        if (result.fieldErrors) {
          form.setError('oldPassword', {
            message: result.fieldErrors.oldPassword[0],
          });
          return;
        }
        toast.error(result.error);
        return;
      }

      toast.success('Password changed successfully');
      form.reset();
    } catch {
      return toast.error('Something went wrong on the server');
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Old Password */}
      <FieldGroup className="gap-4">
        <Controller
          name="oldPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Old Password</FieldLabel>
              <Input
                {...field}
                type="password"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Old password"
                autoComplete="off"
                readOnly={form.formState.isSubmitting}
              />

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

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
                placeholder="New password"
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
              <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
              <Input
                {...field}
                type="password"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Repeat new password"
                autoComplete="off"
                readOnly={form.formState.isSubmitting}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Thinking...' : 'Change password'}
        </Button>
      </FieldGroup>
    </form>
  );
}
