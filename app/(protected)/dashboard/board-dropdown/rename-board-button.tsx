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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { renameBoardById } from '@/features/dashboard/actions/renameBoardById';
import { BoardFromDB } from '@/types/Board';
import { boardSchema } from '@/validations/boardValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type Props = {
  board: BoardFromDB;
};
type StateHook = {
  setOpen: (boolean: boolean) => void;
};

export function RenameBoardButton({ board, setOpen }: Props & StateHook) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<z.infer<typeof boardSchema>>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board.name,
    },
  });
  async function onRename(data: z.output<typeof boardSchema>) {
    if (data.name === board.name) {
      return form.setError('name', {
        message: 'Choose different board name',
        type: 'validation',
      });
    }
    try {
      const response = await renameBoardById(board, data.name);

      if (!response.success) {
        switch (response.error) {
          case 'CHOOSE_DIFFERENT_NAME':
            form.setError('name', {
              message: 'Choose different board name',
              type: 'validation',
            });
            break;
          case 'NON_EXISTING_NAME':
            form.setError('name', {
              message: 'Board name is required',
              type: 'validation',
            });
            break;
          case 'UNAUTHORIZED':
            form.setError('name', {
              message: 'You are not authorized',
              type: 'validation',
            });
            break;
          case 'SERVER_ERROR':
            form.setError('name', {
              message: 'Something went wrong on the server',
              type: 'validation',
            });
            break;
        }
        return;
      }
      setIsModalOpen(false);
      setOpen(false);
    } catch (error) {
      console.error('[RenameBoardButton]', error);
    }
  }

  return (
    <DropdownMenuItem asChild>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
            <form className="space-y-3" onSubmit={form.handleSubmit(onRename)}>
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
                  <Button
                    onClick={setOpen.bind(null, false)}
                    type="button"
                    variant="outline"
                  >
                    Close
                  </Button>
                </DialogClose>

                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
}
