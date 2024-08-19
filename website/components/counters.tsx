interface Props {
  count: number;
  className?: string;
}


export function FollowerCount({ count, className }: Props) {
  return (
    <div className={`flex justify-center whitespace-pre p-4 rounded-3xl ${className}`}>
      <p>Following </p>
      <i className="text-blue-300">{count}</i>
      <p>  Artists</p>
    </div>
  );
}


export function GenreCount({ count, className }: Props) {
  return (
    <div className={`flex justify-center whitespace-pre p-4 rounded-3xl ${className}`}>
      <p>Lover of </p>
      <i className="text-blue-300">{count}</i>
      <p>  Genres</p>
    </div>
  );
}