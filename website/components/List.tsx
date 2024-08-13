interface ListProps {
  artists: any[];
  onClickArtist: (artist_id: string, artist_name: string) => Promise<void>;
  className?: string;
}

export default function List({ artists, onClickArtist, className }: ListProps) {
  if (artists.length === 0) {
    return <></>;
  }
  return (
    <div className="max-h-80 lg:max-h-searchPopUp overflow-y-auto no-scrollbar">
      <ul>
        {artists.map((artist, index) => (
          <div>
            <button
              key={index}
              className={`w-full ${className ? className: "hover:bg-gray-700"}`}
              onClick={() =>
                onClickArtist(artist["artist_id"], artist["artist_name"])
              }
            >
              <li >{artist["artist_name"]}</li>
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}
