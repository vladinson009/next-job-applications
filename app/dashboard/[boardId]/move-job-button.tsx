'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { moveJobById } from '../actions/moveJobById';

type Props = {
  columnId: string;
  jobId: string;
  direction: 'up' | 'down';
};

export default function MoveJobButton({ direction, columnId, jobId }: Props) {
  async function onMove() {
    await moveJobById({ columnId, direction, jobId });
  }
  return <DropdownMenuItem onClick={onMove}>Move {direction}</DropdownMenuItem>;
}
