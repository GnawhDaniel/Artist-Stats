import datetime
import pandas as pd
import glob, os

def transform() -> None:
    """
    Transform extracted artist data from extract function. 
    Transform into three csv each representing the 3 tables 
    in PostgreSQL table on AWS RDS.
    """
    i = 0
    for file in glob.glob("/tmp/extracted_data_*.csv"):
    
        data = pd.read_csv(file)
        
        artists = data.loc[:, ['artist_id', 'followers']]
        artists['date'] = datetime.datetime.now().date()
        artists = artists.astype({'date': 'datetime64[ns]'})
        artists.to_csv(f"/tmp/artists_table_{i}.csv", index=False)

        artist_genres = data.loc[:, ['artist_id', 'genre']]
        artist_genres['genre'] = artist_genres['genre'].str.strip('[]').str.replace("'","").str.split(", ")
        artist_genres = artist_genres.explode('genre')
        artist_genres = artist_genres[artist_genres['genre'] != '']  # Drop rows where genre is empty
        artist_genres.to_csv(f"/tmp/artist_genres_table_{i}.csv", index=False)

        names = data.loc[:, ['artist_id', 'artist_name']]
        names.to_csv(f"/tmp/names_table_{i}.csv", index=False)
        
        i += 1
        os.remove(file)
