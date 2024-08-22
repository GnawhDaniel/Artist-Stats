"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface ListProps {
  artists: any[];
  onClickArtist: (artist_id: string, artist_name: string, mode?: string) => Promise<void>;
  className?: string;
}

export default function List({ artists, onClickArtist, className }: ListProps) {
  if (artists.length === 0) {
    return <></>;
  }

  // State Variables
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [artistID, setArtistID] = useState("");
  const [artistName, setArtistName] = useState("");

  // Hide Popup upon scroll event
  const handleScroll = useCallback(() => {
    if (anchor) {
      setAnchor(null);
    }
  }, [anchor]);
  useEffect(() => {
    const listElement = listRef.current;

    // Add scroll event listener to the list element
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }

    // Add scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }

      // Remove scroll event listener from the window
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Create Popup When Clicking on Elipsis
  const handleClick = (event: React.MouseEvent<HTMLElement>, artist_id: string, artist_name: string) => {
    setAnchor(anchor ? null : event.currentTarget);
    setArtistID(artist_id);
    setArtistName(artist_name);
  };
  const open = Boolean(anchor);
  const id = open ? "simple-popper" : undefined;

  // Handle Delete
  const handleDelete = async (artist_id: string, artist_name: string) => {
    setAnchor(null);
    await onClickArtist(artist_id, artist_name, "delete");
  };

  // TSX
  return (
    <div ref={listRef} className="max-h-80 lg:max-h-searchPopUp overflow-y-auto">
      <ul>
        {artists.map((artist, index) => (
          <li
            key={artist.artist_id}
            className="group flex h-full items-center group-hover:bg-white"
          >
            <button
              className={`flex items-center gap-3 w-full p-2 justify-between ${
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
              <p>{artist["artist_name"]}</p>
            </button>
            <button
              type="button"
              className={`h-full size-6 mr-3 ${className}`}
              onClick={event => handleClick(event, artist.artist_id, artist.artist_name)}
            >
              <EllipsisVerticalIcon />
            </button>
            <BasePopup
              id={id}
              open={open}
              anchor={anchor}
              placement={"right-start"}
              disablePortal
            >
              <div className="flex flex-col bg-purple-600 border w-fit rounded-xl rounded-tr-none sm:rounded-tl-none p-4">
                <a href={`https://open.spotify.com/artist/${artistID}`} target="_blank" className="flex items-center gap-2">
                  <Image src="/spotify-icon.png" width={22} height={22} alt="spotify icon"></Image>
                  Spotify
                </a>
                <button onClick={() => handleDelete(artistID, artistName)} className="flex items-center gap-2">
                  <TrashIcon className="size-6 text-red-500"/>
                  Delete
                </button>
              </div>
            </BasePopup>
          </li>
        ))}
      </ul>
    </div>
  );
}

// List Add for Searching Artists on Spotify
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
    <div className="max-h-80 lg:max-h-searchPopUp overflow-y-auto">
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
                )}
                <li>{artist["artist_name"]}</li>
              </button>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
