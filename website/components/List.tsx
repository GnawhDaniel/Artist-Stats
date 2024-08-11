interface ListProps {
  artists: any[];
  onClickArtist: (artist_id: string, artist_name: string) => Promise<void>;
}

export default function List({ artists, onClickArtist }: ListProps) {
    if (artists.length === 0){
        return <></>
    }
    console.log(artists)
    return (
    <div>
      <ul>
        {artists.map((artist, index) => (
          <div>
            <li key={index}>
              <button onClick={() => onClickArtist(artist["artist_id"], artist["artist_name"])}>
                {artist["artist_name"]}
              </button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
