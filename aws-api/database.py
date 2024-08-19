from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

load_dotenv()

conf ={
    'host':os.getenv('DB_CONNECTION'),
    'port':'5432',
    'database':"artist_analysis",
    'user':"postgres",
    'password': os.getenv("DB_PASSWORD")
}

CONNECTION_STRING = "postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}".format(**conf)

engine = create_engine(CONNECTION_STRING)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()