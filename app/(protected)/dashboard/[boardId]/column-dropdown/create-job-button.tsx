'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { jobSchema } from '@/validations/jobValidation';
import { PlusIcon } from 'lucide-react';
import { ColumnFromDB } from '@/types/Column';
import { Badge } from '@/components/ui/badge';
import { createNewJob } from '../../../../../features/dashboard/actions/createNewJob';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

type Props = {
  column: ColumnFromDB;
  boardId: string;
};

export default function CreateJobButton({ column, boardId }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyName: '',
      title: '',
      location: '',
      salary: 0,
      remote: false,
    },
  });

  useEffect(() => {
    if (!open) {
      form.clearErrors();
    }
  }, [open, form]);

  async function onCreate(data: z.output<typeof jobSchema>) {
    const result = await createNewJob(data, column.id, boardId);
    if (!result.success) {
      return;
    }
    form.reset();
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <PlusIcon className="text-primary" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create new job in <Badge className="text-base">{column.name}</Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create new job for your column
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onCreate)}>
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>

              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? 'Thinking...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
