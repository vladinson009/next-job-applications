'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { boardSchema } from '@/validations/boardValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { createNewBoard } from './actions/createNewBoard';
import { DialogClose } from '@/components/ui/dialog';

type CreateBoardSchema = z.infer<typeof boardSchema>;
type CreateBoardSchemaOutput = z.output<typeof boardSchema>;

type Props = {
  isOpen: (isOpen: boolean) => void;
};

export default function CreateBoardForm({ isOpen }: Props) {
  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: CreateBoardSchemaOutput) {
    try {
      const response = await createNewBoard(data.name);
      if (!response.success) {
        return;
      }
      isOpen(false);
      form.reset();
    } catch {}
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Board name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex  w-fit items-center gap-3 mx-auto">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Thinking...' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
