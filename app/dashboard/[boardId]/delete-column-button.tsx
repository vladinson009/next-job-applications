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
import { deleteColumnById } from '../actions/deleteColumnById';

type Props = {
  column: ColumnFromDB;
};
export default function DeleteColumnButton({ column }: Props) {
  async function onDelete() {
    await deleteColumnById(column.id);
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
              Are you sure you want to delete &quot;{column.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your column
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
