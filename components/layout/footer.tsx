import Container from '../container';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Container className="rounded-t-4xl overflow-hidden bg-foreground py-5">
      <div className="flex flex-col sm:flex-row items-center justify-around ">
        <p className="p-1 text-secondary">Made with love by Vladimir</p>
        <p className="p-1 text-secondary">&copy; All Rights Reserverd {year}</p>
      </div>
    </Container>
  );
}
