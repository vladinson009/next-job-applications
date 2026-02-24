'use client';

import JobForm from '@/components/job-form';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
      url: job.url ?? '',
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      form.clearErrors();
    }
  }, [isModalOpen, form]);

  async function onEdit(data: z.output<typeof jobSchema>) {
    const result = await editJob(data, job.columnId, job.boardId, job.id);
    if (!result.success) {
      return;
    }
    form.reset();
    setIsModalOpen(false);
    setOpen(false);
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger className="flex gap-1 items-center p-2 text-sm hover:bg-secondary text-left w-full rounded-md">
        <span>
          <EditIcon className="size-5" />
        </span>
        <span>Edit</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit job at <Badge className="text-base">{job.companyName}</Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">Edit job</DialogDescription>
        </DialogHeader>
        <JobForm form={form} onSubmit={onEdit}>
          Edit
        </JobForm>
      </DialogContent>
    </Dialog>
  );
}
