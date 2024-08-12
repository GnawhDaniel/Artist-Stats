interface ListProps {
  artists: any[];
  onClickArtist: (artist_id: string, artist_name: string) => Promise<void>;
}

export default function List({ artists, onClickArtist }: ListProps) {
  if (artists.length === 0) {
    return <></>;
  }
  return (
    <div className="max-h-80 lg:max-h-searchPopUp overflow-y-auto">
      <ul>
        {artists.map((artist, index) => (
          <div>
            <button
              className="w-full hover:bg-gray-700"
              onClick={() =>
                onClickArtist(artist["artist_id"], artist["artist_name"])
              }
            >
              <li key={index}>{artist["artist_name"]}</li>
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}
