'use client';

import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { editJob } from '@/features/dashboard/actions/editJob';
import { JobFromDB } from '@/types/Job';
import { jobSchema } from '@/validations/jobValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type Props = {
  job: JobFromDB;
  setOpen: (boolean: boolean) => void;
};

export default function EditJobButton({ job, setOpen }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyName: job.companyName,
      title: job.title,
      location: job.location,
      salary: job.salary ?? 0,
      remote: job.remote ?? false,
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      form.clearErrors();
    }
  }, [isModalOpen, form]);

  async function onCreate(data: z.output<typeof jobSchema>) {
    const result = await editJob(data, job.columnId, job.boardId);
    if (!result.success) {
      return;
    }
    form.reset();
    setIsModalOpen(false);
    setOpen(false);
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger className="flex justify-between items-center p-2 text-sm hover:bg-secondary text-left w-full rounded-md">
        <span>Edit</span>
        <span>
          <EditIcon />
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit job at <Badge className="text-base">{job.companyName}</Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">Edit job</DialogDescription>
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
                <Button
                  onClick={setOpen.bind(null, false)}
                  type="button"
                  variant="outline"
                >
                  Close
                </Button>
              </DialogClose>

              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? 'Thinking...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
