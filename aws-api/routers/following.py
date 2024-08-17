import datetime
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Cookie, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import UUID, text
from utils import db_dependency, get_session, is_access_token_expired, is_session_valid
from starlette import status
from models import ArtistGenres, Session, GoogleUsers, ArtistStats, Artists, MasterArtistView, UserFollowing, User, GoogleUserFollowing
from .auth import get_current_user

router = APIRouter(
    prefix='/artists',
    tags=['auth']
)


class addArtistReq(BaseModel):
    artist_id: str = Field(min_length=22, max_length=22)
    artist_name: str
    image_url: str
    followers: int
    genres: List[str]


@router.post("/add-artist", status_code=status.HTTP_200_OK)
async def addArtist(db: db_dependency, artist: addArtistReq, session_id: Annotated[str | None, Cookie()] = None):
    session = get_session(session_id, db)
    # No token provided
    if not is_session_valid(session, db):  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session or session is invalid")

    # Check if artist already exists in user's following list
    existing_artist = db.query(GoogleUserFollowing.artist_id).filter(
        GoogleUserFollowing.artist_id == artist.artist_id).first()
    if existing_artist:
        return {'code': '200', 'message': "artist already exists in user's following list"}
    
    # Add artist to tables
    else:
        try:
            # Check if artist is in names table
            artist_in_db = db.query(Artists).filter(Artists.artist_id==artist.artist_id).first() 
            if not artist_in_db:
                # Add artist to names table
                new_artist = Artists(
                    artist_id=artist.artist_id,
                    artist_name=artist.artist_name
                )
                db.add(new_artist)
                db.commit()

                # Add artist to artists table
                artist_stats = ArtistStats(
                    artist_id=artist.artist_id,
                    followers=artist.followers,
                    date=datetime.datetime.now(tz=datetime.UTC).date()
                )
                db.add(artist_stats)
                db.commit()
                
            # Add artist to user profile
            artist_to_user = GoogleUserFollowing(
                id = session.google_id,
                artist_id = artist.artist_id,
                followed_date=datetime.datetime.now(tz=datetime.UTC)
            )
            db.add(artist_to_user)
            db.commit()
            
            # Add artist genres to genres table
            for genre in artist.genres:
                genre_to_add = ArtistGenres(
                    artist_id = artist.artist_id,
                    genre = genre
                )
                db.add(genre_to_add)
            db.commit()

            return {'code': '200', 'message': f"successfully added {artist.artist_name} with artist id {artist.artist_id}"}
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add artist"
            )


@router.get("/getall", status_code=status.HTTP_200_OK)
async def fetch_artists_query(db: db_dependency, query: str | None = None, session_id: Annotated[str | None, Cookie()] = None):
    session = get_session(session_id, db)
    
    # No token provided
    if not is_session_valid(session, db):  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    user = db.query(GoogleUsers).filter(GoogleUsers.google_id==session.google_id).first() 
    
    if not query:
        # query = text("SELECT * FROM public.get_user_following_google(:p_id)")
        # artists = db.execute(query, {"p_id": session.google_id}).all()
        # print(artists)
        artists = db.query(GoogleUserFollowing.artist_id, Artists.artist_name).\
            join(Artists, GoogleUserFollowing.artist_id == Artists.artist_id).\
            filter(GoogleUserFollowing.id == session.google_id).\
            all()
        artists = [{'artist_id': artist_id, 'artist_name': artist_name} for artist_id, artist_name in artists]
    else:
        artists = db.query(Artists).filter(
            Artists.artist_name.ilike(f'%{query}%')).all()
    return artists


@router.get("/getgenrecount")
async def test(db: db_dependency, session_id: Annotated[str | None, Cookie()] = None):
    session: Session = get_session(session_id, db)    
    
    if not is_session_valid(session, db):  
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    query = text("SELECT * FROM google_auth.get_genre_counts(:google_id)")
    res = db.execute(query, {"google_id": session.google_id})
    return {"result": [{"label": genre, "value": count} for genre, count in res]}


@router.get("/{id}", status_code=status.HTTP_200_OK)
async def fetch_artist_stats(
    id: str,
    db: db_dependency,
    session_id: Annotated[str | None, Cookie()] = None
):
    session = get_session(session_id, db)
    # No token provided
    if not is_session_valid(session, db):  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session or session is invalid")
    

    artist = db.query(ArtistStats).filter(
        ArtistStats.artist_id == id).order_by(ArtistStats.date).all()

    if artist:
        artist = [{"date": i.date, "followers": i.followers} for i in artist]
        artist_min = min(artist, key=lambda x: x["followers"])
        artist_max = max(artist, key=lambda x: x["followers"])

        return {"data": artist, "min_followers": artist_min, "max_followers": artist_max}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Could not find artist with id {id}")
