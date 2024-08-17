from datetime import UTC, datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime, ForeignKey, String, Text, Date, Integer
from database import Base
from sqlalchemy.dialects.postgresql import UUID

# Google Oauth
class TempState(Base):
    __tablename__ = 'temp_states'
    __table_args__ = {'schema': 'google_auth'}
    
    state_hash = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now(tz=UTC))
    expires_at = Column(DateTime)
    
    
class GoogleUsers(Base):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'google_auth'}
    
    google_id = Column(String(255), primary_key=True)
    user_name = Column(String(60), unique=True, nullable=False)
    email = Column(String(320), unique=True)
    first_name = Column(String(60), nullable=False)
    last_name = Column(String(60))
    created_at = Column(DateTime)
    

class Token(Base):
    __tablename__ = 'tokens'
    __table_args__ = {'schema': 'google_auth'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255), ForeignKey('google_auth.users.google_id', ondelete='CASCADE'), nullable=False)
    access_token = Column(Text)
    refresh_token = Column(Text)
    token_expires_at = Column(DateTime)
    created_at = Column(DateTime)  


# OAuth old
class User(Base):
    __tablename__ = 'user_info'
    __table_args__ = {'schema': 'auth'}
    
    id = Column(UUID(as_uuid=True), primary_key=True,
                index=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    hashed_password = Column(Text, nullable=False)
    created_date = Column(DateTime(timezone=True),
                          server_default='CURRENT_TIMESTAMP')
    session_id = Column(Text)
    session_id_expiry = Column(
        DateTime(timezone=True), server_default='CURRENT_TIMESTAMP')
    user_role = Column(String, server_default='user')


class UserFollowing(Base):
    __tablename__ = "user_following"
    __table_args__ = {'schema': 'auth'}
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    artist_id = Column(String, primary_key=True, index=True)
    followed_date = Column(DateTime(timezone=True))


# Artists
class ArtistStats(Base):
    __tablename__ = 'artists'
    
    artist_id = Column(String, primary_key=True, index=True)
    date = Column(Date, primary_key=True)
    followers = Column(Integer)


class Artists(Base):
    __tablename__ = 'names'
    
    artist_id = Column(String, primary_key=True, index=True)
    artist_name = Column(String)


class ArtistGenres(Base):
    __tablename__ = "artist_genres"
    __table_args__ = {'schema': 'public'}

    artist_id = Column(String, primary_key=True, index=True)
    genre = Column(String, primary_key=True)


class MasterArtistView(Base):
    __tablename__ = "artist_master"
    
    artist_id = Column(String, primary_key=True, index=True)
    artist_name = Column(String)
    date = Column(DateTime(timezone=True))
    followers = Column(Integer)
    genres = Column(String)


