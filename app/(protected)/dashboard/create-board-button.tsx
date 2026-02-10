'use client';
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
import { useState } from 'react';

export default function CreateBoardButton() {
  const [open, setOpen] = useState(false);

  function isOpen(isOpen: boolean) {
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set a name for your board</DialogTitle>
          <DialogDescription className="sr-only">
            Here you can choose your new board name
          </DialogDescription>
        </DialogHeader>
        <CreateBoardForm isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
}
