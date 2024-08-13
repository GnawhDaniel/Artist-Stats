interface Props {
  followerCount: number;
  className?: string;
}


export default function FollowerCount({ followerCount, className }: Props) {
  return (
    <div className={`flex whitespace-pre p-4 rounded-3xl ${className}`}>
      <p>Following </p>
      <i className="text-blue-300">{followerCount}</i>
      <p>  Artists</p>
    </div>
  );
}
