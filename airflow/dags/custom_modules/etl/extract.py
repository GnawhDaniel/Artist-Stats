import os
import logging
import urllib
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

def _get_spotify_token():
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



def extract(artist_list_paths: list[str]) -> None:
    """
    Extract artist information from Spotify's API.
    artist_list_path: an absolute path to a list of artists to extract info
    """

    spotify_search_endpoint = 'https://api.spotify.com/v1/search?query='
    access_token = _get_spotify_token()

    artists = []

    for path in artist_list_paths:
        try:
            with open(path, mode='r', encoding='utf-8') as file:
                for artist in file:
                    artists.append(artist.strip())
        except FileNotFoundError:
            logging.error("Path '%s' does not exist.", path)

    artists_dict = {}
    for artist in artists:
        headers = {"Authorization": "Bearer " + access_token}
        query = urllib.parse.quote_plus(f"artist:{artist}")
        res = requests.get(spotify_search_endpoint+query+"&type=artist",
                           headers=headers, timeout=20).json()
        
        print(res["artists"]['items'])
        
        if res["artists"]['items']:
            artist_id = res['artists']['items'][0]['id']
            artist_name = res['artists']['items'][0]['name']
            artist_genres = res['artists']['items'][0]['genres']
            artist_followers = res['artists']['items'][0]['followers']['total']
            artists_dict[artist_id] = {"artist_name": artist_name,
                                    "genre": artist_genres,
                                    "followers": artist_followers}

    df = pd.DataFrame.from_dict(artists_dict, orient='index')
    df.index.name = 'artist_id'
    df.reset_index(inplace=True)
    df.to_csv("csv/extracted_data.csv", index=False)
    return