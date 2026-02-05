'use client';
import { isRedirectError } from '@/lib/redirectError';
import { Button } from '../ui/button';
import { logoutAction } from './actions/logout-action';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'next-auth';

type Props = {
  user: User;
};

export default function AvatarMenu({ user }: Props) {
  async function onLogout() {
    try {
      await logoutAction();
    } catch (error) {
      if (isRedirectError(error)) return;
      toast.error("Something went wrong. Can't logout");
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar size="lg">
          <AvatarImage src={user?.image ?? ''} alt={user?.name?.at(0)} />
          <AvatarFallback className="bg-primary text-color2 text-2xl">
            {user?.name?.at(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Home</DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onLogout} variant="destructive">
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
