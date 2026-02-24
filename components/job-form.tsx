import { PropsWithChildren } from 'react';
import { Button } from './ui/button';
import { DialogClose, DialogFooter } from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { JobsOutputSchema } from '@/types/Job';

type Props = PropsWithChildren<{
  form: UseFormReturn<JobsOutputSchema>;
  onSubmit: SubmitHandler<JobsOutputSchema>;
}>;
export default function JobForm({ form, onSubmit, children }: Props) {
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="company-name">
                Company name<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="company-name"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                  placeholder="NAV"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">
                Job title<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="title"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                  placeholder="Developer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="location">
                Location<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="location"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                  placeholder="Oslo, Norway"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset className="flex gap-5">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="salary">Salary</FormLabel>
                <FormControl>
                  <Input
                    id="salary"
                    type="number"
                    disabled={form.formState.isSubmitting}
                    {...field}
                    placeholder="700000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remote"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="remote">Remote</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="url">URL</FormLabel>
              <FormControl>
                <Input
                  id="url"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                  placeholder="https://..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Thinking...' : children}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
