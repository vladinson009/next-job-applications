'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
import { BoardFromDB } from '@/types/Board';
import { useForm } from 'react-hook-form';
import { boardSchema } from '@/validations/boardValidation';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { editBoardById } from '../../../features/dashboard/actions/editBoardById';

type Props = {
  board: BoardFromDB;
};
export default function EditBoardButton({ board }: Props) {
  const form = useForm<z.infer<typeof boardSchema>>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board.name,
    },
  });
  async function onEdit(data: z.output<typeof boardSchema>) {
    await editBoardById(board, data.name);
  }

  return (
    <DropdownMenuItem asChild>
      <Dialog>
        <DialogTrigger
          type="button"
          className="p-2 text-sm hover:bg-secondary text-left w-full rounded-md"
        >
          Rename
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{board.name}</DialogTitle>
            <DialogDescription>Set a new name for your board</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onEdit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">New name</FormLabel>
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
}
