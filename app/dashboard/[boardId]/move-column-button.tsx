'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { moveColumnById } from '../actions/moveColumnById';

type Props = {
  boardId: string;
  columnId: string;
  direction: 'left' | 'right';
};

export default function MoveColumnButton({ direction, columnId, boardId }: Props) {
  async function onMove() {
    await moveColumnById({ boardId, columnId, direction });
  }
  return <DropdownMenuItem onClick={onMove}>Move {direction}</DropdownMenuItem>;
}
