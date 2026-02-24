'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { moveJobById } from '@/features/dashboard/actions/moveJobById';
import { ArrowDown, ArrowUp } from 'lucide-react';

type Props = {
  columnId: string;
  jobId: string;
  direction: 'up' | 'down';
};

export default function MoveJobButton({ direction, columnId, jobId }: Props) {
  const arrow = direction == 'up' ? <ArrowUp /> : <ArrowDown />;
  async function onMove() {
    await moveJobById({ columnId, direction, jobId });
  }
  return (
    <DropdownMenuItem
      className="hover:cursor-pointer flex gap-1 items-center"
      onClick={onMove}
    >
      <span>{arrow}</span>
      <span>Move {direction}</span>
    </DropdownMenuItem>
  );
}
