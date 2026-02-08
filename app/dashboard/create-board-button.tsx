import CreateBoardForm from './create-bord-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function CreateBoardButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set a name for your board</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CreateBoardForm />
      </DialogContent>
    </Dialog>
  );
}
