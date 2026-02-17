/* eslint-disable @next/next/no-img-element */
import Container from '@/components/container';
import ContentSeparator from '@/components/content-separator';
import { Button } from '@/components/ui/button';
import { ChartAreaIcon, CheckLineIcon, Folder, UserLockIcon } from 'lucide-react';
import Link from 'next/link';
const features = [
  { title: 'Move Columns & Jobs Workflow', position: 0, icon: <CheckLineIcon /> },
  { title: 'Secure Authentication', position: 1, icon: <UserLockIcon /> },
  { title: 'Track Salary & Location', position: 2, icon: <ChartAreaIcon /> },
  { title: 'Multiple Boards', position: 3, icon: <Folder /> },
];

export default async function HomePage() {
  return (
    <>
      <Container className="flex flex-col my-5">
        <section className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex basis-1/2 flex-col items-center justify-center text-center gap-4">
            <h1 className="prose ">Track Your Job Applications Like a Pro</h1>
            <p className="text-muted-foreground">
              Organize applications, track interview stages, and stay focused — all
              in one clean Kanban board.
            </p>
            <div className="flex gap-5">
              <Button variant="outline" asChild className="mt-auto">
                <Link href="/">View Demo</Link>
              </Button>
              <Button asChild className="mt-auto">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
          <div className="w-full sm:basis-1/2">
            <img className="" src="/kanban.png" alt="Kanban board" />
          </div>
        </section>
      </Container>
      <ContentSeparator direction="y" />

      <Container>
        <h3>Visual demo of the columns</h3>
        <section className="flex gap-2 max-w-fit">
          <div className="flex-1">
            <img className="w-full" src="/board-1.png" alt="Board Example 1" />
          </div>
          <div className="flex-1">
            <img className="w-full" src="/board-2.png" alt="Board Example 2" />
          </div>
          <div className="flex-1">
            <img className="w-full" src="/board-3.png" alt="Board Example 3" />
          </div>
        </section>
      </Container>
      <ContentSeparator direction="y" />
      <Container className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between">
        <section>
          <h3>Features</h3>
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature.position} className="flex gap-3">
                <span className="text-primary">{feature.icon}</span>
                <span>{feature.title}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="text-center sm:text-left sm:max-w-1/2">
          <h3>Why This Exists?</h3>
          <p className="text-muted-foreground">
            Job searching can feel chaotic. This tool helps you stay organized,
            focused, and in control of your applications.
          </p>
        </section>
      </Container>
      <ContentSeparator direction="y" />
      <section className="bg-secondary py-5">
        <Container className="">
          <div className="flex flex-col items-center justify-center gap-3">
            <h2 className="text-center">Ready to organize your job search?</h2>
            <Button asChild>
              <Link href="/dashboard">Create Your First Board</Link>
            </Button>
          </div>
        </Container>
      </section>
      <ContentSeparator direction="y" />
    </>
  );
}
