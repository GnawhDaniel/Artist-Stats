from typing import Literal
from dotenv import load_dotenv
from sqlalchemy import Connection, text
from datetime import datetime, UTC
load_dotenv()


def drop_table(table, conn):
    conn.execute(text(f'DROP TABLE IF EXISTS {table};'))
    conn.commit()

def load(extracted_data: list[dict],
         conn: Connection,
         mode: Literal['spotify', 'x', 'youtube', 'instagram',
                       'soundcloud', 'tiktok', 'facebook', 'apple_music']
         ) -> None:

    columns = ['id', 'track_date', f'{mode}_followers']
    now = datetime.now(tz=UTC).strftime("%Y-%m-%d")

    insert_update_query = f"""
        INSERT INTO public.artist_follower_count ({', '.join(columns)})
        VALUES (:id, '{now}', :{mode}_followers)
        ON CONFLICT (id, track_date) DO UPDATE
        SET {mode}_followers = EXCLUDED.{mode}_followers
        """

    conn.execute(text(insert_update_query), extracted_data)
    conn.commit()