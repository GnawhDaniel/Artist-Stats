import datetime
import pandas as pd

def transform() -> None:
    """
    Transform extracted artist data from extract function. 
    Transform into three csv each representing the 3 tables 
    in PostgreSQL table on AWS RDS.
    """

    data = pd.read_csv("csv/extracted_data.csv")
    
    artists = data.loc[:, ['artist_id', 'followers']]
    artists['date'] = datetime.datetime.now().date()
    artists = artists.astype({'date': 'datetime64[ns]'})
    artists.to_csv("csv/artists_table.csv", index=False)

    artist_genres = data.loc[:, ['artist_id', 'genre']]
    artist_genres['genre'] = artist_genres['genre'].str.strip('[]').str.replace("'","").str.split(", ")
    artist_genres = artist_genres.explode('genre')
    artist_genres['genre'].loc[artist_genres['genre']==''] = 'none'
    artist_genres.to_csv("csv/artist_genres_table.csv", index=False)

    names = data.loc[:, ['artist_id', 'artist_name']]
    names.to_csv("csv/names_table.csv", index=False)


if __name__ == "__main__":
    transform()