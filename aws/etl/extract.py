import os
from typing import Generator, Literal
import requests
from dotenv import load_dotenv
from sqlalchemy import text, Connection
load_dotenv()


def _get_spotify_token():
    """
    Retrieve Spotify access token required to call Spotify's API.
    """
    client_id = os.environ["SPOTIFY_CLIENT_ID"]
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    res = requests.post("https://accounts.spotify.com/api/token",
                        headers=headers, data=data, timeout=20)
    return res.json()['access_token']

def youtube_api(chunk):
    """
    A generator handling Youtube API response structure.
    
    Args:
        chunk (dict): A dictionary of spotify IDs to internal DB IDs 
    """
    YOUTUBE_API_KEY = os.environ["YOUTUBE_API_KEY"]
    YOUTUBE_API_CALL = f'https://www.googleapis.com/youtube/v3/channels?part=statistics&key={YOUTUBE_API_KEY}&id='

    query = "%2C".join(chunk.keys())
    res = requests.get(YOUTUBE_API_CALL + query, timeout=20).json()

    artists_list = []
    for item in res["items"]:
        artists_list.append({
            "id": chunk[item["id"]],
            "youtube_followers": item["statistics"]["subscriberCount"]
        })

    return artists_list

def spotify_api(chunk):
    """
    A generator handling Spotify API response structure.
    
    Args:
        chunk (dict): A dictionary of spotify IDs to internal DB IDs 
    """
    query = "%2C".join(chunk)
    
    spotify_search_endpoint = 'https://api.spotify.com/v1/artists?ids='
    access_token = _get_spotify_token()
    headers = {"Authorization": "Bearer " + access_token}
    res = requests.get(spotify_search_endpoint + query,
                            headers=headers, timeout=20).json()
    
    artists_list = []
    for artist in res['artists']:
        artists_list.append({
            "id": chunk[artist["id"]],
            "spotify_followers": artist['followers']['total']  
        })
    
    return artists_list

def extract(conn: Connection,
            mode: Literal['spotify', 'x', 'youtube', 'instagram',
                          'soundcloud', 'tiktok', 'facebook', 'apple_music']
            ) -> Generator[list[dict], None, None]:
    """
    Extract artist information via API calls to different platforms.
    conn: SQLAlchemy Connection to DB
    mode: Where to get extracted data
    """

    # Chunk size 50 because Spotify batch limit
    def get_artists_chunks(chunk_size=50):
        offset = 0
        while True:
            artist_ids = {}
            insert_sql = text(f"""
                            SELECT DISTINCT({mode}_id), id
                            FROM public.artist_info
                            WHERE {mode}_id IS NOT NULL
                            ORDER BY id ASC
                            LIMIT {chunk_size}
                            OFFSET {offset}
                            """)
            res = conn.execute(insert_sql)
            artists = res.all()

            for i in artists:
                artist_ids[str(i[0])] = str(i[1])

            if not artists:
                return
            offset += chunk_size
            yield artist_ids

    for chunk in get_artists_chunks():
        match mode:
            case 'spotify':
                yield spotify_api(chunk)
            case 'youtube':
                yield youtube_api(chunk)

    return


if __name__ == "__main__":
    next(extract())
