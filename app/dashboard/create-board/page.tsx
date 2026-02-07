import Container from '@/components/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateBoardForm from './create-bord-form';

export default function CreateNewBoard() {
  return (
    <Container className="my-5 xl:my-15">
      <Card className="text-center mx-auto max-w-100">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Create new board</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBoardForm />
        </CardContent>
      </Card>
    </Container>
  );
}
