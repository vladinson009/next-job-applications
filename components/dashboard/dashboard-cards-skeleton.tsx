import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, MoreVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from([0, 1, 2]).map((board, idx) => (
        <Skeleton key={idx}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Badge className="bg-foreground">Loading...</Badge>
              </CardTitle>
              <CardDescription>
                <p>Created at:</p>
                <p>Last update:</p>
              </CardDescription>
              <CardAction>
                <MoreVertical className="text-primary" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Button variant="link" asChild>
                <Link href={`/dashboard/${board}`}>Show board</Link>
              </Button>
            </CardContent>
          </Card>
        </Skeleton>
      ))}
    </div>
  );
}
