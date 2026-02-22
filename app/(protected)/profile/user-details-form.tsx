'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { changeBirthdayDate } from '@/db/queries/userQuery';
import { dataFormatter } from '@/lib/dataFormatter';
import { SafeUserFromDB } from '@/types/User';
import {
  ChangeUserBirthdaySchema,
  ChangeUsernameSchema,
} from '@/types/UserInfoUpdate';
import {
  changeBirthdaySchema,
  changeUsernameSchema,
} from '@/validations/userValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function UserDetailsForm({ user }: { user: SafeUserFromDB }) {
  const [open, setOpen] = useState(false);
  const birthdayForm = useForm<ChangeUserBirthdaySchema>({
    resolver: zodResolver(changeBirthdaySchema),
    defaultValues: {
      birthday: user.birthday ? new Date(user.birthday) : undefined,
    },
  });
  const usernameForm = useForm<ChangeUsernameSchema>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      username: (user && user.username) || '',
    },
  });
  // Birthay form submit handler
  async function onBirthdaySubmit(data: ChangeUserBirthdaySchema) {
    const result = await changeBirthdayDate(data);

    if (!result.success && result.error) {
      Object.entries(result.error).forEach(([field, message]) => {
        birthdayForm.setError(field as keyof ChangeUserBirthdaySchema, {
          type: 'server',
          message,
        });
      });
      return;
    }
    toast.success('Birthday changed successfully');
  }

  // Username form submit handler
  function onUsernameSubmit() {
    console.log('submitted');
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <form className="w-100" onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}>
        <FieldGroup className="gap-4 flex flex-row items-end">
          <Controller
            name="username"
            control={usernameForm.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Change username</FieldLabel>
                <Input
                  {...field}
                  type="text"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Type username"
                  autoComplete="off"
                  readOnly={usernameForm.formState.isSubmitting}
                  className="max-w-55"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button disabled={usernameForm.formState.isSubmitting}>
            {usernameForm.formState.isSubmitting ? 'Thinking...' : 'Change username'}
          </Button>
        </FieldGroup>
      </form>
      <form className="w-100" onSubmit={birthdayForm.handleSubmit(onBirthdaySubmit)}>
        <FieldGroup className="gap-4 flex-row items-end">
          <Controller
            name="birthday"
            control={birthdayForm.control}
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Birthday Date</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button className="max-w-55" variant="outline" id="date">
                      {field.value ? dataFormatter(field.value) : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      defaultMonth={field.value}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpen(false);
                      }}
                      disabled={birthdayForm.formState.isSubmitting}
                    />
                  </PopoverContent>
                </Popover>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button disabled={birthdayForm.formState.isSubmitting}>
            {birthdayForm.formState.isSubmitting ? 'Thinking...' : 'Set birthday'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
