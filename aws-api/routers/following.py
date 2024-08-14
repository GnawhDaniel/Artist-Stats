import datetime
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Cookie, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import UUID, text
from utils import db_dependency, is_access_token_expired
from starlette import status
from models import ArtistGenres, User, ArtistStats, Artists, MasterArtistView, UserFollowing
from .auth import get_current_user

router = APIRouter(
    prefix='/artists',
    tags=['auth']
)


user_dependency = Annotated[dict, Depends(get_current_user)]


class addArtistReq(BaseModel):
    artist_id: str = Field(min_length=22, max_length=22)
    artist_name: str
    image_url: str
    followers: int
    genres: List[str]


@router.post("/add-artist", status_code=status.HTTP_200_OK)
async def addArtist(db: db_dependency, artist: addArtistReq, session_id: Annotated[str | None, Cookie()] = None):
    print(artist)
    # No token provided
    if not session_id:  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    user = await get_current_user(db, session_id)

    print(artist)

    # Check if artist already exists
    existing_artist = db.query(Artists).filter(
        Artists.artist_id == artist.artist_id).first()
    if existing_artist:
        return {'code': '200', 'message': 'artist already exists in db'}
    
    # Add artist to tables
    else:
        try:
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
            artist_to_user = UserFollowing(
                id = user.id,
                artist_id = artist.artist_id,
                followed_date=datetime.datetime.now(tz=datetime.UTC)
            )
            db.add(artist_to_user)
            db.commit()
            
            # Add artist genres to genres table
            for genre in artist.genres:
                print(genre)
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
    # No token provided
    if not session_id:  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    _user = await get_current_user(db, session_id)

    if not query:
        artists = db.query(Artists).all()
    else:
        artists = db.query(Artists).filter(
            Artists.artist_name.ilike(f'%{query}%')).all()
    return artists


@router.get("/getgenrecount")
async def test(db: db_dependency, session_id: Annotated[str | None, Cookie()] = None):

    if not session_id:  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    user = await get_current_user(db, session_id)

    query = text("SELECT * FROM get_genre_counts(:user_id)")
    res = db.execute(query, {'user_id': user.id})
    return {"result": [{"label": genre, "value": count} for genre, count in res]}


@router.get("/{id}", status_code=status.HTTP_200_OK)
async def fetch_artist_stats(
    id: str,
    db: db_dependency,
    session_id: Annotated[str | None, Cookie()] = None
):
    # No token provided
    if not session_id:  # Must check this because of DB schema design
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not find user session")

    _user = await get_current_user(db, session_id)

    # Check if session token is live
    # if is_access_token_expired(user.session_id_expiry):
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

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
