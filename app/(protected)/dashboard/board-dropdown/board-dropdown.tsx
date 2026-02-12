'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BoardFromDB } from '@/types/Board';
import { MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { DeleteBoardButton } from './delete-board-button';
import { RenameBoardButton } from './rename-board-button';

type Props = {
  board: BoardFromDB;
};

export default function BoardDropDown({ board }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Content */}
        <RenameBoardButton board={board} setOpen={setOpen} />
        <DeleteBoardButton board={board} setOpen={setOpen} />
        {/* Content */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
