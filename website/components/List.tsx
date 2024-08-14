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
          <div className="">
            <button
              key={index}
              className={`flex items-center gap-3 w-full p-2 ${
                className ? className : "hover:bg-gray-700"
              }`}
              onClick={() =>
                onClickArtist(artist["artist_id"], artist["artist_name"])
              }
            >
              {artist.image_url ? (
                <img
                  className="rounded-full w-9"
                  src={artist.image_url}
                  alt=""
                />
              ) : (
                <></>
              )}{" "}
              <li>{artist["artist_name"]}</li>
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}

interface PropAdd {
  artists: any[];
  artistSet: Set<string>;
  onClickArtist: (
    artist_id: string,
    artist_name: string,
    followers: number,
    image_url: string,
    genres: string[]
  ) => Promise<void>;
  className?: string;
}
export function ListAdd({
  artists,
  onClickArtist,
  className,
  artistSet,
}: PropAdd) {
  if (artists.length === 0) {
    return <></>;
  }

  return (
    <div className="max-h-80 lg:max-h-searchPopUp overflow-y-auto no-scrollbar">
      <ul>
        {artists.map((artist, index) => {
          const isArtistInSet = artistSet.has(artist["artist_id"]);
          return (
            <div key={index} className="">
              <button
                className={`flex items-center gap-3 w-full p-2 ${
                  isArtistInSet
                    ? "line-through text-gray-500"
                    : className
                    ? className
                    : "hover:bg-gray-700"
                }`}
                onClick={
                  isArtistInSet
                    ? undefined
                    : () =>
                        onClickArtist(
                          artist["artist_id"],
                          artist["artist_name"],
                          artist["followers"],
                          artist["image_url"],
                          artist["genres"]
                        )
                }
                disabled={isArtistInSet}
              >
                {artist.image_url ? (
                  <img
                    className="rounded-full w-9"
                    src={artist.image_url}
                    alt=""
                  />
                ) : (
                  <></>
                )}{" "}
                <li>{artist["artist_name"]}</li>
              </button>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
