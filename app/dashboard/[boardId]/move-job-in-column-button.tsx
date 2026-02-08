'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { moveJobInColumnById } from '../actions/moveJobInColumnById';

type Props = {
  columnId: string;
  jobId: string;
  direction: 'left' | 'right';
};

export default function MoveJobInColumnButton({
  direction,
  columnId,
  jobId,
}: Props) {
  async function onMove() {
    await moveJobInColumnById({ columnId, direction, jobId });
  }
  return <DropdownMenuItem onClick={onMove}>Move {direction}</DropdownMenuItem>;
}
