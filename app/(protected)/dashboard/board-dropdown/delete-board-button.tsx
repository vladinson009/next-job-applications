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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteBoardById } from '@/features/dashboard/actions/deleteBoardById';
import { BoardFromDB } from '@/types/Board';
type Props = {
  board: BoardFromDB;
};
type StateHook = {
  setOpen: (boolean: boolean) => void;
};
export function DeleteBoardButton({ board, setOpen }: Props & StateHook) {
  async function onDelete() {
    await deleteBoardById(board.id);
    setOpen(false);
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
