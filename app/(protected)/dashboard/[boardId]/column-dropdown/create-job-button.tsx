'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { jobSchema } from '@/validations/jobValidation';
import { PlusIcon } from 'lucide-react';
import { ColumnFromDB } from '@/types/Column';
import { Badge } from '@/components/ui/badge';
import { createNewJob } from '../../../../../features/dashboard/actions/createNewJob';
import { useEffect, useState } from 'react';
import JobForm from '@/components/job-form';

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
      salary: ' ',
      remote: false,
      url: '',
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
      <DialogTrigger className="w-full rounded-sm hover:bg-secondary">
        <p className="text-primary flex gap-2 items-center">
          <span>
            <PlusIcon />
          </span>
          <span> Add item</span>
        </p>
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
        <JobForm form={form} onSubmit={onCreate}>
          Create
        </JobForm>
      </DialogContent>
    </Dialog>
  );
}
