type Props = {
  direction: 'x' | 'y';
};
export default function ContentSeparator({ direction }: Props) {
  if (direction === 'x') {
    return <div className="w-full h-px border-b border-b-primary my-4" />;
  }
  if (direction === 'y') {
    return <div className="w-px h-full border-r border-r-primary my-4" />;
  }
}
