'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
import { ColumnFromDB } from '@/types/Column';
import { deleteColumnById } from '../../../../../features/dashboard/actions/deleteColumnById';
import { Trash2 } from 'lucide-react';

type Props = {
  column: ColumnFromDB;
};
type StateHook = {
  setOpen: (boolean: boolean) => void;
};
export default function DeleteColumnButton({ column, setOpen }: Props & StateHook) {
  async function onDelete() {
    await deleteColumnById(column.id);
    setOpen(false);
  }

  return (
    <DropdownMenuItem asChild>
      <AlertDialog>
        <AlertDialogTrigger className="flex justify-between items-center p-2 text-sm hover:bg-secondary text-left w-full rounded-md text-destructive">
          <span>Delete</span>
          <span>
            <Trash2 />
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete &quot;{column.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your column
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={setOpen.bind(null, false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} variant="destructive">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
}
