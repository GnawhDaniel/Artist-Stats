interface Props {
  followerCount: number;
}

export default function FollowerCount({ followerCount }: Props) {
  return (
  <div className="flex whitespace-pre bg-gray-700 p-4 rounded-3xl">
    <p>Following </p>
    <i className="text-blue-300">{followerCount}</i>
    <p>  Artists</p>
  </div>
  );
}
