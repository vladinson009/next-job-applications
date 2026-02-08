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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createNewJob } from '../actions/createNewJob';

type Props = {
  column: ColumnFromDB;
  boardId: string;
};

export default function CreateJobButton({ column, boardId }: Props) {
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyName: '',
      title: '',
      location: '',
      salary: 0,
      remote: 'false',
    },
  });
  async function onCreate(data: z.output<typeof jobSchema>) {
    await createNewJob(data, column.id, boardId);
  }
  return (
    <Dialog>
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
                  <FormLabel htmlFor="company-name">Company name</FormLabel>
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
                  <FormLabel htmlFor="title">Job title</FormLabel>
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
                  <FormLabel htmlFor="location">Location</FormLabel>
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
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        defaultChecked={true}
                        className="flex"
                        disabled={form.formState.isSubmitting}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="true" id="r1" />
                          <Label htmlFor="r1">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="false" id="r2" />
                          <Label htmlFor="r2">No</Label>
                        </div>
                      </RadioGroup>
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
              <DialogClose asChild>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? 'Thinking...' : 'Create'}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
