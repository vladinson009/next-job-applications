import Container from '@/components/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSafeUser } from '@/features/auth/actions';
import { dataFormatter } from '@/lib/dataFormatter';
import { PropsWithChildren } from 'react';
import ChangePasswordForm from './change-password';
import SetPasswordForm from './set-password-form';
import UserDetailsForm from './user-details-form';
import { differenceInYears } from 'date-fns';

export default async function ProfilePage() {
  const user = await fetchSafeUser();
  const birthday =
    user.birthday ?
      differenceInYears(new Date(), user.birthday).toString()
    : 'Not set yet';

  return (
    <Container>
      <Tabs
        defaultValue="overview"
        className="mt-5 flex items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user-details">Update info</TabsTrigger>
          <TabsTrigger value="password">
            {user.password ? 'Change password' : 'Set password'}
          </TabsTrigger>
        </TabsList>

        {/* User Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar size="lg">
                  <AvatarImage src={user.image || ''} />
                  <AvatarFallback>
                    {(user.name && user.name[0]) || ''}
                  </AvatarFallback>
                </Avatar>
                <p className="text-2xl flex items-center justify-between w-full">
                  <span>{user?.name}</span>
                  <Badge className="capitalize">{user.role}</Badge>
                </p>
              </CardTitle>
              <CardDescription>Profile overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <UserField label="Username">{user.username}</UserField>
              <UserField label="Email">
                {user.email} {!user.emailVerified && <Badge>Not verified</Badge>}
              </UserField>
              <UserField label="Age">{birthday}</UserField>
              <UserField label="Created">{dataFormatter(user.createdAt)}</UserField>
              <UserField label="Last Update">
                {dataFormatter(user.updatedAt)}
              </UserField>
              <UserField label="ID">{user.id}</UserField>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Details Settings */}
        <TabsContent value="user-details">
          <Card className="min-w-100">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Update user details</CardDescription>
            </CardHeader>
            <CardContent>
              <UserDetailsForm user={user} />
            </CardContent>
          </Card>

          {/* Password Tab Content */}
        </TabsContent>
        <TabsContent value="password">
          <Card className="min-w-100">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                {user.password ? 'Change password' : 'Set password'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.password ?
                <ChangePasswordForm />
              : <SetPasswordForm />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
function UserField({ children, label }: PropsWithChildren<{ label: string }>) {
  return (
    <p className="flex gap-x-2  items-center flex-wrap">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold flex items-center gap-2">{children}</span>
    </p>
  );
}
