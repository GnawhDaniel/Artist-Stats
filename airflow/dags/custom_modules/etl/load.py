import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import pandas as pd

load_dotenv()

def drop_table(table, conn):
    conn.execute(text(f'DROP TABLE IF EXISTS {table};'))
    conn.commit()

def load():
    conf ={
        'host':os.environ['DB_CONNECTION'],
        'port':'5432',
        'database':"artist_analysis",
        'user':"postgres",
        'password': os.environ["DB_PASSWORD"]
    }

    # future = True to avoid Deprecation Warning from SQL Alchemy
    engine = create_engine(
        "postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}".format(**conf), 
        future=True
        )

    with engine.connect() as conn:
        drop_table('temp_table', conn)

        # Insert Names
        names_table = pd.read_csv('csv/names_table.csv')
        names_table.to_sql(name='temp_table', con=conn, index=False)
        insert_sql = text("""INSERT INTO names
                          (SELECT * FROM temp_table) 
                          ON CONFLICT ON CONSTRAINT names_pkey DO NOTHING
                          """)
        conn.execute(insert_sql)
        drop_table('temp_table', conn)

        # Insert Artists
        artists_table = pd.read_csv('csv/artists_table.csv')
        artists_table.to_sql(name='temp_table', con=conn, index=False)
        insert_sql = text("""INSERT INTO artists
                          (SELECT date::date, artist_id, followers FROM temp_table) 
                          ON CONFLICT ON CONSTRAINT artists_pkey DO NOTHING
                          """)
        conn.execute(insert_sql)

        conn.execute(text('DROP TABLE IF EXISTS temp_table;'))
        conn.commit()
        drop_table('temp_table', conn)

        # Insert Genres
        genre_table = pd.read_csv('csv/artist_genres_table.csv')
        genre_table.to_sql(name='temp_table', con=conn, index=False)
        insert_sql = text("""INSERT INTO artist_genres
                          (SELECT * FROM temp_table) 
                          ON CONFLICT ON CONSTRAINT artist_genres_pkey DO NOTHING
                          """)
        conn.execute(insert_sql)
        drop_table('temp_table', conn)

        conn.commit()