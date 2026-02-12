'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { moveColumnById } from '@/features/dashboard/actions/moveColumnById';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Props = {
  boardId: string;
  columnId: string;
  direction: 'left' | 'right';
};

export default function MoveColumnButton({ direction, columnId, boardId }: Props) {
  const arrow = direction == 'left' ? <ArrowLeft /> : <ArrowRight />;
  async function onMove() {
    await moveColumnById({ boardId, columnId, direction });
  }
  return (
    <DropdownMenuItem
      className="flex justify-between items-center hover:cursor-pointer"
      onClick={onMove}
    >
      <span>Move {direction}</span>
      <span>{arrow}</span>
    </DropdownMenuItem>
  );
}
