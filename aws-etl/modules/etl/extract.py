import os
import logging
import requests
import pandas as pd
from dotenv import load_dotenv
import boto3
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
    client = boto3.client('s3')
    
    spotify_search_endpoint = 'https://api.spotify.com/v1/artists/'
    access_token = _get_spotify_token()

    response = client.get_object(
        Bucket="us-east-2-misc",
        Key='artists.txt'
    )
    artist_ids = [i.decode('utf8') for i in response["Body"].iter_lines()]
    
    # with open('artists.txt', 'r') as f:
    #     artist_ids = [i.strip() for i in f.readlines()]
        
    # Get raw data from Spotify's API
    artists_dict = {}
    for artist_id in artist_ids:
        try:
            headers = {"Authorization": "Bearer " + access_token}
            res = requests.get(spotify_search_endpoint+artist_id,
                            headers=headers, timeout=20).json()
            artist_name = res["name"]
            artist_genres = res["genres"]
            artist_followers = res['followers']['total']
            artists_dict[artist_id] = {"artist_name": artist_name,
                                    "genre": artist_genres,
                                    "followers": artist_followers}
        except KeyError:
            # Case if Spotify artist account is deleted
            logging.warning(f"Missing data for artist ID: {artist_id}")
            continue
        except Exception as e:
            # All other exceptions
            logging.error(f"Error processing artist ID {artist_id}: {str(e)}")
            raise

    df = pd.DataFrame.from_dict(artists_dict, orient='index')
    df.index.name = 'artist_id'
    df.reset_index(inplace=True)
    df.to_csv("/tmp/extracted_data.csv", index=False)
    return
    
    
if __name__ == "__main__":
    extract()