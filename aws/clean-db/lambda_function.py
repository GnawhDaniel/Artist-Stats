from datetime import UTC, datetime
from dotenv import load_dotenv
from sqlalchemy import Column, DateTime, Integer, String, Text, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

load_dotenv()

conf = {
    'host': os.getenv('DB_CONNECTION'),
    'port': '5432',
    'database': "artist_analysis",
    'user': "postgres",
    'password': os.getenv("DB_PASSWORD")
}

CONNECTION_STRING = "postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}".format(
    **conf)

engine = create_engine(CONNECTION_STRING)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Session(Base):
    __tablename__ = 'sessions'
    __table_args__ = {'schema': 'google_auth'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(255), unique=True, nullable=False)
    google_id = Column(String(255))
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text)
    token_expires_at = Column(DateTime(timezone=True))
    session_expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True),
                        server_default='CURRENT_TIMESTAMP')
    last_accessed_at = Column(DateTime(timezone=True),
                              server_default='CURRENT_TIMESTAMP')


class TempState(Base):
    __tablename__ = 'temp_states'
    __table_args__ = {'schema': 'google_auth'}

    state_hash = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now(tz=UTC))
    expires_at = Column(DateTime)


def lambda_handler(event, context):
    with SessionLocal() as db:
        try:
            current_time = datetime.now(tz=UTC)

            # Delete old temp_states
            tempstates = db.query(TempState).filter(
                TempState.expires_at < current_time).all()

            for state in tempstates:
                db.delete(state)

            # Delete old sessions
            sessions = db.query(Session).filter(
                Session.session_expires_at < current_time).all()
            for session in sessions:
                db.delete(session)
            db.commit()

        except Exception as e:
            print("error", e)
            db.rollback()
    return {
        "statusCode": 200,
    }
