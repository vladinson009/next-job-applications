import Container from '@/components/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Button>Create board</Button>
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
