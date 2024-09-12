from extract import extract
from load import load
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
load_dotenv()


def lambda_handler(event, context):
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
    
    mode = "youtube"
    
    with engine.connect() as conn:
        for extracted_data in extract(conn, mode):
            load(extracted_data, conn, mode)
    
    return {
        "statusCode": 200,
    }


if __name__ == "__main__":
    lambda_handler("", "")
