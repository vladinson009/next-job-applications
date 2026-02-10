'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { deleteBoardById } from '@/features/dashboard/actions/deleteBoardById';
import { renameBoardById } from '@/features/dashboard/actions/renameBoardById';
import { BoardFromDB } from '@/types/Board';
import { boardSchema } from '@/validations/boardValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreVerticalIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type Props = {
  board: BoardFromDB;
};

export default function BoardDropDown({ board }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Content */}
        <DeleteBoardButton board={board} />
        <RenameBoardButton board={board} />
        {/* Content */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteBoardButton({ board }: Props) {
  async function onDelete() {
    await deleteBoardById(board.id);
  }
  return (
    <DropdownMenuItem asChild>
      <AlertDialog>
        <AlertDialogTrigger className="p-2 text-sm hover:bg-secondary text-left w-full rounded-md text-destructive">
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete &quot;{board.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your board
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} variant="destructive">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
}
function RenameBoardButton({ board }: Props) {
  const form = useForm<z.infer<typeof boardSchema>>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board.name,
    },
  });
  async function onRename(data: z.output<typeof boardSchema>) {
    await renameBoardById(board, data.name);
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
