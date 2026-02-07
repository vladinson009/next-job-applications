export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-around bg-foreground py-15">
      <p className="p-1 text-primary">Made with love by Vladimir</p>
      <p className="p-1 text-primary">&copy; All Rights Reserverd {year}</p>
    </footer>
  );
}
