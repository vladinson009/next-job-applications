// 'use client';

// import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
// import { moveJobInColumnById } from '@/features/dashboard/actions/moveJobInColumnById';
// import { ArrowLeft, ArrowRight } from 'lucide-react';

// type Props = {
//   columnId: string;
//   jobId: string;
//   direction: 'left' | 'right';
// };

// export default function MoveJobInColumnButton({
//   direction,
//   columnId,
//   jobId,
// }: Props) {
//   const arrow = direction === 'left' ? <ArrowLeft /> : <ArrowRight />;
//   async function onMove() {
//     await moveJobInColumnById({ columnId, direction, jobId });
//   }
//   return (
//     <DropdownMenuItem
//       className="hover:cursor-pointer flex justify-between items-center"
//       onClick={onMove}
//     >
//       <span>Move {direction}</span>
//       <span>{arrow}</span>
//     </DropdownMenuItem>
//   );
// }
