'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { moveJobInColumnById } from '@/features/dashboard/actions/moveJobInColumnById';
import { ColumnFromDB } from '@/types/Column';
import { JobFromDB } from '@/types/Job';
import { ArrowLeftRightIcon, ArrowRight } from 'lucide-react';
import { useState } from 'react';
type Props = {
  columns: ColumnFromDB[];
  job: JobFromDB;
};
export default function NestedMoveDropdown({ columns, job }: Props) {
  const filteredColumns = columns.filter((col) => col.id !== job.columnId);
  const [open, setOpen] = useState(false);

  async function onMove(targetColumnId: string) {
    setOpen(false);
    await moveJobInColumnById({
      columnId: job.columnId,
      jobId: job.id,
      targetColumnId: targetColumnId,
    });
  }
  return (
    <DropdownMenuItem asChild>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Button className="px-2 py-1.5 text-sm font-normal" variant="ghost">
            <span className="flex gap-1 items-center">
              <ArrowLeftRightIcon className="text-muted-foreground" />
              <span>Move to column</span>
            </span>
            <span>
              <ArrowRight className="text-primary" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filteredColumns.map((col) => (
            <DropdownMenuItem
              onClick={onMove.bind(null, col.id)}
              key={col.id}
              className="hover:cursor-pointer"
            >
              {col.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuItem>
  );
}
