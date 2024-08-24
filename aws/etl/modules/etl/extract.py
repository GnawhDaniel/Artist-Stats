import os
import logging
import requests
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
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


def extract() -> None:
    """
    Extract artist information from Spotify's API.
    artist_list_path: an absolute path to a list of artists to extract info
    """
    conf = {
        'host': os.environ['DB_CONNECTION'],
        'port': '5432',
        'database': "artist_analysis",
        'user': "postgres",
        'password': os.environ["DB_PASSWORD"]
    }

    # future = True to avoid Deprecation Warning from SQL Alchemy
    engine = create_engine(
        "postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}".format(
            **conf),
        future=True
    )

    artist_ids = []
    with engine.connect() as conn:
        insert_sql = text("""
                        SELECT DISTINCT artist_id
                        FROM public.names
                            """)

        res = conn.execute(insert_sql)
        artist_ids = [i[0] for i in res.all()]

    if artist_ids == []:
        raise Exception("Extracting artists from DB went wrong.")

    spotify_search_endpoint = 'https://api.spotify.com/v1/artists?ids='
    access_token = _get_spotify_token()
    headers = {"Authorization": "Bearer " + access_token}


    def get_artists_chunks(array, chunk_size=50): # Chunk size 50 because spotify batch limit
        for i in range(0, len(array), chunk_size):
            yield array[i:i + chunk_size]
    
    i = 0
    for chunk in get_artists_chunks(artist_ids):
        query = "%2C".join(chunk)
        res = requests.get(spotify_search_endpoint + query,
                               headers=headers, timeout=20).json()
        artists_dict = {}
        try:
            for artist in res['artists']:
                artist_id = artist["id"]
                artist_name = artist["name"]
                artist_genres = artist["genres"]
                artist_followers = artist['followers']['total']
                artist_image = artist['images'][0]["url"] if artist['images'] else ''
                artists_dict[artist_id] = {"artist_name": artist_name,
                                            "genre": artist_genres,
                                            "followers": artist_followers,
                                            "image_url": artist_image}
                
            df = pd.DataFrame.from_dict(artists_dict, orient='index')
            df.index.name = 'artist_id'
            df.reset_index(inplace=True)
            df.to_csv(f"/tmp/extracted_data_{i}.csv", index=False)
            
            i += 1
        except:
            raise Exception(f"Could not fetch artists with {spotify_search_endpoint+query}")