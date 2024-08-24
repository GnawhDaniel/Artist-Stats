import glob, os
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
                
        for file in glob.glob("/tmp/names_table_*.csv"):
            # Insert Names
            names_table = pd.read_csv(file)
            names_table.to_sql(name='temp_table', con=conn, index=False, if_exists='replace')
            insert_sql = text("""INSERT INTO names
                            (SELECT * FROM temp_table) 
                            ON CONFLICT ON CONSTRAINT names_pkey DO NOTHING
                            """)
            conn.execute(insert_sql)
            conn.commit()
            drop_table('temp_table', conn)
            os.remove(file)

        for file in glob.glob("/tmp/artists_table_*.csv"):        
            # Insert Artists
            artists_table = pd.read_csv(file)
            artists_table.to_sql(name='temp_table', con=conn, index=False, if_exists='replace')
            insert_sql = text("""INSERT INTO artists
                            (SELECT date::date, artist_id, followers FROM temp_table) 
                            ON CONFLICT ON CONSTRAINT artists_pkey DO NOTHING
                            """)
            conn.execute(insert_sql)
            conn.commit()
            drop_table('temp_table', conn)
            os.remove(file)

            
        for file in glob.glob("/tmp/artist_genres_table_*.csv"):
            # Insert Genres
            genre_table = pd.read_csv(file)
            genre_table.to_sql(name='temp_table', con=conn, index=False, if_exists='replace')
            insert_sql = text("""INSERT INTO artist_genres
                            (SELECT * FROM temp_table) 
                            ON CONFLICT ON CONSTRAINT artist_genres_pkey DO NOTHING
                            """)
            conn.execute(insert_sql)
            conn.commit()
            drop_table('temp_table', conn)
            os.remove(file)
                