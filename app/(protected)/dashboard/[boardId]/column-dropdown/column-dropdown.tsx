'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnFromDB } from '@/types/Column';
import { MoreVerticalIcon } from 'lucide-react';
import DeleteColumnButton from './delete-column-button';
import { useState } from 'react';
import MoveColumnButton from './move-column-button';
import { RenameColumnButton } from './rename-column-button';

type Props = {
  column: ColumnFromDB;
  columns: ColumnFromDB[];
  colIndex: number;
};

export default function ColumnDropdown({ column, columns, colIndex }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className="text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {column.position !== 1 && (
            <MoveColumnButton
              boardId={column.boardId}
              columnId={column.id}
              direction="left"
            />
          )}
          {columns.length - 1 !== colIndex && (
            <MoveColumnButton
              boardId={column.boardId}
              columnId={column.id}
              direction="right"
            />
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <RenameColumnButton column={column} setOpen={setOpen} />
          <DeleteColumnButton column={column} setOpen={setOpen} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
